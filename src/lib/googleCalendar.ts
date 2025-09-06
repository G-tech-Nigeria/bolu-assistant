// Google Calendar Integration Service
// This service handles all Google Calendar API interactions

export interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  location?: string
  attendees?: Array<{
    email: string
    displayName?: string
    responseStatus?: string
  }>
  recurrence?: string[]
  reminders?: {
    useDefault: boolean
    overrides?: Array<{
      method: string
      minutes: number
    }>
  }
  created: string
  updated: string
}

export interface GoogleCalendarList {
  id: string
  summary: string
  description?: string
  primary?: boolean
  accessRole: string
  backgroundColor?: string
  foregroundColor?: string
}

export interface GoogleAuthResult {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  scope: string
}

class GoogleCalendarService {
  private clientId: string
  private redirectUri: string
  private scope: string
  private apiKey: string

  constructor() {
    // These will be set from environment variables
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
    this.redirectUri = `${window.location.origin}/google-calendar-callback`
    this.scope = 'https://www.googleapis.com/auth/calendar'
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY || ''
  }

  // Step 1: Generate OAuth URL for authentication
  generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scope,
      access_type: 'offline',
      prompt: 'consent',
      state: this.generateState()
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  // Step 2: Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string): Promise<GoogleAuthResult> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens')
    }

    const data = await response.json()
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in * 1000),
      scope: data.scope
    }
  }

  // Step 3: Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<GoogleAuthResult> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to refresh access token')
    }

    const data = await response.json()
    
    return {
      accessToken: data.access_token,
      refreshToken: refreshToken, // Keep the same refresh token
      expiresAt: Date.now() + (data.expires_in * 1000),
      scope: data.scope
    }
  }

  // Step 4: Get user's calendar list
  async getCalendarList(accessToken: string): Promise<GoogleCalendarList[]> {
    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch calendar list')
    }

    const data = await response.json()
    return data.items || []
  }

  // Step 5: Get events from a specific calendar
  async getEvents(
    accessToken: string, 
    calendarId: string = 'primary',
    timeMin?: string,
    timeMax?: string
  ): Promise<GoogleCalendarEvent[]> {
    const params = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
    })

    if (timeMin) params.append('timeMin', timeMin)
    if (timeMax) params.append('timeMax', timeMax)

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }

    const data = await response.json()
    return data.items || []
  }

  // Step 6: Create event in Google Calendar
  async createEvent(
    accessToken: string,
    calendarId: string = 'primary',
    event: Partial<GoogleCalendarEvent>
  ): Promise<GoogleCalendarEvent> {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to create event')
    }

    return await response.json()
  }

  // Step 7: Update event in Google Calendar
  async updateEvent(
    accessToken: string,
    calendarId: string,
    eventId: string,
    event: Partial<GoogleCalendarEvent>
  ): Promise<GoogleCalendarEvent> {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update event')
    }

    return await response.json()
  }

  // Step 8: Delete event from Google Calendar
  async deleteEvent(
    accessToken: string,
    calendarId: string,
    eventId: string
  ): Promise<void> {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete event')
    }
  }

  // Helper method to generate state for OAuth
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Helper method to check if token is expired
  isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt
  }

  // Helper method to convert Google event to our format
  convertGoogleEventToLocal(googleEvent: GoogleCalendarEvent): any {
    const isAllDay = !googleEvent.start.dateTime
    let startDate: Date
    let endDate: Date

    if (isAllDay) {
      // For all-day events, use the date directly without time
      startDate = new Date(googleEvent.start.date || '')
      // For all-day events, the end date should be the same day (not next day)
      endDate = new Date(googleEvent.start.date || '')
    } else {
      // For timed events, use the actual start and end times
      startDate = new Date(googleEvent.start.dateTime || '')
      endDate = new Date(googleEvent.end.dateTime || '')
    }

    return {
      id: googleEvent.id,
      title: googleEvent.summary || 'Untitled Event',
      description: googleEvent.description || '',
      startDate: startDate,
      endDate: endDate,
      isAllDay: isAllDay,
      location: googleEvent.location || '',
      attendees: googleEvent.attendees || [],
      recurrence: googleEvent.recurrence || null,
      reminders: googleEvent.reminders?.overrides || [],
      category: {
        id: 'google',
        name: 'Google Calendar',
        color: 'bg-blue-500',
        isVisible: true
      },
      provider: 'google',
      externalId: googleEvent.id,
      syncStatus: 'synced'
    }
  }

  // Helper method to convert our event to Google format
  convertLocalEventToGoogle(localEvent: any): Partial<GoogleCalendarEvent> {
    return {
      summary: localEvent.title,
      description: localEvent.description,
      start: localEvent.isAllDay 
        ? { date: localEvent.startDate.toISOString().split('T')[0] }
        : { dateTime: localEvent.startDate.toISOString() },
      end: localEvent.isAllDay 
        ? { date: localEvent.endDate.toISOString().split('T')[0] }
        : { dateTime: localEvent.endDate.toISOString() },
      location: localEvent.location,
      attendees: localEvent.attendees,
      recurrence: localEvent.recurrence,
      reminders: {
        useDefault: false,
        overrides: localEvent.reminders?.map((minutes: number) => ({
          method: 'popup',
          minutes
        })) || []
      }
    }
  }
}

export const googleCalendarService = new GoogleCalendarService()
