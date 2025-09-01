import { supabase } from './supabase'

class SimpleAgendaNotificationService {
  private isRunning = false
  private checkInterval: NodeJS.Timeout | null = null

  async start() {
    if (this.isRunning) return
    
    console.log('📋 Starting simple agenda notification service...')
    this.isRunning = true
    
    // Check immediately
    await this.checkAndSendNotifications()
    
    // Then check every minute
    this.checkInterval = setInterval(async () => {
      if (this.isRunning) {
        await this.checkAndSendNotifications()
      }
    }, 60 * 1000) // Check every minute
    
    console.log('✅ Simple agenda notification service started successfully')
  }

  async stop() {
    this.isRunning = false
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    
    console.log('📋 Simple agenda notification service stopped')
  }

  // Main function to check and send notifications
  private async checkAndSendNotifications() {
    try {
      console.log('🔍 Checking for agenda notifications...')
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0]
      
      // Get all tasks for today
      const { data: tasks, error } = await supabase
        .from('agenda_tasks')
        .select('*')
        .eq('date', today)
        .eq('completed', false)
        .order('task_order', { ascending: true })
      
      if (error) {
        console.error('❌ Error fetching today\'s tasks:', error)
        return
      }
      
      if (!tasks || tasks.length === 0) {
        console.log('📋 No tasks found for today')
        return
      }
      
      console.log(`📋 Found ${tasks.length} tasks for today`)
      
      // Check each task for notification time
      for (const task of tasks) {
        await this.checkTaskNotification(task)
      }
      
    } catch (error) {
      console.error('❌ Error in checkAndSendNotifications:', error)
    }
  }

  // Check if a specific task needs a notification
  private async checkTaskNotification(task: any) {
    try {
      // Skip if no time range
      if (!task.description) {
        return
      }
      
      // Parse the time range
      const { startTime, isValid } = this.parseTimeRange(task.description)
      if (!isValid) {
        console.log(`⚠️ Could not parse time for task: ${task.title}`)
        return
      }
      
      // Calculate notification time (5 minutes before task)
      const notificationTime = new Date(startTime.getTime() - (5 * 60 * 1000))
      const now = new Date()
      
      // Check if notification is due (within 1 minute window)
      const timeDiff = Math.abs(now.getTime() - notificationTime.getTime())
      const isNotificationDue = timeDiff <= 60 * 1000 // 1 minute window
      
      if (isNotificationDue) {
        console.log(`⏰ Notification due for task: ${task.title}`)
        await this.sendNotification(task)
      } else if (notificationTime > now) {
        const minutesUntilDue = Math.round((notificationTime.getTime() - now.getTime()) / (1000 * 60))
        console.log(`⏳ Task "${task.title}" notification in ${minutesUntilDue} minutes`)
      }
      
    } catch (error) {
      console.error(`❌ Error checking task notification for ${task.title}:`, error)
    }
  }

  // Parse time range like "3:00am - 4:00am" or "3:00pm"
  private parseTimeRange(timeRange: string): { startTime: Date; isValid: boolean } {
    try {
      // Try to parse a full time range first: "3:00pm - 4:00pm"
      const rangeMatch = timeRange.match(/^(\d{1,2}):(\d{2})(am|pm)\s*-\s*(\d{1,2}):(\d{2})(am|pm)$/i)
      
      // Fallback to single time: "3:00pm"
      const singleMatch = !rangeMatch ? timeRange.match(/^(\d{1,2}):(\d{2})(am|pm)$/i) : null
      
      let startHour: number | null = null
      let startMinute: number | null = null
      let startPeriod: string | null = null
      
      if (rangeMatch) {
        // Use the START part of the range
        startHour = parseInt(rangeMatch[1])
        startMinute = parseInt(rangeMatch[2])
        startPeriod = rangeMatch[3]
      } else if (singleMatch) {
        startHour = parseInt(singleMatch[1])
        startMinute = parseInt(singleMatch[2])
        startPeriod = singleMatch[3]
      }
      
      if (startHour === null || startMinute === null || !startPeriod) {
        return { startTime: new Date(), isValid: false }
      }
      
      // Validate time values
      if (startHour < 1 || startHour > 12 || startMinute < 0 || startMinute > 59) {
        return { startTime: new Date(), isValid: false }
      }
      
      // Convert to 24-hour format
      let hour24 = startHour
      if (startPeriod.toLowerCase() === 'pm' && hour24 !== 12) {
        hour24 += 12
      } else if (startPeriod.toLowerCase() === 'am' && hour24 === 12) {
        hour24 = 0
      }
      
      // Create the scheduled time for today
      const scheduledTime = new Date()
      scheduledTime.setHours(hour24, startMinute, 0, 0)
      
      return { startTime: scheduledTime, isValid: true }
      
    } catch (error) {
      console.error('❌ Error parsing time range:', error)
      return { startTime: new Date(), isValid: false }
    }
  }

  // Send the actual notification
  private async sendNotification(task: any) {
    try {
      console.log(`📱 Sending notification for: ${task.title}`)
      
      // Check if we already sent a notification for this task today
      const today = new Date().toISOString().split('T')[0]
      const notificationKey = `agenda_${task.id}_${today}`
      
      // Check if notification was already sent
      const { data: existingNotifications, error: checkError } = await supabase
        .from('notifications')
        .select('id')
        .eq('data->>notificationKey', notificationKey)
        .eq('category', 'agenda')
        .eq('type', 'reminder')
      
      if (checkError) {
        console.error('❌ Error checking existing notifications:', checkError)
        return
      }
      
      if (existingNotifications && existingNotifications.length > 0) {
        console.log(`⏭️ Notification already sent for task: ${task.title}`)
        return
      }
      
      // Send push notification
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.log('⚠️ Supabase URL or Anon Key not found, showing local notification')
        this.showLocalNotification(task)
        return
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
          notification: {
            title: '📋 Task Reminder',
            body: `Time for: ${task.title}`,
            type: 'reminder',
            category: 'agenda',
            priority: 'medium',
            icon: '/logo.png',
            data: { 
              taskId: task.id, 
              taskName: task.title, 
              taskTime: task.description 
            }
          },
          userId: 'default'
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Push notification sent for: ${task.title}`, result)
        
        // Save notification record to prevent duplicates
        await this.saveNotificationRecord(task, notificationKey)
        
      } else {
        const errorText = await response.text()
        console.log(`⚠️ Push notification failed for ${task.title} (${response.status}): ${errorText}`)
        this.showLocalNotification(task)
      }

    } catch (error) {
      console.error(`❌ Error sending notification for ${task.title}:`, error)
      this.showLocalNotification(task)
    }
  }

  // Save notification record to prevent duplicates
  private async saveNotificationRecord(task: any, notificationKey: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          title: '📋 Task Reminder',
          body: `Time for: ${task.title}`,
          type: 'reminder',
          category: 'agenda',
          priority: 'medium',
          data: { 
            taskId: task.id, 
            taskName: task.title, 
            taskTime: task.description,
            notificationKey: notificationKey
          },
          user_id: 'default'
        }])

      if (error) {
        console.error('❌ Error saving notification record:', error)
      } else {
        console.log(`✅ Notification record saved for: ${task.title}`)
      }
    } catch (error) {
      console.error('❌ Error saving notification record:', error)
    }
  }

  // Fallback to local notification
  private showLocalNotification(task: any) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📋 Task Reminder', {
        body: `Time for: ${task.title}`,
        icon: '/logo.png',
        tag: `agenda_${task.id}`,
        requireInteraction: false
      })
      
      console.log(`✅ Local notification shown for: ${task.title}`)
    }
  }

  // Manual check (useful for testing)
  async checkNow() {
    await this.checkAndSendNotifications()
  }

  // Test function to create a test notification
  async createTestNotification() {
    try {
      console.log('🧪 Creating test agenda notification...')
      
      const testTime = new Date(Date.now() + 1 * 60 * 1000) // 1 minute from now
      testTime.setSeconds(0, 0)
      
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          title: '📋 Task Reminder (TEST)',
          body: 'Time for: Test Task (This is a test)',
          type: 'reminder',
          category: 'agenda',
          priority: 'medium',
          data: { 
            taskId: 'test-task-123', 
            taskName: 'Test Task', 
            taskTime: 'test-time',
            notificationKey: 'test_key'
          },
          user_id: 'default'
        }])
        .select()
      
      if (error) {
        console.error('❌ Error creating test notification:', error)
        return false
      }
      
      console.log('✅ Test notification created:', data)
      console.log(`⏰ Test notification scheduled for: ${testTime.toLocaleString()}`)
      
      return true
    } catch (error) {
      console.error('❌ Error creating test notification:', error)
      return false
    }
  }
}

// Export singleton instance
export const simpleAgendaNotificationService = new SimpleAgendaNotificationService()

// Auto-start the service when this module is imported
if (typeof window !== 'undefined') {
  // Only start in browser environment
  setTimeout(() => {
    simpleAgendaNotificationService.start()
  }, 2000) // Start after 2 seconds
}
