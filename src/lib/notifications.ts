import { supabase } from './supabase'

// Notification types
export interface Notification {
  id: string
  title: string
  body: string
  type: 'reminder' | 'achievement' | 'alert' | 'info'
  category: 'calendar' | 'agenda' | 'health' | 'plants' | 'finance' | 'dev' | 'general'
  priority: 'low' | 'medium' | 'high'
  scheduledFor?: string
  sentAt?: string
  read: boolean
  actionUrl?: string
  icon?: string
  data?: Record<string, any>
}

// Widget data types
export interface WidgetData {
  type: 'quick-stats' | 'today-tasks' | 'upcoming-events' | 'health-progress' | 'plant-care' | 'finance-summary' | 'dev-progress' | 'notes-summary'
  title: string
  data: any
  lastUpdated: string
  refreshInterval?: number // in minutes
}

// Push notification service
class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null
  private isSupported = 'serviceWorker' in navigator && 'PushManager' in window

  async initialize() {
    if (!this.isSupported) {
      console.warn('Push notifications not supported')
      return false
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js')

      // Request notification permission
      const permission = await this.requestPermission()
      if (permission === 'granted') {
        await this.subscribeToPush()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      return false
    }
  }

  private async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) return 'denied'
    
    const permission = await Notification.requestPermission()
    return permission
  }

  private async subscribeToPush() {
    if (!this.registration) return

    try {
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
      
      if (!vapidKey) {
        console.error('❌ VAPID_PUBLIC_KEY not found in environment variables')
      return
    }

      console.log('🔑 VAPID Key found:', vapidKey.substring(0, 20) + '...')
      
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey)
      })

      console.log('✅ Push subscription created:', subscription.endpoint)
      
      // Save subscription to database
      await this.saveSubscription(subscription)
    } catch (error) {
      console.error('❌ Failed to subscribe to push notifications:', error)
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
      }
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private async saveSubscription(subscription: PushSubscription) {
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert([{
        endpoint: subscription.endpoint,
        p256dh: btoa(String.fromCharCode.apply(null, 
          Array.from(new Uint8Array(subscription.getKey('p256dh') || new ArrayBuffer(0)))
        )),
        auth: btoa(String.fromCharCode.apply(null, 
          Array.from(new Uint8Array(subscription.getKey('auth') || new ArrayBuffer(0)))
        )),
        user_id: 'default'
      }], {
        onConflict: 'endpoint'
      })

    if (error) {
      console.error('Failed to save subscription:', error)
    }
  }

  async sendNotification(notification: Omit<Notification, 'id' | 'sentAt' | 'read'>) {
    if (!this.isSupported) return

    try {
      const notificationId = crypto.randomUUID()
      
      // Use service worker push notification for background delivery
      if (this.registration) {
        // Send push notification through service worker
        await this.registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/logo.png',
          badge: '/logo.png',
          tag: notificationId,
          data: notification.data,
          requireInteraction: notification.priority === 'high',
          silent: notification.priority === 'low'
        })
        
        console.log('📱 Push notification sent through service worker')
      } else {
        // Fallback to browser notification if service worker not available
        const browserNotification = new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/logo.png',
          badge: '/logo.png',
          tag: notificationId,
          data: notification.data,
          requireInteraction: notification.priority === 'high',
          silent: notification.priority === 'low'
        })

        // Add event listeners for better tracking
        browserNotification.onshow = () => {
          console.log('📱 Browser notification shown')
        }

        browserNotification.onclick = () => {
          browserNotification.close()
          // Focus the app window
          window.focus()
        }

        browserNotification.onerror = (error) => {
          console.error('❌ Browser notification error:', error)
        }
      }

      // Save to database
      await this.saveNotification({
        ...notification,
        id: notificationId,
        sentAt: new Date().toISOString(),
        read: false
      })
    } catch (error) {
      console.error('❌ Failed to send notification:', error)
    }
  }

  async scheduleNotification(notification: Omit<Notification, 'id' | 'sentAt' | 'read'>, scheduledFor: Date) {
    const delay = scheduledFor.getTime() - Date.now()
    
    if (delay <= 0) {
      await this.sendNotification(notification)
      return
    }

    // Save scheduled notification to database first
    const scheduledNotification = {
      ...notification,
      id: crypto.randomUUID(),
      scheduledFor: scheduledFor.toISOString(),
      sentAt: new Date().toISOString(),
      read: false
    }
    
    await this.saveNotification(scheduledNotification)

    // Use both setTimeout (for immediate testing) and database polling (for reliability)
    setTimeout(() => {
      this.sendNotification(notification)
    }, delay)

    // Also schedule using service worker if available (more reliable for background)
    if (this.registration && 'serviceWorker' in navigator) {
      try {
        // Send message to service worker to schedule notification
        this.registration.active?.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          notification: scheduledNotification,
          scheduledFor: scheduledFor.getTime()
        })
        console.log('📅 Notification scheduled in service worker for:', scheduledFor)
      } catch (error) {
        console.log('⚠️ Service worker scheduling failed, using setTimeout fallback')
      }
    }

    console.log(`📅 Notification scheduled for ${scheduledFor.toLocaleString()} (${Math.round(delay / 1000 / 60)} minutes from now)`)
  }

  private async saveNotification(notification: Notification) {
    // Ensure required fields are present
    if (!notification.id || !notification.title || !notification.body) {
      console.error('❌ Invalid notification data:', notification)
      return
    }

    // Map camelCase to snake_case for database
    const dbNotification = {
      id: notification.id,
      title: notification.title,
      body: notification.body,
      type: notification.type,
      category: notification.category,
      priority: notification.priority,
      scheduled_for: notification.scheduledFor,
      sent_at: notification.sentAt || new Date().toISOString(), // Ensure sent_at always has a value
      read: notification.read,
      action_url: notification.actionUrl,
      icon: notification.icon,
      data: notification.data,
      user_id: 'default'
    }

    console.log('💾 Saving notification to database:', {
      id: dbNotification.id,
      title: dbNotification.title,
      sent_at: dbNotification.sent_at
    })

    const { error } = await supabase
      .from('notifications')
      .insert([dbNotification])

    if (error) {
      console.error('❌ Failed to save notification:', error)
      console.error('📊 Notification data that failed:', dbNotification)
    } else {
      console.log('✅ Notification saved successfully')
    }
  }

  async getNotifications(limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Failed to fetch notifications:', error)
      return []
    }

    // Map database column names (snake_case) to our interface (camelCase)
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      body: item.body,
      type: item.type,
      category: item.category,
      priority: item.priority,
      scheduledFor: item.scheduled_for,
      sentAt: item.sent_at,
      read: item.read,
      actionUrl: item.action_url,
      icon: item.icon,
      data: item.data
    }))
  }

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  async markAllAsRead() {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false)

    if (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  async clearAllNotifications() {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all notifications

    if (error) {
      console.error('Failed to clear all notifications:', error)
      throw error
    }
  }

  async testPushNotification() {
    if (!this.isSupported) {
      console.log('❌ Push notifications not supported in this browser')
      return false
    }

    try {
      console.log('🧪 Testing push notification system...')
      
      // Check notification permission first
      const permission = await this.checkNotificationPermission()
      if (permission !== 'granted') {
        console.log('❌ Notification permission not granted:', permission)
        return false
      }
      
      // Check if we have a service worker registration
      if (!this.registration) {
        console.log('❌ No service worker registration found')
        return false
      }

      // Check if we have a VAPID key
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
      if (!vapidKey) {
        console.log('❌ No VAPID key found')
        return false
      }

      console.log('✅ VAPID key found:', vapidKey.substring(0, 20) + '...')

      // Check current subscription
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        console.log('✅ Push subscription found:', subscription.endpoint)
        return true
      } else {
        console.log('❌ No push subscription found - attempting to subscribe...')
        
        // Try to subscribe
        const newSubscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidKey)
        })
        
        console.log('✅ New push subscription created:', newSubscription.endpoint)
        
        // Save to database
        await this.saveSubscription(newSubscription)
        return true
      }
    } catch (error) {
      console.error('❌ Push notification test failed:', error)
      return false
    }
  }

  // Check and request notification permission
  async checkNotificationPermission(): Promise<NotificationPermission> {
    console.log('🔐 Checking notification permission...')
    
    if (!('Notification' in window)) {
      console.log('❌ Notifications not supported in this browser')
      return 'denied'
    }
    
    let permission = Notification.permission
    console.log('📱 Current permission:', permission)
    
    if (permission === 'default') {
      console.log('🔐 Requesting notification permission...')
      permission = await Notification.requestPermission()
      console.log('📱 Permission result:', permission)
    }
    
    return permission
  }

  // Send a test push notification immediately
  async sendTestPushNotification() {
    try {
      console.log('🧪 Sending test push notification...')
      
      await this.sendNotification({
        title: '🧪 Test Push Notification',
        body: 'This is a test push notification to verify the system works when app is closed!',
        type: 'info',
        category: 'general',
        priority: 'medium'
      })
      
      console.log('✅ Test push notification sent successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to send test push notification:', error)
      return false
    }
  }
}

