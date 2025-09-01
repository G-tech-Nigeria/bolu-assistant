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
    const { notification, userId } = await req.json()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user's push subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (fetchError) {
      throw new Error(`Failed to fetch subscriptions: ${fetchError.message}`)
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No push subscriptions found for user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send push notification to all user's devices
    const results = []
    for (const subscription of subscriptions) {
      try {
        const pushPayload = {
          title: notification.title,
          body: notification.body,
          icon: notification.icon || '/logo.png',
          badge: '/logo.png',
          tag: notification.id || 'bolulife-notification',
          data: {
            ...notification.data,
            actionUrl: notification.actionUrl || '/',
            category: notification.category,
            type: notification.type
          },
          requireInteraction: notification.priority === 'high',
          silent: notification.priority === 'low'
        }

        // Send push notification using web-push
        const response = await fetch(subscription.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'TTL': '86400', // 24 hours
            'Urgency': notification.priority === 'high' ? 'high' : 'normal'
          },
          body: JSON.stringify(pushPayload)
        })

        if (response.ok) {
          results.push({ subscriptionId: subscription.id, status: 'success' })
        } else {
          results.push({ subscriptionId: subscription.id, status: 'failed', error: response.statusText })
        }
      } catch (error) {
        results.push({ subscriptionId: subscription.id, status: 'error', error: error.message })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Push notifications sent to ${subscriptions.length} devices`,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Push notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
