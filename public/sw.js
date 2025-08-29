// Service Worker for BoluLife PWA and Push Notifications

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

// Activate event - take control of all clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  self.clients.claim()
})

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event)
  
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || 'You have a new notification',
      icon: data.icon || '/logo.png',
      badge: '/logo.png',
      tag: data.tag || 'bolulife-notification',
      data: data.data || {},
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
      actions: data.actions || []
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'BoluLife', options)
    )
  } else {
    // Fallback for notifications without data
    const options = {
      body: 'You have a new notification from BoluLife',
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'bolulife-notification'
    }

    event.waitUntil(
      self.registration.showNotification('BoluLife', options)
    )
  }
})

// Notification click event - handle when user clicks notification
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  // Handle notification actions
  if (event.action === 'open') {
    // Open the app or specific page
    event.waitUntil(
      self.clients.openWindow(event.notification.data.actionUrl || '/')
    )
  } else {
    // Default action - just open the app
    event.waitUntil(
      self.clients.openWindow('/')
    )
  }
})

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event)
})

// Background sync (for offline functionality)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Performing background sync...')
    )
  }
})

// Message event - handle messages from main app
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
}) 