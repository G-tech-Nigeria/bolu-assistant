// Test utility for push notifications
// Use this in browser console to test push notifications

export const testPushNotification = async () => {
  try {
    console.log('🧪 Testing push notification...')
    
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
      console.log('✅ Push notification test successful:', result)
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
  console.log('🧪 Push notification test function available: testPushNotification()')
}

// Test utility for agenda notifications
export const testAgendaNotification = async () => {
  try {
    console.log('📋 Testing agenda notification...')
    
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
      console.log('✅ Agenda notification test successful:', result)
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
  console.log('📋 Agenda notification test function available: testAgendaNotification()')
}

// Test utility to create a test agenda notification in database
export const createTestAgendaNotification = async () => {
  try {
    console.log('📋 Creating test agenda notification in database...')
    
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
    
    console.log('✅ Test agenda notification created:', data)
    console.log(`⏰ Notification scheduled for: ${testTime.toLocaleString()}`)
    console.log('📱 The agenda notification service will pick this up and send it in ~1 minute')
    
    return true
  } catch (error) {
    console.error('❌ Error creating test agenda notification:', error)
    return false
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).createTestAgendaNotification = createTestAgendaNotification
  console.log('📋 Test agenda notification creator available: createTestAgendaNotification()')
}

// Debug utility to check current agenda notifications
export const debugAgendaNotifications = async () => {
  try {
    console.log('🔍 Debugging agenda notifications...')
    
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
    
    console.log(`📋 Found ${notifications?.length || 0} agenda notifications for today:`)
    
    if (notifications && notifications.length > 0) {
      notifications.forEach((notification, index) => {
        const scheduledTime = new Date(notification.scheduled_for)
        const now = new Date()
        const timeUntilDue = Math.round((scheduledTime.getTime() - now.getTime()) / (1000 * 60))
        const status = notification.read ? '✅ SENT' : timeUntilDue <= 0 ? '⏰ DUE' : `⏳ ${timeUntilDue}min`
        
        console.log(`${index + 1}. ${status} - ${notification.body} (${scheduledTime.toLocaleString()})`)
      })
    } else {
      console.log('📋 No agenda notifications found for today')
    }
    
    // Also check push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', 'default')
    
    if (subError) {
      console.error('❌ Error fetching push subscriptions:', subError)
    } else {
      console.log(`📱 Found ${subscriptions?.length || 0} push subscription(s)`)
    }
    
  } catch (error) {
    console.error('❌ Error debugging agenda notifications:', error)
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).debugAgendaNotifications = debugAgendaNotifications
  console.log('🔍 Agenda notification debugger available: debugAgendaNotifications()')
}

// Simple test: Create a test agenda task and verify notification scheduling
export const testAgendaEndToEnd = async () => {
  try {
    console.log('🧪 Testing agenda end-to-end...')
    
    const { supabase } = await import('./supabase')
    
    // 1. Create a test task in agenda_tasks table
    const today = new Date().toISOString().split('T')[0]
    const testTime = new Date(Date.now() + 2 * 60 * 1000) // 2 minutes from now
    const timeString = testTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })
    
    const { data: taskData, error: taskError } = await supabase
      .from('agenda_tasks')
      .insert([{
        title: 'Test Task (End-to-End)',
        description: timeString, // This will be the timeRange
        completed: false,
        date: today,
        priority: 'medium',
        task_order: 999
      }])
      .select()
    
    if (taskError) {
      console.error('❌ Error creating test task:', taskError)
      return false
    }
    
    console.log('✅ Test task created:', taskData)
    
    // 2. Import and test the agenda notification service
    const { agendaNotificationService } = await import('./agendaNotificationService')
    
    // 3. Convert task to the format expected by notification service
    const testTask = {
      id: taskData[0].id,
      name: taskData[0].title,
      timeRange: taskData[0].description,
      completed: taskData[0].completed
    }
    
    console.log('🔄 Test task for notifications:', testTask)
    
    // 4. Schedule notification
    await agendaNotificationService.scheduleTaskNotifications([testTask])
    
    console.log('✅ End-to-end test completed!')
    console.log('📱 Check for notification in ~2 minutes')
    console.log('🔍 Run debugAgendaNotifications() to see scheduled notifications')
    
    return true
    
  } catch (error) {
    console.error('❌ Error in end-to-end test:', error)
    return false
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testAgendaEndToEnd = testAgendaEndToEnd
  console.log('🧪 End-to-end agenda test available: testAgendaEndToEnd()')
}

// Quick test: Create a task that triggers in 1 minute
export const testAgendaNow = async () => {
  try {
    console.log('🧪 Creating test task for 1 minute from now...')
    
    const { supabase } = await import('./supabase')
    
    // Create task for 1 minute from now
    const now = new Date()
    const testTime = new Date(now.getTime() + 1 * 60 * 1000) // 1 minute from now
    const timeString = testTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })
    
    const today = new Date().toISOString().split('T')[0]
    
    const { data: taskData, error: taskError } = await supabase
      .from('agenda_tasks')
      .insert([{
        title: 'Test Task - Due in 1 Minute',
        description: timeString,
        completed: false,
        date: today,
        priority: 'high',
        task_order: 1000
      }])
      .select()
    
    if (taskError) {
      console.error('❌ Error creating test task:', taskError)
      return false
    }
    
    console.log('✅ Test task created:', taskData)
    console.log(`⏰ Task scheduled for: ${timeString}`)
    console.log(`📱 Notification will trigger at: ${new Date(testTime.getTime() - 5 * 60 * 1000).toLocaleTimeString()}`)
    
    // Schedule notification immediately
    const { agendaNotificationService } = await import('./agendaNotificationService')
    
    const testTask = {
      id: taskData[0].id,
      name: taskData[0].title,
      timeRange: taskData[0].description,
      completed: taskData[0].completed
    }
    
    await agendaNotificationService.scheduleTaskNotifications([testTask])
    
    console.log('✅ Test task notification scheduled!')
    console.log('📱 Check for notification in ~1 minute')
    
    return true
    
  } catch (error) {
    console.error('❌ Error creating test task:', error)
    return false
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testAgendaNow = testAgendaNow
  console.log('🧪 Quick test available: testAgendaNow()')
}