// Widget service
class WidgetService {
  private widgets: Map<string, WidgetData> = new Map()
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map()

  async initializeWidgets() {
    // Initialize default widgets
    const defaultWidgets: Array<{ type: WidgetData['type']; refreshInterval: number }> = [
      { type: 'quick-stats', refreshInterval: 5 },
      { type: 'today-tasks', refreshInterval: 2 },
      { type: 'upcoming-events', refreshInterval: 10 },
      { type: 'health-progress', refreshInterval: 15 },
      { type: 'plant-care', refreshInterval: 30 },
      { type: 'finance-summary', refreshInterval: 10 },
      { type: 'dev-progress', refreshInterval: 5 },
      { type: 'notes-summary', refreshInterval: 15 }
    ]

    for (const widget of defaultWidgets) {
      await this.createWidget(widget.type, widget.refreshInterval)
    }
  }

  async createWidget(type: WidgetData['type'], refreshInterval?: number) {
    try {
      const widgetData = await this.generateWidgetData(type)
      
      this.widgets.set(type, {
        type,
        title: this.getWidgetTitle(type),
        data: widgetData,
        lastUpdated: new Date().toISOString(),
        refreshInterval
      })

      // Set up refresh interval
      if (refreshInterval) {
        const interval = setInterval(() => {
          this.refreshWidget(type)
        }, refreshInterval * 60 * 1000)
        
        this.refreshIntervals.set(type, interval)
      }

      return widgetData
    } catch (error) {
      console.error(`Failed to create widget ${type}:`, error)
      // Return fallback data
      return this.getFallbackData(type)
    }
  }

