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
          title: '🧪 Test Push Notification',
          body: 'This is a test push notification from BoluLife!',
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
