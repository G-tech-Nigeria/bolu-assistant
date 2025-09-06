// Google Calendar OAuth Callback Component
// This component handles the OAuth callback from Google

import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { googleCalendarService } from '../lib/googleCalendar'

const GoogleCalendarCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const state = searchParams.get('state')

        if (error) {
          setStatus('error')
          setMessage(`Authentication failed: ${error}`)
          return
        }

        if (!code) {
          setStatus('error')
          setMessage('No authorization code received')
          return
        }

        // Exchange code for tokens
        setMessage('Exchanging authorization code for tokens...')
        const authResult = await googleCalendarService.exchangeCodeForTokens(code)

        // Store tokens in localStorage (in production, use secure storage)
        localStorage.setItem('google_calendar_auth', JSON.stringify(authResult))

        // Test the connection by fetching calendar list
        setMessage('Testing connection...')
        const calendars = await googleCalendarService.getCalendarList(authResult.accessToken)

        setStatus('success')
        setMessage(`Successfully connected! Found ${calendars.length} calendar(s).`)
        
        // Redirect back to calendar after 2 seconds
        setTimeout(() => {
          navigate('/calendar?google_sync=true')
        }, 2000)

      } catch (error) {
        console.error('Google Calendar callback error:', error)
        setStatus('error')
        setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Connecting to Google Calendar
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {message || 'Please wait...'}
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Successfully Connected!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to calendar...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Connection Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {message}
              </p>
              <button
                onClick={() => navigate('/calendar')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Back to Calendar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default GoogleCalendarCallback