  private getFallbackData(type: WidgetData['type']): any {
    switch (type) {
      case 'quick-stats':
        return { taskCompletion: 0, devStreak: 0, plantsNeedWater: 0, waterIntake: 0 }
      case 'today-tasks':
        return []
      case 'upcoming-events':
        return []
      case 'health-progress':
        return { gymStreak: 0, waterIntake: 0, waterTarget: 8 }
      case 'plant-care':
        return { totalPlants: 0, needWater: 0, careTasks: 0 }
      case 'finance-summary':
        return { totalSpent: 0, totalEarned: 0, netAmount: 0, transactionCount: 0 }
      case 'dev-progress':
        return { currentStreak: 0, totalHours: 0, leetcodeSolved: 0, todayHours: 0, todayLeetcode: 0 }
      case 'notes-summary':
        return []
      default:
        return {}
    }
  }

  private getWidgetTitle(type: WidgetData['type']): string {
    const titles = {
      'quick-stats': 'Today\'s Progress',
      'today-tasks': 'Today\'s Tasks',
      'upcoming-events': 'Upcoming Events',
      'health-progress': 'Health Progress',
      'plant-care': 'Plant Care',
      'finance-summary': 'Finance Summary',
      'dev-progress': 'Development Progress',
      'notes-summary': 'Recent Notes'
    }
    return titles[type] || 'Widget'
  }

