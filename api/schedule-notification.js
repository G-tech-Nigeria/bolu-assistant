// Vercel API route for scheduling notifications
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { notification, scheduledFor, userId } = req.body

    // Calculate delay in milliseconds
    const scheduledTime = new Date(scheduledFor)
    const delay = scheduledTime.getTime() - Date.now()

    if (delay <= 0) {
      // Send immediately if time has passed
      return await sendNotification(notification, userId)
    }

    // Schedule the notification using setTimeout (this will work on Vercel's serverless functions)
    // Note: For production, you might want to use a proper job queue like Bull, Agenda, or a cron job
    setTimeout(async () => {
      try {
        await sendNotification(notification, userId)
        console.log('📅 Scheduled notification sent:', notification.title)
      } catch (error) {
        console.error('❌ Failed to send scheduled notification:', error)
      }
    }, delay)

    return res.status(200).json({ 
      success: true, 
      message: `Notification scheduled for ${scheduledTime.toISOString()}`,
      delay: delay
    })

  } catch (error) {
    console.error('Schedule notification API error:', error)
    return res.status(500).json({ error: error.message })
  }
}

// Helper function to send notification
async function sendNotification(notification, userId) {
  const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/send-push-notification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      'apikey': process.env.SUPABASE_ANON_KEY
    },
    body: JSON.stringify({ notification, userId })
  })

  if (!response.ok) {
    throw new Error(`Failed to send notification: ${response.status}`)
  }

  return response.json()
}
