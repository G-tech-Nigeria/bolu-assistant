import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { pushNotificationService } from '../lib/notifications'
import NotificationCenter from './NotificationCenter'

interface NotificationBellProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUnreadCount()
    
    // Refresh count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadUnreadCount = async () => {
    try {
      const notifications = await pushNotificationService.getNotifications(100)
      const unread = notifications.filter(n => !n.read).length
      setUnreadCount(unread)
    } catch (error) {
      console.error('Failed to load notification count:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBellClick = () => {
    setIsNotificationCenterOpen(true)
  }

  const handleNotificationCenterClose = () => {
    setIsNotificationCenterOpen(false)
    // Refresh count when notification center is closed
    loadUnreadCount()
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8'
      case 'lg':
        return 'w-12 h-12'
      default:
        return 'w-10 h-10'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-6 h-6'
      default:
        return 'w-5 h-5'
    }
  }

  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4 text-xs'
      case 'lg':
        return 'w-6 h-6 text-sm'
      default:
        return 'w-5 h-5 text-xs'
    }
  }

  return (
    <>
      <button
        onClick={handleBellClick}
        className={`relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 ${getSizeClasses()} ${className}`}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className={getIconSize()} />
        
        {/* Notification Badge */}
        {!isLoading && unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white rounded-full font-medium ${getBadgeSize()}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></div>
          </div>
        )}
      </button>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={handleNotificationCenterClose}
      />
    </>
  )
}

export default NotificationBell