  async generateWidgetData(type: WidgetData['type']): Promise<any> {
    switch (type) {
      case 'quick-stats':
        return await this.getQuickStats()
      case 'today-tasks':
        return await this.getTodayTasks()
      case 'upcoming-events':
        return await this.getUpcomingEvents()
      case 'health-progress':
        return await this.getHealthProgress()
      case 'plant-care':
        return await this.getPlantCareData()
      case 'finance-summary':
        return await this.getFinanceSummary()
      case 'dev-progress':
        return await this.getDevProgress()
      case 'notes-summary':
        return await this.getNotesSummary()
      default:
        return {}
    }
  }

  private async getQuickStats() {
    // Import database functions
    const { getAgendaTasks, getDevRoadmapUserStats, getPlants, getHealthHabits } = await import('./database')
    
    const today = new Date().toISOString().split('T')[0]
    
    try {
      const [tasks, devStats, plants, healthData] = await Promise.all([
        getAgendaTasks(today),
        getDevRoadmapUserStats(),
        getPlants(),
        getHealthHabits('water', today)
      ])

      const taskCompletion = tasks.length > 0 
        ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
        : 0

      const needWater = plants.filter(p => new Date(p.next_watering) <= new Date()).length

      const waterIntake = healthData.length > 0 && healthData[0].data
        ? healthData[0].data.find((d: any) => d.date === today)?.completedGlasses || 0
        : 0

      return {
        taskCompletion,
        devStreak: devStats?.current_streak || 0,
        plantsNeedWater: needWater,
        waterIntake
      }
    } catch (error) {
      console.error('Error generating quick stats:', error)
      return { taskCompletion: 0, devStreak: 0, plantsNeedWater: 0, waterIntake: 0 }
    }
  }

