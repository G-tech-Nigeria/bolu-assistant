import { supabase } from './supabase'

class PlantNotificationService {
  private checkInterval: NodeJS.Timeout | null = null
  private isRunning = false

  async start() {
    if (this.isRunning) return
    
    console.log('🌱 Starting plant notification service...')
    this.isRunning = true
    
    // Check once when starting to handle any missed notifications
    await this.checkScheduledNotifications()
    
    // Schedule next check for 4:40am tomorrow
    this.scheduleNextCheck()
    
    console.log('✅ Plant notification service started successfully')
  }

  async stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    this.isRunning = false
    console.log('🌱 Plant notification service stopped')
  }

  private scheduleNextCheck() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(4, 40, 0, 0) // 4:40am tomorrow
    
    const delay = tomorrow.getTime() - now.getTime()
    
    console.log(`📅 Next plant notification check scheduled for: ${tomorrow.toLocaleString()}`)
    
    // Schedule the next check
    this.checkInterval = setTimeout(async () => {
      await this.checkScheduledNotifications()
      this.scheduleNextCheck() // Schedule the next day's check
    }, delay)
  }

  private async checkScheduledNotifications() {
    try {
      const now = new Date()
      console.log(`🔍 Checking for plant notifications at ${now.toLocaleString()}`)
      
      // Find notifications scheduled for today at 4:40am
      const today = new Date()
      today.setHours(4, 40, 0, 0) // 4:40am today
      
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('category', 'plants')
        .eq('type', 'reminder')
        .not('scheduled_for', 'is', null)
        .gte('scheduled_for', today.toISOString())
        .lt('scheduled_for', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()) // Within 24 hours
        .eq('read', false)

      if (error) {
        console.error('❌ Error checking scheduled notifications:', error)
        return
      }

      if (!notifications || notifications.length === 0) {
        console.log('🔍 No plant notifications found to send')
        return
      }

      console.log(`🌱 Found ${notifications.length} plant watering notification(s) to send`)
      console.log('📋 Notifications:', notifications.map(n => ({
        id: n.id,
        title: n.title,
        body: n.body,
        scheduled_for: n.scheduled_for,
        plantName: n.data?.plantName
      })))

      for (const notification of notifications) {
        await this.sendPlantNotification(notification)
      }

    } catch (error) {
      console.error('❌ Error in checkScheduledNotifications:', error)
    }
  }

  private async sendPlantNotification(notification: any) {
    try {
      console.log(`🌱 Sending plant notification: ${notification.body}`)
      
      // Send push notification (works when app is closed)
      try {
        // Use Supabase Edge Function directly
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
              actionUrl: notification.action_url || '/plant-care'
            },
            userId: 'default'
          })
        })

        if (response.ok) {
          const result = await response.json()
          console.log(`✅ Push notification sent: ${notification.body}`, result)
        } else {
          const errorText = await response.text()
          console.log(`⚠️ Push notification failed (${response.status}): ${errorText}`)
          // Fallback to local notification
          this.showLocalNotification(notification)
        }
      } catch (pushError) {
        console.log(`⚠️ Push notification error, falling back to local notification:`, pushError)
        // Fallback to local notification
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
        console.error('❌ Error marking notification as sent:', updateError)
      }

    } catch (error) {
      console.error('❌ Error sending plant notification:', error)
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
      
      console.log(`✅ Local notification shown: ${notification.body}`)
    }
  }

  // Method to manually check for notifications (useful for testing)
  async checkNow() {
    await this.checkScheduledNotifications()
  }
}

// Export singleton instance
export const plantNotificationService = new PlantNotificationService()

// Auto-start the service when this module is imported
if (typeof window !== 'undefined') {
  // Only start in browser environment
  setTimeout(() => {
    plantNotificationService.start()
  }, 1000) // Start after 1 second
}
