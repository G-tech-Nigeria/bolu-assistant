import React, { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, subDays, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Trash2, X, Eye, EyeOff, Bell, Plus, Save, Calendar as CalendarIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { getCalendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, getCalendarCategories, saveCalendarCategories } from '../lib/database'

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

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({ show: false, message: '', type: 'success' })

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
    reminders: [15], // 15 minutes default
    recurrence: null as RecurrencePattern | null
  })

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

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
              reminders: [15],
              recurrence: null
            }
          })
        
        setEvents(parsedEvents)
      } catch (error) {
        console.error('Error loading calendar events:', error)
        showNotification('Failed to load events', 'error')
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

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 3000)
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

      // Update local state
      const newEvents = [...events, newEvent]
      setEvents(newEvents)
      resetEventForm()
      setShowEventModal(false)
      showNotification('Event created successfully', 'success')
    } catch (error) {
      console.error('Error creating event:', error)
      showNotification('Failed to create event', 'error')
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

      // Update local state
      const newEvents = events.map(e => e.id === editingEvent.id ? updatedEvent : e)
      setEvents(newEvents)
      resetEventForm()
      setEditingEvent(null)
      setShowEventModal(false)
      showNotification('Event updated successfully', 'success')
    } catch (error) {
      console.error('Error updating event:', error)
      showNotification('Failed to update event', 'error')
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

      showNotification(
        `"${eventToDelete.title}" has been deleted successfully`,
        'success'
      )
    } catch (error) {
      console.error('Error deleting event:', error)
      showNotification('Failed to delete event', 'error')
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {getViewDateRange()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* View Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
            {(['month', 'week', 'day', 'agenda'] as CalendarView[]).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${view === viewType
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateCalendar('prev')}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Today
            </button>
            <button
              onClick={() => navigateCalendar('next')}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Create Event Button */}
          <button
            onClick={() => openQuickCreate(new Date())}
            className="flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
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
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
            <CalendarIcon className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No events yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first event to get started</p>
          <button
            onClick={() => openQuickCreate(new Date())}
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
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
              {/* Add mini calendar component here */}
            </div>

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

      {/* Beautiful Notification Popup */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`
            p-4 rounded-lg shadow-lg border-l-4 bg-white dark:bg-gray-800 max-w-sm
            ${notification.type === 'success' ? 'border-green-500' :
              notification.type === 'error' ? 'border-red-500' :
                'border-blue-500'}
          `}>
            <div className="flex items-center">
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-900' :
                  notification.type === 'error' ? 'bg-red-100 dark:bg-red-900' :
                    'bg-blue-100 dark:bg-blue-900'}
              `}>
                {notification.type === 'success' && (
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium
                  ${notification.type === 'success' ? 'text-green-800 dark:text-green-200' :
                    notification.type === 'error' ? 'text-red-800 dark:text-red-200' :
                      'text-blue-800 dark:text-blue-200'}
                `}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
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
                    className={`text-xs p-1 rounded truncate cursor-pointer ${event.category.color} text-white`}
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
      const eventEnd = new Date(event.endDate)
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
                        className={`text-xs p-1 rounded truncate cursor-pointer ${event.category.color} text-white mb-1`}
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
                    className={`text-sm p-2 rounded cursor-pointer ${event.category.color} text-white mb-2`}
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
                className={`p-3 rounded-lg cursor-pointer ${event.category.color} text-white`}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!eventForm.title.trim() || !eventForm.startDate || !eventForm.endDate}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
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