  private async getTodayTasks() {
    const { getAgendaTasks } = await import('./database')
    const today = new Date().toISOString().split('T')[0]
    
    try {
      const tasks = await getAgendaTasks(today)
      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        priority: task.priority
      }))
    } catch (error) {
      console.error('Error generating today tasks:', error)
      return []
    }
  }

  private async getUpcomingEvents() {
    const { getCalendarEvents } = await import('./database')
    
    try {
      const events = await getCalendarEvents()
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const upcoming = events
        .filter((event: any) => {
          const eventDate = new Date(event.start_date)
          return eventDate >= now && eventDate < tomorrow
        })
        .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
        .slice(0, 3)

      return upcoming.map((event: any) => ({
        id: event.id,
        title: event.title,
        time: new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: event.category
      }))
    } catch (error) {
      console.error('Error generating upcoming events:', error)
      return []
    }
  }

  private async getHealthProgress() {
    const { getHealthHabits } = await import('./database')
    const today = new Date().toISOString().split('T')[0]
    
    try {
      const [gymData, waterData] = await Promise.all([
        getHealthHabits('gym'),
        getHealthHabits('water', today)
      ])

      // Calculate gym streak
      let gymStreak = 0
      if (gymData.length > 0 && gymData[0].data) {
        const sortedDays = [...gymData[0].data].sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        
        for (const day of sortedDays) {
          if (day.completed) {
            gymStreak++
      } else {
            break
          }
        }
      }

      // Get water intake
      const waterIntake = waterData.length > 0 && waterData[0].data
        ? waterData[0].data.find((d: any) => d.date === today)?.completedGlasses || 0
        : 0

      return {
        gymStreak,
        waterIntake,
        waterTarget: 8
      }
    } catch (error) {
      console.error('Error generating health progress:', error)
      return { gymStreak: 0, waterIntake: 0, waterTarget: 8 }
    }
  }

  private async getPlantCareData() {
    const { getPlants } = await import('./database')
    
    try {
      const plants = await getPlants()
      const needWater = plants.filter(p => new Date(p.next_watering) <= new Date()).length
      const totalPlants = plants.length
      const careTasks = plants.reduce((total, plant) => 
        total + (plant.care_tasks ? plant.care_tasks.length : 0), 0
      )

      return {
        totalPlants,
        needWater,
        careTasks
      }
    } catch (error) {
      console.error('Error generating plant care data:', error)
      return { totalPlants: 0, needWater: 0, careTasks: 0 }
    }
  }

  private async getFinanceSummary() {
    const { getFinanceTransactions } = await import('./database')
    
    try {
      const transactions = await getFinanceTransactions()
      const today = new Date().toISOString().split('T')[0]
      
      const todayTransactions = transactions.filter((t: any) => 
        t.date === today
      )
      
      const totalSpent = todayTransactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
      
      const totalEarned = todayTransactions
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

      const result = {
        totalSpent,
        totalEarned,
        netAmount: totalEarned - totalSpent,
        transactionCount: todayTransactions.length
      }
      
      return result
    } catch (error) {
      console.error('Error generating finance summary:', error)
      return { totalSpent: 0, totalEarned: 0, netAmount: 0, transactionCount: 0 }
    }
  }

  private async getDevProgress() {
    const { getDevRoadmapUserStats, getDevRoadmapDailyLogs } = await import('./database')
    
    try {
      const [userStats, dailyLogs] = await Promise.all([
        getDevRoadmapUserStats(),
        getDevRoadmapDailyLogs()
      ])
      
      const today = new Date().toISOString().split('T')[0]
      const todayLog = dailyLogs.find((log: any) => log.date === today)
      
      return {
        currentStreak: userStats?.current_streak || 0,
        totalHours: userStats?.total_hours || 0,
        leetcodeSolved: userStats?.leetcode_solved || 0,
        todayHours: todayLog?.hours_studied || 0,
        todayLeetcode: todayLog?.leetcode_solved || 0
      }
    } catch (error) {
      console.error('Error generating dev progress:', error)
      return { currentStreak: 0, totalHours: 0, leetcodeSolved: 0, todayHours: 0, todayLeetcode: 0 }
    }
  }

  private async getNotesSummary() {
    const { getNotes } = await import('./database')
    
    try {
      const notes = await getNotes()
      const recentNotes = notes
        .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 3)
      
      return recentNotes.map((note: any) => ({
        id: note.id,
        title: note.title,
        content: note.content?.substring(0, 50) + '...',
        updatedAt: note.updated_at
      }))
    } catch (error) {
      console.error('Error generating notes summary:', error)
      return []
    }
  }

  async refreshWidget(type: WidgetData['type']) {
    const widget = this.widgets.get(type)
    if (!widget) return

    const newData = await this.generateWidgetData(type)
    widget.data = newData
    widget.lastUpdated = new Date().toISOString()
    
    this.widgets.set(type, widget)
    
    // Trigger widget update event
    window.dispatchEvent(new CustomEvent('widget-updated', { 
      detail: { type, data: newData } 
    }))
  }

  getWidget(type: WidgetData['type']): WidgetData | undefined {
    return this.widgets.get(type)
  }

  getAllWidgets(): WidgetData[] {
    return Array.from(this.widgets.values())
  }

  destroyWidget(type: WidgetData['type']) {
    const interval = this.refreshIntervals.get(type)
    if (interval) {
      clearInterval(interval)
      this.refreshIntervals.delete(type)
    }
    this.widgets.delete(type)
  }

  destroyAllWidgets() {
    this.refreshIntervals.forEach(interval => clearInterval(interval))
    this.refreshIntervals.clear()
    this.widgets.clear()
  }
}

// Export singleton instances
export const pushNotificationService = new PushNotificationService()
export const widgetService = new WidgetService()

