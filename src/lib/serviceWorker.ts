// Service Worker Registration for PWA
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return null
  }

  try {
    // Try to register the service worker directly
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    })

    console.log('Service Worker registered successfully:', registration)
    return registration

  } catch (error) {
    console.error('Service Worker registration failed:', error)
    
    // Try alternative approach - create service worker inline
    try {
      const swCode = `
        console.log('Inline Service Worker loading...')
        self.addEventListener('install', (event) => {
          console.log('Service Worker installing...')
          self.skipWaiting()
        })
        self.addEventListener('activate', (event) => {
          console.log('Service Worker activating...')
          event.waitUntil(self.clients.claim())
        })
        self.addEventListener('fetch', (event) => {
          event.respondWith(fetch(event.request).catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('/')
            }
            return new Response('Offline')
          }))
        })
      `
      
      const blob = new Blob([swCode], { type: 'application/javascript' })
      const swUrl = URL.createObjectURL(blob)
      
      const registration = await navigator.serviceWorker.register(swUrl, {
        scope: '/'
      })
      
      console.log('Inline Service Worker registered successfully:', registration)
      return registration
      
    } catch (inlineError) {
      console.error('Inline Service Worker registration also failed:', inlineError)
      return null
    }
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
