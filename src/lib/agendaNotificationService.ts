import { supabase } from './supabase'

class AgendaNotificationService {
  private isRunning = false

  async start() {
    if (this.isRunning) return
    
    console.log('📋 Starting agenda notification service...')
    this.isRunning = true
    
    // Check for today's task notifications on startup
    await this.checkTodayTaskNotifications()
    
    console.log('✅ Agenda notification service started successfully')
  }

  async stop() {
    this.isRunning = false
    console.log('📋 Agenda notification service stopped')
  }

  // Schedule task notifications in database
  async scheduleTaskNotifications(tasks: any[]) {
    try {
      console.log('📋 Scheduling task notifications for', tasks.length, 'tasks')
      
      // Clear existing task notifications for today
      await this.clearTodayTaskNotifications()
      
      // Schedule notifications for tasks with time ranges
      for (const task of tasks) {
        await this.scheduleTaskNotification(task)
      }
      
      console.log('✅ Task notifications scheduled successfully')
    } catch (error) {
      console.error('❌ Error scheduling task notifications:', error)
    }
  }

  private async scheduleTaskNotification(task: any) {
    try {
      console.log('🔍 Processing task:', task.name, 'Time range:', task.timeRange)
      
      if (!task.timeRange || task.completed) {
        console.log('⏭️ Skipping task:', task.name, '- No time range or already completed')
        return
      }

      // Parse time range
      const { startTime, isValid } = this.parseTaskTime(task.timeRange)
      if (!isValid) {
        console.log('❌ Could not parse time for task:', task.name, 'value:', task.timeRange)
        return
      }

      // Schedule notification 5 minutes before task time
      const notificationTime = new Date(startTime.getTime() - (5 * 60 * 1000))
      
      // Only schedule if notification time is in the future
      if (notificationTime > new Date()) {
        console.log(`⏰ Scheduling notification for task "${task.name}" at ${notificationTime.toLocaleString()}`)
        
        // Check if notification already exists for this task
        const { data: existingNotifications, error: checkError } = await supabase
          .from('notifications')
          .select('id, data')
          .eq('category', 'agenda')
          .eq('type', 'reminder')
        
        if (checkError) {
          console.error(`❌ Failed to check existing notifications for task ${task.name}:`, checkError)
          return
        }
        
        // Filter by taskId
        const taskNotifications = existingNotifications?.filter(notification => 
          notification.data?.taskId === task.id
        ) || []
        
        const notificationData = {
          title: '📋 Task Reminder',
          body: `Time for: ${task.name}`,
          type: 'reminder',
          category: 'agenda',
          priority: 'medium',
          scheduled_for: notificationTime.toISOString(),
          action_url: '/agenda',
          data: { taskId: task.id, taskName: task.name, taskTime: task.timeRange },
          user_id: 'default'
        }
        
        if (taskNotifications.length > 0) {
          // Update existing notification
          const { error: updateError } = await supabase
            .from('notifications')
            .update(notificationData)
            .eq('id', taskNotifications[0].id)
          
          if (updateError) {
            console.error(`❌ Failed to update task notification for ${task.name}:`, updateError)
          } else {
            console.log(`✅ Task notification updated for ${task.name}`)
          }
        } else {
          // Create new notification
          const { error: insertError } = await supabase
            .from('notifications')
            .insert([notificationData])
          
          if (insertError) {
            console.error(`❌ Failed to create task notification for ${task.name}:`, insertError)
          } else {
            console.log(`✅ Task notification created for ${task.name}`)
          }
        }
      } else {
        console.log('⚠️ Task time has already passed, skipping notification for:', task.name)
      }
    } catch (error) {
      console.error(`❌ Error scheduling notification for task ${task.name}:`, error)
    }
  }

  private parseTaskTime(timeRange: string): { startTime: Date; isValid: boolean } {
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
  }

  private async clearTodayTaskNotifications() {
    try {
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('category', 'agenda')
        .eq('type', 'reminder')
        .gte('scheduled_for', startOfDay.toISOString())
        .lt('scheduled_for', endOfDay.toISOString())
      
      if (error) {
        console.error('❌ Error clearing today\'s task notifications:', error)
      } else {
        console.log('🗑️ Cleared today\'s task notifications')
      }
    } catch (error) {
      console.error('❌ Error clearing task notifications:', error)
    }
  }

  private async checkTodayTaskNotifications() {
    try {
      console.log('📋 Checking for today\'s task notifications...')
      
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
      
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('category', 'agenda')
        .eq('type', 'reminder')
        .not('scheduled_for', 'is', null)
        .gte('scheduled_for', startOfDay.toISOString())
        .lt('scheduled_for', endOfDay.toISOString())
        .eq('read', false)
      
      if (error) {
        console.error('❌ Error checking today\'s task notifications:', error)
        return
      }
      
      if (!notifications || notifications.length === 0) {
        console.log('📋 No task notifications found for today')
        return
      }
      
      console.log(`📋 Found ${notifications.length} task notification(s) for today`)
      
      // Send notifications that are due
      const now = new Date()
      for (const notification of notifications) {
        const scheduledTime = new Date(notification.scheduled_for)
        if (scheduledTime <= now) {
          await this.sendTaskNotification(notification)
        }
      }
    } catch (error) {
      console.error('❌ Error checking today\'s task notifications:', error)
    }
  }

  private async sendTaskNotification(notification: any) {
    try {
      console.log(`📋 Sending task notification: ${notification.body}`)
      
      // Send push notification
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.log('⚠️ Supabase URL or Anon Key not found, falling back to local notification')
        this.showLocalNotification(notification)
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
            title: notification.title,
            body: notification.body,
            type: notification.type,
            category: notification.category,
            priority: notification.priority,
            icon: notification.icon,
            data: notification.data,
            actionUrl: notification.action_url || '/agenda'
          },
          userId: 'default'
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Task push notification sent: ${notification.body}`, result)
      } else {
        const errorText = await response.text()
        console.log(`⚠️ Task push notification failed (${response.status}): ${errorText}`)
        this.showLocalNotification(notification)
      }

      // Mark notification as sent
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ 
          sent_at: new Date().toISOString(),
          read: true 
        })
        .eq('id', notification.id)

      if (updateError) {
        console.error('❌ Error marking task notification as sent:', updateError)
      }

    } catch (error) {
      console.error('❌ Error sending task notification:', error)
      this.showLocalNotification(notification)
    }
  }

  private showLocalNotification(notification: any) {
    // Show browser notification (only works when app is open)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/logo.png',
        tag: notification.id,
        requireInteraction: false
      })
      
      console.log(`✅ Local task notification shown: ${notification.body}`)
    }
  }

  // Method to manually check for notifications (useful for testing)
  async checkNow() {
    await this.checkTodayTaskNotifications()
  }
}

// Export singleton instance
export const agendaNotificationService = new AgendaNotificationService()

// Auto-start the service when this module is imported
if (typeof window !== 'undefined') {
  // Only start in browser environment
  setTimeout(() => {
    agendaNotificationService.start()
  }, 1000) // Start after 1 second
}