// Compatibility layer for existing components
export const notificationService = {
  async initialize() {
    try {
      return await pushNotificationService.initialize()
    } catch (error) {
      console.error('Failed to initialize notification service:', error)
      return false
    }
  },

  startTaskNotifications(tasks: any[]) {
    // Schedule notifications for tasks with time ranges
    tasks.forEach(task => {
      if (task.timeRange && !task.completed) {
        // Parse time range and schedule notification
        const timeMatch = task.timeRange.match(/(\d{1,2}):(\d{2})(am|pm)/i)
        if (timeMatch) {
          const [_, hour, minute, period] = timeMatch
          let hour24 = parseInt(hour)
          if (period.toLowerCase() === 'pm' && hour24 !== 12) hour24 += 12
          if (period.toLowerCase() === 'am' && hour24 === 12) hour24 = 0
          
          const scheduledTime = new Date()
          scheduledTime.setHours(hour24, parseInt(minute), 0, 0)
          
          // Schedule notification 5 minutes before the task time
          scheduledTime.setMinutes(scheduledTime.getMinutes() - 5)
          
          if (scheduledTime > new Date()) {
            pushNotificationService.scheduleNotification({
              title: '📋 Task Reminder',
              body: `Time for: ${task.name}`,
              type: 'reminder',
              category: 'agenda',
              priority: 'medium',
              actionUrl: '/agenda',
              data: { taskId: task.id }
            }, scheduledTime)
          }
        }
      }
    })
  },

  stopNotifications() {
    // This would typically clear scheduled notifications
    // For now, we'll just note that notifications are stopped
  }
}

// Notification scheduling helpers
export const scheduleReminders = {
  async plantWatering(plantId: string, plantName: string, nextWatering: Date) {
    await pushNotificationService.scheduleNotification({
      title: '🌱 Plant Care Reminder',
      body: `Time to water ${plantName}!`,
      type: 'reminder',
      category: 'plants',
      priority: 'medium',
      actionUrl: `/plant-care`,
      data: { plantId }
    }, nextWatering)
  },

  async taskReminder(taskId: string, taskTitle: string, dueTime: Date) {
    await pushNotificationService.scheduleNotification({
      title: '📋 Task Reminder',
      body: `Don't forget: ${taskTitle}`,
      type: 'reminder',
      category: 'agenda',
      priority: 'high',
      actionUrl: `/agenda`,
      data: { taskId }
    }, dueTime)
  },

  async eventReminder(eventId: string, eventTitle: string, eventTime: Date) {
    await pushNotificationService.scheduleNotification({
      title: '📅 Event Reminder',
      body: `Upcoming: ${eventTitle}`,
      type: 'reminder',
      category: 'calendar',
      priority: 'medium',
      actionUrl: `/calendar`,
      data: { eventId }
    }, eventTime)
  },

  async healthReminder(type: 'water' | 'gym' | 'medication', message: string, scheduledFor: Date) {
    const icons = { water: '💧', gym: '🏋️', medication: '💊' }
    const categories = { water: 'health', gym: 'health', medication: 'health' }
    
    await pushNotificationService.scheduleNotification({
      title: `${icons[type]} Health Reminder`,
      body: message,
      type: 'reminder',
      category: categories[type] as any,
      priority: 'medium',
      actionUrl: `/health-habits`,
      data: { type }
    }, scheduledFor)
  }
}

// Achievement notifications
export const achievementNotifications = {
  async streakMilestone(type: string, count: number) {
    await pushNotificationService.sendNotification({
      title: '🔥 Streak Achievement!',
      body: `Amazing! You've maintained your ${type} streak for ${count} days!`,
      type: 'achievement',
      category: 'general',
      priority: 'high',
      icon: '🏆'
    })
  },

  async goalCompleted(goalType: string, goalName: string) {
    await pushNotificationService.sendNotification({
      title: '🎉 Goal Completed!',
      body: `Congratulations! You've completed: ${goalName}`,
      type: 'achievement',
      category: 'general',
      priority: 'high',
      icon: '🎯'
    })
  },

  async habitFormed(habitName: string, days: number) {
    await pushNotificationService.sendNotification({
      title: '✨ Habit Formed!',
      body: `${habitName} is now a habit! You've done it for ${days} days.`,
      type: 'achievement',
      category: 'general',
      priority: 'medium',
      icon: '🌟'
    })
  }
} 