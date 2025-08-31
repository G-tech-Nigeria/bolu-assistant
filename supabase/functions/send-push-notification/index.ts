import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const { notification, userId } = await req.json()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user's push subscription
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (subError || !subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No push subscriptions found' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send push notification to each subscription
    const results = []
    for (const subscription of subscriptions) {
      try {
        const pushResult = await sendPushNotification(
          subscription.subscription_json,
          notification
        )
        results.push({ subscription: subscription.id, success: true, result: pushResult })
      } catch (error) {
        results.push({ subscription: subscription.id, success: false, error: error.message })
      }
    }

    // Save notification to database
    const { error: saveError } = await supabase
      .from('notifications')
      .insert([{
        id: crypto.randomUUID(),
        title: notification.title,
        body: notification.body,
        type: notification.type || 'general',
        category: notification.category || 'general',
        priority: notification.priority || 'medium',
        sent_at: new Date().toISOString(),
        read: false,
        user_id: userId
      }])

    if (saveError) {
      console.error('Error saving notification:', saveError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        message: `Push notifications sent to ${subscriptions.length} devices` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function sendPushNotification(subscription: any, notification: any) {
  const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!
  const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!

  // Convert VAPID keys to Uint8Array
  const publicKey = urlBase64ToUint8Array(vapidPublicKey)
  const privateKey = urlBase64ToUint8Array(vapidPrivateKey)

  // Create JWT token for VAPID
  const header = {
    alg: 'ES256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    aud: new URL(subscription.endpoint).origin,
    exp: now + 12 * 60 * 60, // 12 hours
    sub: `mailto:${Deno.env.get('VAPID_CONTACT_EMAIL') || 'notifications@bolulife.com'}`
  }

  const jwt = await createJWT(header, payload, privateKey)

  // Prepare push message
  const pushMessage = {
    title: notification.title,
    body: notification.body,
    icon: notification.icon || '/logo.png',
    badge: '/logo.png',
    tag: notification.id || 'bolulife-notification',
    data: notification.data || {},
    requireInteraction: notification.priority === 'high',
    silent: notification.priority === 'low'
  }

  // Send push notification
  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `vapid t=${jwt}, k=${vapidPublicKey}`,
      'Content-Type': 'application/json',
      'TTL': '86400' // 24 hours
    },
    body: JSON.stringify(pushMessage)
  })

  if (!response.ok) {
    throw new Error(`Push notification failed: ${response.status} ${response.statusText}`)
  }

  return { status: response.status, statusText: response.statusText }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

async function createJWT(header: any, payload: any, privateKey: Uint8Array): Promise<string> {
  // This is a simplified JWT creation - in production, use a proper JWT library
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', namedCurve: 'P-256' },
    await crypto.subtle.importKey(
      'pkcs8',
      privateKey,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    ),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  )

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}
