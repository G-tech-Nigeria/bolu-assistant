// Google Calendar Settings Component
// This component allows users to manage their Google Calendar integration

import React, { useState, useEffect } from 'react'
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar'

interface GoogleCalendarSettingsProps {
  isOpen: boolean
  onClose: () => void
  onSync?: () => void
}

const GoogleCalendarSettings: React.FC<GoogleCalendarSettingsProps> = ({ isOpen, onClose, onSync }) => {
  const {
    auth,
    connection,
    isAuthenticated,
    isLoading,
    error,
    connectToGoogle,
    disconnectFromGoogle,
    loadCalendarList,
    syncEventsFromGoogle,
    clearError,
    setConnection
  } = useGoogleCalendar()

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([])

  // Load calendar list when component opens and user is authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated && !connection) {
      loadCalendarList().catch(console.error)
    }
  }, [isOpen, isAuthenticated, connection, loadCalendarList])

  // Update selected calendars when connection loads
  useEffect(() => {
    if (connection) {
      const selected = connection.calendars
        .filter(cal => cal.selected)
        .map(cal => cal.id)
      setSelectedCalendars(selected)
    }
  }, [connection])

  const handleConnect = () => {
    clearError()
    connectToGoogle()
  }

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect from Google Calendar? This will stop syncing events.')) {
      disconnectFromGoogle()
      setSyncStatus('idle')
    }
  }

  const handleCalendarToggle = (calendarId: string) => {
    setSelectedCalendars(prev => 
      prev.includes(calendarId)
        ? prev.filter(id => id !== calendarId)
        : [...prev, calendarId]
    )
    
    // Update the connection object with the new selection
    if (connection) {
      setConnection({
        ...connection,
        calendars: connection.calendars.map(cal => 
          cal.id === calendarId 
            ? { ...cal, selected: !cal.selected }
            : cal
        )
      })
    }
  }

  const handleSyncNow = async () => {
    if (!connection || selectedCalendars.length === 0) return

    try {
      setSyncStatus('syncing')
      clearError()

      // Call the main sync function from the parent component
      if (onSync) {
        await onSync()
        setSyncStatus('success')
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSyncStatus('idle'), 3000)
      } else {
        // Fallback to direct sync if no parent sync function provided
        const syncPromises = selectedCalendars.map(calendarId => 
          syncEventsFromGoogle(calendarId)
        )

        await Promise.all(syncPromises)
        setSyncStatus('success')

        // Auto-hide success message after 3 seconds
        setTimeout(() => setSyncStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Sync error:', error)
      setSyncStatus('error')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Google Calendar Integration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              {isAuthenticated ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400 mr-3" />
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {isAuthenticated ? 'Connected to Google Calendar' : 'Not Connected'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isAuthenticated 
                    ? `Connected as ${auth?.scope ? 'Calendar User' : 'Unknown User'}`
                    : 'Connect your Google Calendar to sync events'
                  }
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isAuthenticated ? (
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Selection */}
        {isAuthenticated && connection && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Select Calendars to Sync
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {connection.calendars.map(calendar => (
                <label
                  key={calendar.id}
                  className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCalendars.includes(calendar.id)}
                    onChange={() => handleCalendarToggle(calendar.id)}
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
                      <span className="font-medium text-gray-900 dark:text-white">
                        {calendar.name}
                      </span>
                      {calendar.primary && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Calendar ID: {calendar.id}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Sync Controls */}
        {isAuthenticated && connection && selectedCalendars.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Sync Events
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedCalendars.length} calendar(s) selected
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sync events from selected Google Calendars to your local calendar
                </p>
              </div>
              <button
                onClick={handleSyncNow}
                disabled={isLoading || syncStatus === 'syncing'}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                {syncStatus === 'syncing' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            {/* Sync Status */}
            {syncStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700 dark:text-green-300">
                    Events synced successfully!
                  </span>
                </div>
              </div>
            )}

            {syncStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 dark:text-red-300">
                    Failed to sync events. Please try again.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            How it works:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Connect your Google Calendar account</li>
            <li>• Select which calendars to sync</li>
            <li>• Events will appear in your local calendar</li>
            <li>• Changes sync both ways automatically</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default GoogleCalendarSettings
