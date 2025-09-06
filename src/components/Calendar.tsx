import React, { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, subDays, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Trash2, X, Eye, EyeOff, Plus, Calendar as CalendarIcon, Settings, RefreshCw } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { getCalendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, getCalendarCategories, saveCalendarCategories } from '../lib/database'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar'
import GoogleCalendarSettings from './GoogleCalendarSettings'


// Event interfaces
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  category: EventCategory
  isAllDay: boolean
  location?: string
  attendees?: string[]
  reminders: number[] // minutes before event
  recurrence?: RecurrencePattern | null
  googleEventId?: string // for Google Calendar sync
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number // every N days/weeks/months
  endDate?: Date | null
  count?: number | null // number of occurrences
}

export interface EventCategory {
  id: string
  name: string
  color: string
  isVisible: boolean
}

type CalendarView = 'month' | 'week' | 'day' | 'agenda'

// Mini Calendar Component
interface MiniCalendarProps {
  currentDate: Date
  onDateSelect: (date: Date) => void
  events: CalendarEvent[]
  categories: EventCategory[]
}

const MiniCalendar = ({ currentDate, onDateSelect, events, categories }: MiniCalendarProps) => {
  const [miniCurrentDate, setMiniCurrentDate] = useState(currentDate)
  
  const monthStart = startOfMonth(miniCurrentDate)
  const monthEnd = endOfMonth(miniCurrentDate)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const miniDays = eachDayOfInterval({ start: startDate, end: endDate })
  
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      const dateInRange = date >= new Date(eventStart.toDateString()) &&
        date <= new Date(eventEnd.toDateString())
      
      const categoryVisible = categories.find(c => c.id === event.category.id)?.isVisible !== false
      return dateInRange && categoryVisible
    })
  }
  
  const navigateMiniCalendar = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setMiniCurrentDate(subMonths(miniCurrentDate, 1))
    } else {
      setMiniCurrentDate(addMonths(miniCurrentDate, 1))
    }
  }
  
  return (
    <div className="space-y-3">
      {/* Mini Calendar Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateMiniCalendar('prev')}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {format(miniCurrentDate, 'MMM yyyy')}
        </h4>
        <button
          onClick={() => navigateMiniCalendar('next')}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Mini Calendar Grid */}
      <div className="space-y-1">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="text-xs text-center text-gray-500 dark:text-gray-400 font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {miniDays.map(day => {
            const dayEvents = getEventsForDate(day)
            const isCurrentMonth = isSameMonth(day, miniCurrentDate)
            const isCurrentDay = isToday(day)
            const isSelected = format(day, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
            
            return (
              <button
                key={day.toString()}
                onClick={() => onDateSelect(day)}
                className={`relative w-8 h-8 text-xs rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : isCurrentDay
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : isCurrentMonth
                    ? 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {format(day, 'd')}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Today Button */}
      <button
        onClick={() => {
          const today = new Date()
          setMiniCurrentDate(today)
          onDateSelect(today)
        }}
        className="w-full text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        Today
      </button>
    </div>
  )
}

const Calendar = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('month')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [categories, setCategories] = useState<EventCategory[]>([
    { id: 'work', name: 'Work', color: 'bg-blue-500', isVisible: true },
    { id: 'personal', name: 'Personal', color: 'bg-green-500', isVisible: true },
    { id: 'health', name: 'Health', color: 'bg-red-500', isVisible: true },
    { id: 'study', name: 'Study', color: 'bg-purple-500', isVisible: true },
    { id: 'social', name: 'Social', color: 'bg-yellow-500', isVisible: true },
    { id: 'travel', name: 'Travel', color: 'bg-indigo-500', isVisible: true }
  ])

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)



  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean
    event: CalendarEvent | null
  }>({ show: false, event: null })

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isAllDay: false,
    category: 'personal',
    location: '',
    reminders: [15, 30, 60, 120, 1440], // 15 min, 30 min, 1 hour, 2 hours, 1 day default
    recurrence: null as RecurrencePattern | null
  })

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  // Google Calendar integration
  const {
    isAuthenticated: isGoogleConnected,
    isLoading: isGoogleLoading,
    syncEventsFromGoogle,
    loadCalendarList,
    clearError: clearGoogleError,
    connection,
    setConnection
  } = useGoogleCalendar()

  // Google Calendar settings modal
  const [showGoogleSettings, setShowGoogleSettings] = useState(false)

  // Load Google Calendar connection when authenticated
  useEffect(() => {
    if (isGoogleConnected && !connection) {
      loadCalendarList().catch(console.error)
    }
  }, [isGoogleConnected, connection, loadCalendarList])

  // Load categories first, then events
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const dbCategories = await getCalendarCategories()
        
        if (dbCategories.length > 0) {
          // Convert database format to component format
          const convertedCategories = dbCategories.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            color: cat.color,
            isVisible: cat.is_visible
          }))
  
          setCategories(convertedCategories)
        } else {
          // Initialize with default categories if none exist
          const defaultCategories = [
            { id: 'work', name: 'Work', color: 'bg-blue-500', isVisible: true },
            { id: 'personal', name: 'Personal', color: 'bg-green-500', isVisible: true },
            { id: 'health', name: 'Health', color: 'bg-red-500', isVisible: true },
            { id: 'study', name: 'Study', color: 'bg-purple-500', isVisible: true },
            { id: 'social', name: 'Social', color: 'bg-yellow-500', isVisible: true },
            { id: 'travel', name: 'Travel', color: 'bg-indigo-500', isVisible: true }
          ]
          setCategories(defaultCategories)
          // Save default categories to database
          try {
            await saveCalendarCategories(defaultCategories)
          } catch (error) {
            console.error('Error saving default categories:', error)
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback to default categories
        const defaultCategories = [
          { id: 'work', name: 'Work', color: 'bg-blue-500', isVisible: true },
          { id: 'personal', name: 'Personal', color: 'bg-green-500', isVisible: true },
          { id: 'health', name: 'Health', color: 'bg-red-500', isVisible: true },
          { id: 'study', name: 'Study', color: 'bg-purple-500', isVisible: true },
          { id: 'social', name: 'Social', color: 'bg-yellow-500', isVisible: true },
          { id: 'travel', name: 'Travel', color: 'bg-indigo-500', isVisible: true }
        ]
        setCategories(defaultCategories)
      }
    }
    
    loadCategories()
  }, [])

  // Load events after categories are set
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const dbEvents = await getCalendarEvents()
        
        const parsedEvents = dbEvents
          .filter((event: any) => {
            // Validate event has required properties
            return event &&
              event.start_date &&
              event.end_date &&
              event.category
          })
          .map((event: any) => {
            // Find the matching category from predefined categories
            const matchingCategory = categories.find(cat => cat.id === event.category)
            const categoryColor = matchingCategory ? matchingCategory.color : `bg-${event.category}-500`
            
            return {
              id: event.id,
              title: event.title,
              description: event.description,
              startDate: new Date(event.start_date),
              endDate: new Date(event.end_date),
            category: {
                id: event.category,
                name: event.category,
                color: categoryColor,
                isVisible: true
              },
              isAllDay: false,
              location: '',
              attendees: [],
              reminders: [15, 30, 60, 120, 1440],
              recurrence: null
            }
          })

        setEvents(parsedEvents)
        
        // Reminder functionality removed
      } catch (error) {
        console.error('Error loading calendar events:', error)
        console.error('Failed to load events')
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    // Only load events if categories are available
    if (categories.length > 0) {
      loadEvents()
    }
  }, [categories])

  // Essential functions
  const selectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
  }

  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (view === 'month') setCurrentDate(subMonths(currentDate, 1))
      else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1))
      else if (view === 'day') setCurrentDate(subDays(currentDate, 1))
    } else {
      if (view === 'month') setCurrentDate(addMonths(currentDate, 1))
      else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1))
      else if (view === 'day') setCurrentDate(addDays(currentDate, 1))
    }
  }

  const getViewDateRange = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy')
      case 'week':
        const weekStart = startOfWeek(currentDate)
        const weekEnd = endOfWeek(currentDate)
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy')
      case 'agenda':
        return 'Upcoming Events'
      default:
        return ''
    }
  }



  const createEvent = async () => {
    try {
    const newEvent: CalendarEvent = {
      id: uuidv4(),
      title: eventForm.title,
      description: eventForm.description,
      startDate: eventForm.isAllDay
        ? new Date(eventForm.startDate)
        : new Date(`${eventForm.startDate}T${eventForm.startTime}`),
      endDate: eventForm.isAllDay
        ? new Date(eventForm.endDate)
        : new Date(`${eventForm.endDate}T${eventForm.endTime}`),
      category: categories.find(c => c.id === eventForm.category)!,
      isAllDay: eventForm.isAllDay,
      location: eventForm.location,
        attendees: [],
      reminders: eventForm.reminders,
      recurrence: eventForm.recurrence
    }

      // Save to database
      await addCalendarEvent({
        title: newEvent.title,
        description: newEvent.description,
        startDate: newEvent.startDate.toISOString(),
        endDate: newEvent.endDate.toISOString(),
        category: newEvent.category.id
      })

      // Reminder functionality removed

      // Update local state
    const newEvents = [...events, newEvent]
      setEvents(newEvents)
    resetEventForm()
    setShowEventModal(false)
    } catch (error) {
      console.error('Error creating event:', error)
      console.error('Failed to create event')
    }
  }

  const updateEvent = async () => {
    if (!editingEvent) return

    try {
    const updatedEvent: CalendarEvent = {
      ...editingEvent,
      title: eventForm.title,
      description: eventForm.description,
      startDate: eventForm.isAllDay
        ? new Date(eventForm.startDate)
        : new Date(`${eventForm.startDate}T${eventForm.startTime}`),
      endDate: eventForm.isAllDay
        ? new Date(eventForm.endDate)
        : new Date(`${eventForm.endDate}T${eventForm.endTime}`),
      category: categories.find(c => c.id === eventForm.category)!,
      isAllDay: eventForm.isAllDay,
      location: eventForm.location,
      reminders: eventForm.reminders,
      recurrence: eventForm.recurrence
    }

      // Update in database
      await updateCalendarEvent(editingEvent.id, {
        title: updatedEvent.title,
        description: updatedEvent.description,
        startDate: updatedEvent.startDate.toISOString(),
        endDate: updatedEvent.endDate.toISOString(),
        category: updatedEvent.category.id
      })

      // Reminder functionality removed

      // Update local state
    const newEvents = events.map(e => e.id === editingEvent.id ? updatedEvent : e)
      setEvents(newEvents)
    resetEventForm()
    setEditingEvent(null)
    setShowEventModal(false)
    } catch (error) {
      console.error('Error updating event:', error)
      console.error('Failed to update event')
    }
  }

  const confirmDeleteEvent = (event: CalendarEvent) => {
    setDeleteConfirmation({ show: true, event })
  }

  const deleteEvent = async () => {
    if (!deleteConfirmation.event) return

    try {
    const eventToDelete = deleteConfirmation.event
      
      // Delete from database
      await deleteCalendarEvent(eventToDelete.id)

      // Update local state
    const newEvents = events.filter(e => e.id !== eventToDelete.id)
      setEvents(newEvents)

    // Close modals and reset state
    setShowEventModal(false)
    setEditingEvent(null)
    resetEventForm()
    setDeleteConfirmation({ show: false, event: null })

    } catch (error) {
      console.error('Error deleting event:', error)
      console.error('Failed to delete event')
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, event: null })
  }

  // Quick event creation
  const openQuickCreate = (date: Date, time?: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    setEventForm({
      ...eventForm,
      startDate: dateStr,
      endDate: dateStr,
      startTime: time || '09:00',
      endTime: time ? format(addMinutes(parseTime(time), 60), 'HH:mm') : '10:00'
    })
    setShowEventModal(true)
  }

  // Edit event
  const openEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      description: event.description || '',
      startDate: format(event.startDate, 'yyyy-MM-dd'),
      startTime: event.isAllDay ? '' : format(event.startDate, 'HH:mm'),
      endDate: format(event.endDate, 'yyyy-MM-dd'),
      endTime: event.isAllDay ? '' : format(event.endDate, 'HH:mm'),
      isAllDay: event.isAllDay,
      category: event.category.id,
      location: event.location || '',
      reminders: event.reminders,
      recurrence: event.recurrence || null
    })
    setShowEventModal(true)
  }

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      isAllDay: false,
      category: 'personal',
      location: '',
      reminders: [15],
      recurrence: null
    })
  }

  // Utility functions
  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  const addMinutes = (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000)
  }

  const toggleCategoryVisibility = async (categoryId: string) => {
    setCategories(prev => {
      const newCategories = prev.map(cat =>
        cat.id === categoryId ? { ...cat, isVisible: !cat.isVisible } : cat
      )
      
      // Save to database when visibility is toggled
      saveCalendarCategories(newCategories).catch(error => {
        console.error('Error saving category visibility:', error)
      })
      
      return newCategories
    })
  }

  // Sync Google Calendar events
  const syncGoogleEvents = async () => {
    if (!isGoogleConnected) return

    try {
      clearGoogleError()
      // Use the current connection state instead of reloading
      if (!connection) {
        return
      }
      
      const selectedCalendars = connection.calendars.filter(cal => cal.selected)
      
      if (selectedCalendars.length === 0) {
        return
      }
      
      // Sync events from all selected calendars
      const allEvents: any[] = []
      for (const calendar of selectedCalendars) {
        const calendarEvents = await syncEventsFromGoogle(calendar.id)
        
        // Convert events and add calendar info
        const convertedEvents = calendarEvents.map(event => {
          // Use the actual Google Calendar colors with inline styles
          const calendarColor = calendar.backgroundColor || calendar.foregroundColor || '#3B82F6' // fallback to blue
          
          const convertedEvent = {
            ...event,
            id: `google_${event.id}`, // Prefix to avoid conflicts
            category: {
              id: `google_${calendar.id}`,
              name: calendar.name,
              color: calendarColor, // Store the actual color value
              isVisible: true
            },
            calendarName: calendar.name, // Add calendar name
            calendarId: calendar.id // Add calendar ID
          }
          return convertedEvent
        })
        
        allEvents.push(...convertedEvents)
      }

      // Remove existing Google events and add new ones
      setEvents(prev => {
        // Remove existing Google events (those with google_ prefix)
        const nonGoogleEvents = prev.filter(e => !e.id.startsWith('google_'))
        
        // Add new Google events
        const updatedEvents = [...nonGoogleEvents, ...allEvents]
        
        return updatedEvents
      })

    } catch (error) {
      console.error('Error syncing Google Calendar events:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {getViewDateRange()}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* View Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full sm:w-auto shadow-sm">
            {(['month', 'week', 'day', 'agenda'] as CalendarView[]).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${view === viewType
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigateCalendar('prev')}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateCalendar('next')}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Google Calendar Integration */}
          <div className="flex items-center space-x-2">
            {isGoogleConnected && (
              <button
                onClick={syncGoogleEvents}
                disabled={isGoogleLoading}
                className="flex items-center justify-center px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                title="Sync Google Calendar events"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isGoogleLoading ? 'animate-spin' : ''}`} />
                Sync
              </button>
            )}
            
            <button
              onClick={() => setShowGoogleSettings(true)}
              className="flex items-center justify-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              title="Google Calendar Settings"
            >
              <Settings className="w-4 h-4 mr-1" />
              Google
            </button>
          </div>

          {/* Create Event Button */}
          <button
            onClick={() => openQuickCreate(new Date())}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading calendar...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && events.length === 0 && (
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto mb-6 text-gray-300 dark:text-gray-600">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">No events yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start organizing your schedule by creating your first event. You can add meetings, appointments, and important dates.
          </p>
          <button
            onClick={() => openQuickCreate(new Date())}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Event
          </button>
        </div>
      )}

      {/* Calendar Content */}
      {!isLoading && events.length > 0 && (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6 order-2 lg:order-1">
          {/* Mini Calendar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Navigation</h3>
            <MiniCalendar 
              currentDate={currentDate} 
              onDateSelect={setCurrentDate}
              events={events}
              categories={categories}
            />
          </div>

          {/* Google Calendar Selection */}
          {isGoogleConnected && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Google Calendars</h3>
              <div className="space-y-2">
                {connection?.calendars?.map(calendar => (
                  <label
                    key={calendar.id}
                    className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={calendar.selected}
                      onChange={() => {
                        // Update the connection object
                        if (connection) {
                          const updatedCalendars = connection.calendars.map(cal => 
                            cal.id === calendar.id 
                              ? { ...cal, selected: !cal.selected }
                              : cal
                          )
                          setConnection({
                            ...connection,
                            calendars: updatedCalendars
                          })
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        {/* Calendar color indicator */}
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: calendar.backgroundColor || calendar.foregroundColor || '#6B7280'
                          }}
                        ></div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {calendar.name}
                        </span>
                        {calendar.primary && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <button
                onClick={syncGoogleEvents}
                disabled={isGoogleLoading}
                className="w-full mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGoogleLoading ? 'animate-spin' : ''}`} />
                {isGoogleLoading ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          )}

          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Categories</h3>
              {selectedCategory && (
                <button
                  onClick={() => selectCategory(null)}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <div className="space-y-2">
              {categories.map(category => (
                <div
                  key={category.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedCategory === category.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  onClick={() => selectCategory(category.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                    <span className={`text-sm ${selectedCategory === category.id
                      ? 'text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                      }`}>
                      {category.name}
                    </span>
                    {selectedCategory === category.id && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                        {events.filter(e => e.category.id === category.id).length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCategoryVisibility(category.id)
                    }}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {category.isVisible ? (
                      <Eye className="w-4 h-4 text-gray-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-500">{events.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-500">
                  {events.filter(e => e.startDate >= new Date()).length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Upcoming</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Calendar Area */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {view === 'month' && <MonthView currentDate={currentDate} events={events} onDateClick={openQuickCreate} onEventClick={openEditEvent} selectedCategory={selectedCategory} categories={categories} />}
            {view === 'week' && <WeekView currentDate={currentDate} events={events} onTimeSlotClick={openQuickCreate} onEventClick={openEditEvent} selectedCategory={selectedCategory} categories={categories} />}
            {view === 'day' && <DayView currentDate={currentDate} events={events} onTimeSlotClick={openQuickCreate} onEventClick={openEditEvent} selectedCategory={selectedCategory} categories={categories} />}
            {view === 'agenda' && <AgendaView events={events} onEventClick={openEditEvent} selectedCategory={selectedCategory} categories={categories} />}
          </div>
        </div>
      </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false)
            setEditingEvent(null)
            resetEventForm()
          }}
          eventForm={eventForm}
          setEventForm={setEventForm}
          categories={categories}
          onSave={editingEvent ? updateEvent : createEvent}
          onDelete={editingEvent ? () => confirmDeleteEvent(editingEvent) : undefined}
          isEditing={!!editingEvent}
        />
      )}



      {/* Beautiful Delete Confirmation Card */}
      {deleteConfirmation.show && deleteConfirmation.event && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl transform animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Delete Event
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-red-500">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                "{deleteConfirmation.event.title}"
              </h4>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className={`w-3 h-3 rounded-full ${deleteConfirmation.event.category.color} mr-2`}></div>
                {deleteConfirmation.event.category.name}
                {deleteConfirmation.event.location && (
                  <>
                    <span className="mx-2">•</span>
                    📍 {deleteConfirmation.event.location}
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {format(deleteConfirmation.event.startDate, 'MMM d, yyyy at h:mm a')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteEvent}
                className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Calendar Settings Modal */}
      <GoogleCalendarSettings
        isOpen={showGoogleSettings}
        onClose={() => setShowGoogleSettings(false)}
        onSync={syncGoogleEvents}
      />
    </div>
  )
}

// Month View Component
const MonthView: React.FC<{
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  selectedCategory: string | null
  categories: EventCategory[]
}> = ({ currentDate, events, onDateClick, onEventClick, selectedCategory, categories }) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)

      // Check if date falls within event range (inclusive)
      const dateInRange = date >= new Date(eventStart.toDateString()) &&
        date <= new Date(eventEnd.toDateString())

      // Look up current category visibility from categories state
      const currentCategory = categories.find(c => c.id === event.category.id)
      const categoryVisible = currentCategory?.isVisible !== false
      const categoryMatch = !selectedCategory || event.category.id === selectedCategory

      return dateInRange && categoryVisible && categoryMatch
    })
  }

  return (
    <div>
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-px mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {days.map(day => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={`min-h-[120px] p-2 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    className="text-xs p-1 rounded truncate cursor-pointer text-white"
                    style={{ backgroundColor: event.category.color }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Week View Component
const WeekView: React.FC<{
  currentDate: Date
  events: CalendarEvent[]
  onTimeSlotClick: (date: Date, time: string) => void
  onEventClick: (event: CalendarEvent) => void
  selectedCategory: string | null
  categories: EventCategory[]
}> = ({ currentDate, events, onTimeSlotClick, onEventClick, selectedCategory, categories }) => {
  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForDateAndTime = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const dateMatch = format(eventStart, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      const timeMatch = eventStart.getHours() === hour
      const categoryMatch = !selectedCategory || event.category.id === selectedCategory
      const categoryVisible = categories.find(c => c.id === event.category.id)?.isVisible !== false
      
      return dateMatch && timeMatch && categoryMatch && categoryVisible
    })
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Time slots */}
        <div className="grid grid-cols-8 gap-px">
          <div className="w-16"></div> {/* Empty corner */}
          {days.map(day => (
            <div key={day.toString()} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <div className="font-semibold">{format(day, 'EEE')}</div>
              <div className="text-xs">{format(day, 'MMM d')}</div>
                  </div>
                ))}
          
          {timeSlots.map(hour => (
            <React.Fragment key={hour}>
              <div className="p-2 text-right text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
            </div>
              {days.map(day => {
                const dayEvents = getEventsForDateAndTime(day, hour)
              return (
                <div
                    key={`${day}-${hour}`}
                    onClick={() => onTimeSlotClick(day, `${hour.toString().padStart(2, '0')}:00`)}
                    className="min-h-[60px] p-1 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {dayEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                        className="text-xs p-1 rounded truncate cursor-pointer text-white mb-1"
                        style={{ backgroundColor: event.category.color }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              )
            })}
            </React.Fragment>
        ))}
        </div>
      </div>
    </div>
  )
}

// Day View Component
const DayView: React.FC<{
  currentDate: Date
  events: CalendarEvent[]
  onTimeSlotClick: (date: Date, time: string) => void
  onEventClick: (event: CalendarEvent) => void
  selectedCategory: string | null
  categories: EventCategory[]
}> = ({ currentDate, events, onTimeSlotClick, onEventClick, selectedCategory, categories }) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForTime = (hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventDate = format(eventStart, 'yyyy-MM-dd')
      const currentDateStr = format(currentDate, 'yyyy-MM-dd')
      const timeMatch = eventStart.getHours() === hour
      const dateMatch = eventDate === currentDateStr
      const categoryMatch = !selectedCategory || event.category.id === selectedCategory
      const categoryVisible = categories.find(c => c.id === event.category.id)?.isVisible !== false
      
      return dateMatch && timeMatch && categoryMatch && categoryVisible
    })
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>

      <div className="space-y-1">
        {timeSlots.map(hour => {
          const hourEvents = getEventsForTime(hour)
          return (
            <div key={hour} className="flex border-b border-gray-200 dark:border-gray-700">
              <div className="w-20 p-2 text-right text-sm text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </div>
              <div
                className="flex-1 p-2 min-h-[60px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => onTimeSlotClick(currentDate, `${hour.toString().padStart(2, '0')}:00`)}
              >
                {hourEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    className="text-sm p-2 rounded cursor-pointer text-white mb-2"
                    style={{ backgroundColor: event.category.color }}
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.description && (
                      <div className="text-xs opacity-90">{event.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Agenda View Component
const AgendaView: React.FC<{
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  selectedCategory: string | null
  categories: EventCategory[]
}> = ({ events, onEventClick, selectedCategory, categories }) => {
  const filteredEvents = events
    .filter(event => {
      const categoryMatch = !selectedCategory || event.category.id === selectedCategory
      const categoryVisible = categories.find(c => c.id === event.category.id)?.isVisible !== false
      return categoryMatch && categoryVisible
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = format(new Date(event.startDate), 'yyyy-MM-dd')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
    return groups
  }, {} as Record<string, CalendarEvent[]>)

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([date, dayEvents]) => (
        <div key={date} className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h3>
            <div className="space-y-2">
            {dayEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                className="p-3 rounded-lg cursor-pointer text-white"
                style={{ backgroundColor: event.category.color }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{event.title}</div>
                    {event.description && (
                      <div className="text-sm opacity-90 mt-1">{event.description}</div>
                    )}
                  </div>
                  <div className="text-sm opacity-90">
                    {format(new Date(event.startDate), 'h:mm a')}
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      ))}
    </div>
  )
}

// Event Modal Component
const EventModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  eventForm: any
  setEventForm: (form: any) => void
  categories: EventCategory[]
  onSave: () => void
  onDelete?: () => void
  isEditing: boolean
}> = ({ isOpen, onClose, eventForm, setEventForm, categories, onSave, onDelete, isEditing }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? 'Edit Event' : 'Create Event'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter event title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Event description (optional)"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={eventForm.category}
              onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAllDay"
              checked={eventForm.isAllDay}
              onChange={(e) => setEventForm({ ...eventForm, isAllDay: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isAllDay" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              All day event
            </label>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={eventForm.startDate}
                onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={eventForm.endDate}
                onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {!eventForm.isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={eventForm.location}
              onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Event location (optional)"
            />
          </div>

          {/* Reminders */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reminders
            </label>
            <div className="space-y-2">
              {[
                { value: 15, label: '15 minutes before' },
                { value: 30, label: '30 minutes before' },
                { value: 60, label: '1 hour before' },
                { value: 120, label: '2 hours before' },
                { value: 1440, label: '1 day before' }
              ].map((reminder) => (
                <div key={reminder.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`reminder-${reminder.value}`}
                    checked={eventForm.reminders.includes(reminder.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEventForm({
                          ...eventForm,
                          reminders: [...eventForm.reminders, reminder.value].sort((a, b) => a - b)
                        })
                      } else {
                        setEventForm({
                          ...eventForm,
                          reminders: eventForm.reminders.filter((r: number) => r !== reminder.value)
                        })
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor={`reminder-${reminder.value}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {reminder.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!eventForm.title.trim() || !eventForm.startDate || !eventForm.endDate}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
