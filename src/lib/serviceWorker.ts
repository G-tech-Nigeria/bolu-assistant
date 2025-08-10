// Service Worker Registration for PWA
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return null
  }

  try {
    // First check if service worker file exists
    const swUrl = '/sw.js'
    const response = await fetch(swUrl, { method: 'HEAD' })
    
    if (!response.ok) {
      console.log('Service worker file not found at:', swUrl)
      console.log('PWA features will be limited - app will still work normally')
      return null
    }

    // Try to register the service worker
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/',
      updateViaCache: 'none'
    })

    console.log('Service Worker registered successfully:', registration)
    
    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('New service worker available')
            // You can show a notification to the user here
          }
        })
      }
    })

    return registration

  } catch (error) {
    console.error('Service Worker registration failed:', error)
    console.log('PWA features will be limited - app will still work normally')
    return null
  }
}

export const unregisterServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.unregister()
      console.log('Service Worker unregistered')
    }
  } catch (error) {
    console.error('Service Worker unregistration failed:', error)
  }
}
