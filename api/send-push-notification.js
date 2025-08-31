// Vercel API route for sending push notifications
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { notification, userId } = req.body

    // Forward to Supabase Edge Function
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
      const error = await response.text()
      throw new Error(`Supabase function failed: ${response.status} - ${error}`)
    }

    const result = await response.json()
    return res.status(200).json(result)

  } catch (error) {
    console.error('Push notification API error:', error)
    return res.status(500).json({ error: error.message })
  }
}
