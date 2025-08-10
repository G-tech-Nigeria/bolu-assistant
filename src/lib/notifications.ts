import { registerServiceWorker } from './serviceWorker'

// Notification Service for Daily Agenda
export class NotificationService {
  private static instance: NotificationService
  private registration: ServiceWorkerRegistration | null = null
  private isSupported = 'Notification' in window && 'serviceWorker' in navigator
  private notificationInterval: NodeJS.Timeout | null = null
  private snoozedTasks: Set<string> = new Set()

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.log('Notifications not supported in this browser')
      return false
    }

    try {
      // Register service worker for notifications
      try {
        this.registration = await registerServiceWorker()
        if (this.registration) {
          console.log('Service worker registered successfully for notifications')
        } else {
          console.log('Service worker registration returned null')
        }
      } catch (swError) {
        console.warn('Service worker registration failed, continuing without PWA features:', swError)
        // Continue without service worker - notifications will still work
      }

      // Request notification permission
      const permission = await this.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted')
        return true
      } else {
        console.log('Notification permission denied')
        return false
      }
    } catch (error) {
      console.error('Error initializing notifications:', error)
      return false
    }
  }

  private async requestPermission(): Promise<NotificationPermission> {
    if (Notification.permission === 'default') {
      return await Notification.requestPermission()
    }
    return Notification.permission
  }

  startTaskNotifications(tasks: any[]): void {
    if (!this.isSupported || Notification.permission !== 'granted') {
      return
    }

    // Clear existing interval
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval)
    }

    // Check for notifications every minute
    this.notificationInterval = setInterval(() => {
      this.checkTaskNotifications(tasks)
    }, 60000) // Check every minute

    // Also check immediately
    this.checkTaskNotifications(tasks)
  }

  private checkTaskNotifications(tasks: any[]): void {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    tasks.forEach(task => {
      if (task.completed || !task.timeRange) return

      const timeRange = task.timeRange
      const timeMatch = timeRange.match(/(\d{1,2}):(\d{2})(am|pm)/gi)
      
      if (!timeMatch || timeMatch.length < 2) return

      const startTime = timeMatch[0]
      const endTime = timeMatch[1]
      
      const startMinutes = this.parseTimeToMinutes(startTime)
      const endMinutes = this.parseTimeToMinutes(endTime)

      // Check if it's time for notification (5 minutes before start)
      const notificationTime = startMinutes - 5
      const taskKey = `${task.name}-${task.timeRange}`

      if (currentTime >= notificationTime && currentTime < startMinutes && !this.snoozedTasks.has(taskKey)) {
        this.sendTaskNotification(task, 'starting')
      }

      // Check if task is overdue (5 minutes after end time)
      const overdueTime = endMinutes + 5
      if (currentTime >= endMinutes && currentTime <= overdueTime && !this.snoozedTasks.has(taskKey)) {
        this.sendTaskNotification(task, 'overdue')
      }
    })
  }

  private parseTimeToMinutes(timeStr: string): number {
    const match = timeStr.match(/(\d{1,2}):(\d{2})(am|pm)/i)
    if (!match) return 0
    
    let hours = parseInt(match[1])
    const minutes = parseInt(match[2])
    const period = match[3].toLowerCase()
    
    if (period === 'pm' && hours !== 12) hours += 12
    if (period === 'am' && hours === 12) hours = 0
    
    return hours * 60 + minutes
  }

  private async sendTaskNotification(task: any, type: 'starting' | 'overdue'): Promise<void> {
    const taskKey = `${task.name}-${task.timeRange}`
    
    // Mark as snoozed to prevent spam
    this.snoozedTasks.add(taskKey)
    
    // Remove from snoozed after 10 minutes
    setTimeout(() => {
      this.snoozedTasks.delete(taskKey)
    }, 10 * 60 * 1000)

    const title = type === 'starting' ? 'Task Starting Soon!' : 'Task Overdue!'
    const body = type === 'starting' 
      ? `"${task.name}" starts in 5 minutes at ${task.timeRange}`
      : `"${task.name}" was due at ${task.timeRange}`

    const options = {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      silent: false, // Ensure sound plays
      tag: taskKey, // Prevent duplicate notifications
      requireInteraction: type === 'overdue', // Keep overdue notifications visible
      data: {
        taskId: task.id,
        taskName: task.name,
        type
      },
      actions: [
        {
                  action: 'complete',
        title: 'Mark Complete',
        icon: '/favicon.svg'
      },
      {
        action: 'snooze',
        title: 'Snooze 5 min',
        icon: '/favicon.svg'
        }
      ]
    }

    try {
      if (this.registration) {
        await this.registration.showNotification(title, options)
      } else {
        // Fallback to regular notifications
        new Notification(title, options)
      }
      
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  stopNotifications(): void {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval)
      this.notificationInterval = null
    }
  }

  async testNotification(): Promise<void> {
    if (!this.isSupported) {
      
      alert('Notifications not supported in this browser')
      return
    }
    
    if (Notification.permission !== 'granted') {
      
      alert('Please enable notifications first')
      return
    }

    
    

    const options = {
      body: 'This is a test notification from Daily Agenda! 🔊',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      silent: false, // Ensure sound plays
      requireInteraction: true, // Keep notification visible
      tag: 'test-notification', // Prevent duplicates
      data: {
        type: 'test',
        timestamp: Date.now()
      }
    }

    try {
      if (this.registration) {

        await this.registration.showNotification('🔔 Test Notification', options)
      } else {

        new Notification('🔔 Test Notification', options)
      }

      
      // Also try playing a sound directly as backup
      this.playNotificationSound()
      
    } catch (error) {
      console.error('❌ Error sending test notification:', error)
      alert(`Error sending notification: ${error}`)
    }
  }

  private playNotificationSound(): void {
    try {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
      
      
    } catch (error) {
      
    }
  }
}

export const notificationService = NotificationService.getInstance() 