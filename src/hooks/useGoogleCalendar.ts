// Custom hook for Google Calendar integration
// This hook manages Google Calendar authentication and sync

import { useState, useEffect, useCallback } from 'react'
import { googleCalendarService } from '../lib/googleCalendar'

export interface GoogleCalendarAuth {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  scope: string
}

export interface GoogleCalendarConnection {
  id: string
  name: string
  isConnected: boolean
  calendars: Array<{
    id: string
    name: string
    primary: boolean
    selected: boolean
    backgroundColor?: string
    foregroundColor?: string
  }>
}

export const useGoogleCalendar = () => {
  const [auth, setAuth] = useState<GoogleCalendarAuth | null>(null)
  const [connection, setConnection] = useState<GoogleCalendarConnection | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved authentication on mount
  useEffect(() => {
    const loadSavedAuth = () => {
      try {
        const savedAuth = localStorage.getItem('google_calendar_auth')
        if (savedAuth) {
          const authData = JSON.parse(savedAuth)
          setAuth(authData)
        }
      } catch (error) {
        console.error('Error loading saved Google Calendar auth:', error)
      }
    }

    loadSavedAuth()
  }, [])

  // Check if we have valid authentication
  const isAuthenticated = auth && !googleCalendarService.isTokenExpired(auth.expiresAt)

  // Start OAuth flow
  const connectToGoogle = useCallback(() => {
    try {
      const authUrl = googleCalendarService.generateAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start Google authentication')
    }
  }, [])

  // Disconnect from Google Calendar
  const disconnectFromGoogle = useCallback(() => {
    localStorage.removeItem('google_calendar_auth')
    setAuth(null)
    setConnection(null)
    setError(null)
  }, [])

  // Refresh access token if needed
  const refreshTokenIfNeeded = useCallback(async () => {
    if (!auth || !googleCalendarService.isTokenExpired(auth.expiresAt)) {
      return auth
    }

    if (!auth.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      setIsLoading(true)
      const newAuth = await googleCalendarService.refreshAccessToken(auth.refreshToken)
      
      // Update stored auth
      localStorage.setItem('google_calendar_auth', JSON.stringify(newAuth))
      setAuth(newAuth)
      
      return newAuth
    } catch (error) {
      console.error('Error refreshing token:', error)
      disconnectFromGoogle()
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [auth, disconnectFromGoogle])

  // Load user's calendar list
  const loadCalendarList = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated with Google Calendar')
    }

    try {
      setIsLoading(true)
      setError(null)

      const currentAuth = await refreshTokenIfNeeded()
      if (!currentAuth) {
        throw new Error('Failed to refresh authentication')
      }

      const calendars = await googleCalendarService.getCalendarList(currentAuth.accessToken)
      
      const connectionData: GoogleCalendarConnection = {
        id: 'google',
        name: 'Google Calendar',
        isConnected: true,
        calendars: calendars.map(cal => ({
          id: cal.id,
          name: cal.summary,
          primary: cal.primary || false,
          selected: cal.primary || false, // Select primary calendar by default
          backgroundColor: cal.backgroundColor,
          foregroundColor: cal.foregroundColor
        }))
      }

      setConnection(connectionData)
      return connectionData
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load calendar list'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, refreshTokenIfNeeded])

  // Sync events from Google Calendar
  const syncEventsFromGoogle = useCallback(async (
    calendarId: string = 'primary',
    timeMin?: Date,
    timeMax?: Date
  ) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated with Google Calendar')
    }

    try {
      setIsLoading(true)
      setError(null)

      const currentAuth = await refreshTokenIfNeeded()
      if (!currentAuth) {
        throw new Error('Failed to refresh authentication')
      }

      const timeMinStr = timeMin?.toISOString()
      const timeMaxStr = timeMax?.toISOString()

      const googleEvents = await googleCalendarService.getEvents(
        currentAuth.accessToken,
        calendarId,
        timeMinStr,
        timeMaxStr
      )

      // Convert Google events to our format
      const localEvents = googleEvents.map(event => 
        googleCalendarService.convertGoogleEventToLocal(event)
      )

      return localEvents
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync events'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, refreshTokenIfNeeded])

  // Create event in Google Calendar
  const createEventInGoogle = useCallback(async (
    event: any,
    calendarId: string = 'primary'
  ) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated with Google Calendar')
    }

    try {
      setIsLoading(true)
      setError(null)

      const currentAuth = await refreshTokenIfNeeded()
      if (!currentAuth) {
        throw new Error('Failed to refresh authentication')
      }

      const googleEvent = googleCalendarService.convertLocalEventToGoogle(event)
      const createdEvent = await googleCalendarService.createEvent(
        currentAuth.accessToken,
        calendarId,
        googleEvent
      )

      return googleCalendarService.convertGoogleEventToLocal(createdEvent)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, refreshTokenIfNeeded])

  // Update event in Google Calendar
  const updateEventInGoogle = useCallback(async (
    eventId: string,
    event: any,
    calendarId: string = 'primary'
  ) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated with Google Calendar')
    }

    try {
      setIsLoading(true)
      setError(null)

      const currentAuth = await refreshTokenIfNeeded()
      if (!currentAuth) {
        throw new Error('Failed to refresh authentication')
      }

      const googleEvent = googleCalendarService.convertLocalEventToGoogle(event)
      const updatedEvent = await googleCalendarService.updateEvent(
        currentAuth.accessToken,
        calendarId,
        eventId,
        googleEvent
      )

      return googleCalendarService.convertGoogleEventToLocal(updatedEvent)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, refreshTokenIfNeeded])

  // Delete event from Google Calendar
  const deleteEventFromGoogle = useCallback(async (
    eventId: string,
    calendarId: string = 'primary'
  ) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated with Google Calendar')
    }

    try {
      setIsLoading(true)
      setError(null)

      const currentAuth = await refreshTokenIfNeeded()
      if (!currentAuth) {
        throw new Error('Failed to refresh authentication')
      }

      await googleCalendarService.deleteEvent(
        currentAuth.accessToken,
        calendarId,
        eventId
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete event'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, refreshTokenIfNeeded])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    auth,
    connection,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    connectToGoogle,
    disconnectFromGoogle,
    loadCalendarList,
    syncEventsFromGoogle,
    createEventInGoogle,
    updateEventInGoogle,
    deleteEventFromGoogle,
    clearError,
    setConnection
  }
}
