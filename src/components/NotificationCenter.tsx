import React, { useState, useEffect } from 'react'
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Trophy, 
  Clock,
  Filter,
  Trash2,
  Settings,
  ExternalLink
} from 'lucide-react'
import { 
  pushNotificationService, 
  Notification 
} from '../lib/notifications'
import { Link } from 'react-router-dom'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, 
  onClose, 
  className = '' 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen, filter, categoryFilter])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const allNotifications = await pushNotificationService.getNotifications(100)
      
      let filtered = allNotifications
      
      // Apply read/unread filter
      if (filter === 'unread') {
        filtered = filtered.filter(n => !n.read)
      } else if (filter === 'read') {
        filtered = filtered.filter(n => n.read)
      }
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(n => n.category === categoryFilter)
      }
      
      setNotifications(filtered)
      setUnreadCount(allNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await pushNotificationService.markAsRead(notificationId)
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await pushNotificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // Note: You'll need to add a delete function to the notification service
      // For now, we'll just remove it from the local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      const notification = notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    const icons = {
      'reminder': Clock,
      'achievement': Trophy,
      'alert': AlertCircle,
      'info': Info
    }
    return icons[type as keyof typeof icons] || Info
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return 'border-red-200 bg-red-50'
    }
    
    const colors = {
      'reminder': 'border-blue-200 bg-blue-50',
      'achievement': 'border-yellow-200 bg-yellow-50',
      'alert': 'border-red-200 bg-red-50',
      'info': 'border-gray-200 bg-gray-50'
    }
    return colors[type as keyof typeof colors] || 'border-gray-200 bg-gray-50'
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'calendar': '📅',
      'agenda': '📋',
      'health': '🏥',
      'plants': '🌱',
      'finance': '💰',
      'dev': '💻',
      'general': '📢'
    }
    return icons[category as keyof typeof icons] || '📢'
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'agenda', label: 'Agenda' },
    { value: 'health', label: 'Health' },
    { value: 'plants', label: 'Plants' },
    { value: 'finance', label: 'Finance' },
    { value: 'dev', label: 'Development' },
    { value: 'general', label: 'General' }
  ]

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkAllAsRead}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Mark all as read"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          {/* Read/Unread Filter */}
          <div className="flex space-x-2">
            {['all', 'unread', 'read'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filter === filterOption
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'You\'re all caught up!' 
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const color = getNotificationColor(notification.type, notification.priority)
                const categoryIcon = getCategoryIcon(notification.category)
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${color} ${
                      !notification.read ? 'ring-2 ring-blue-200' : ''
                    }`}
                  >
                    {/* Notification Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.sentAt || '')}
                        </span>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Notification Body */}
                    <p className="text-sm text-gray-700 mb-3">
                      {notification.body}
                    </p>

                    {/* Notification Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{categoryIcon}</span>
                        <span className="text-xs text-gray-500 capitalize">
                          {notification.category}
                        </span>
                        {notification.priority === 'high' && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            High Priority
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {notification.actionUrl && (
                          <Link
                            to={notification.actionUrl}
                            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <span>View</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800 font-medium"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark as read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</span>
            <Link
              to="/settings"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCenter
