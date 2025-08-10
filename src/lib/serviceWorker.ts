// Minimal Service Worker Registration for PWA Install
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return null
  }

  try {
    console.log('Attempting to register service worker...')
    
    // Try to register service worker directly
    try {
      console.log('Trying to register service worker at /sw.js')
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      })
      console.log('Service Worker registered successfully:', registration)
      return registration
    } catch (swError) {
      console.log('Direct registration failed:', swError)
      
      // If direct registration fails, try to check if file exists first
      try {
        const response = await fetch('/sw.js', { method: 'HEAD' })
        console.log('Service worker file check response:', response.status, response.headers.get('content-type'))
        
        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('text/html')) {
            console.log('Service worker is being served as HTML - Vercel configuration issue')
          } else {
            console.log('Service worker file exists but registration failed')
          }
        } else {
          console.log('Service worker file not found (404)')
        }
      } catch (fetchError) {
        console.log('Could not check service worker file:', fetchError)
      }
      
      return null
    }
  } catch (error) {
    console.error('Service Worker registration failed:', error)
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
