// Test utility for push notifications
// Use this in browser console to test push notifications

export const testPushNotification = async () => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase URL or Anon Key not found in environment variables')
      return false
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
          title: '🧪 Test Push',
          body: 'This is a test push notification!',
          type: 'info',
          category: 'general',
          priority: 'medium',
          icon: '/logo.png'
        },
        userId: 'default'
      })
    })

    if (response.ok) {
      const result = await response.json()
      return true
    } else {
      const errorText = await response.text()
      console.error('❌ Push notification test failed:', response.status, errorText)
      return false
    }
  } catch (error) {
    console.error('❌ Push notification test error:', error)
    return false
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testPushNotification = testPushNotification
}

// Test utility for agenda notifications
export const testAgendaNotification = async () => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase URL or Anon Key not found in environment variables')
      return false
    }

    // Create a test task notification for 1 minute from now
    const testTime = new Date(Date.now() + 1 * 60 * 1000) // 1 minute from now
    testTime.setSeconds(0, 0) // Set to exact minute

    const response = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({
        notification: {
          title: '📋 Task Reminder (TEST)',
          body: 'Time for: Test Task (This is a test agenda notification)',
          type: 'reminder',
          category: 'agenda',
          priority: 'medium',
          icon: '/logo.png'
        },
        userId: 'default'
      })
    })

    if (response.ok) {
      const result = await response.json()
      return true
    } else {
      const errorText = await response.text()
      console.error('❌ Agenda notification test failed:', response.status, errorText)
      return false
    }
  } catch (error) {
    console.error('❌ Agenda notification test error:', error)
    return false
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testAgendaNotification = testAgendaNotification
}

// Test utility to create a test agenda notification in database
export const createTestAgendaNotification = async () => {
  try {
    const { supabase } = await import('./supabase')
    
    // Create notification for 1 minute from now
    const testTime = new Date(Date.now() + 1 * 60 * 1000)
    testTime.setSeconds(0, 0)
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        title: '📋 Task Reminder (TEST)',
        body: 'Time for: Test Task (Database test)',
        type: 'reminder',
        category: 'agenda',
        priority: 'medium',
        scheduled_for: testTime.toISOString(),
        action_url: '/agenda',
        data: { 
          taskId: 'test-task-123', 
          taskName: 'Test Task', 
          taskTime: 'test-time' 
        },
        user_id: 'default'
      }])
      .select()
    
    if (error) {
      console.error('❌ Error creating test agenda notification:', error)
      return false
    }
    
    // Test agenda notification created successfully
    
    return true
  } catch (error) {
    console.error('❌ Error creating test agenda notification:', error)
    return false
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).createTestAgendaNotification = createTestAgendaNotification
}

// Debug utility to check current agenda notifications
export const debugAgendaNotifications = async () => {
  try {
    const { supabase } = await import('./supabase')
    
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('category', 'agenda')
      .eq('type', 'reminder')
      .gte('scheduled_for', startOfDay.toISOString())
      .lt('scheduled_for', endOfDay.toISOString())
      .order('scheduled_for', { ascending: true })
    
    if (error) {
      console.error('❌ Error fetching agenda notifications:', error)
      return
    }
    
    // Found agenda notifications for today
    
    if (notifications && notifications.length > 0) {
      notifications.forEach((notification, index) => {
        const scheduledTime = new Date(notification.scheduled_for)
        const now = new Date()
        const timeUntilDue = Math.round((scheduledTime.getTime() - now.getTime()) / (1000 * 60))
        const status = notification.read ? '✅ SENT' : timeUntilDue <= 0 ? '⏰ DUE' : `⏳ ${timeUntilDue}min`
        
        // Notification status logged
      })
    } else {
      // No agenda notifications found for today
    }
    
    // Also check push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', 'default')
    
    if (subError) {
      console.error('❌ Error fetching push subscriptions:', subError)
    } else {
      // Push subscriptions found
    }
    
  } catch (error) {
    console.error('❌ Error debugging agenda notifications:', error)
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).debugAgendaNotifications = debugAgendaNotifications
}

// Test the simple agenda notification service
export const testSimpleAgendaService = async () => {
  try {
    const { simpleAgendaNotificationService } = await import('./simpleAgendaNotifications')
    
    // Check if service is running
    
    // Manual check
    await simpleAgendaNotificationService.checkNow()
    
    // Simple agenda service test completed
    
  } catch (error) {
    console.error('❌ Error testing simple agenda service:', error)
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testSimpleAgendaService = testSimpleAgendaService
}

// Check today's agenda tasks
export const checkTodayAgendaTasks = async () => {
  try {
    const { supabase } = await import('./supabase')
    
    const today = new Date().toISOString().split('T')[0]
    
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
    
    // Found tasks for today
    
    if (tasks && tasks.length > 0) {
      tasks.forEach((task, index) => {
        // Task details logged
      })
    } else {
      // No tasks found for today
    }
    
  } catch (error) {
    console.error('❌ Error checking today\'s agenda tasks:', error)
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).checkTodayAgendaTasks = checkTodayAgendaTasks
}
