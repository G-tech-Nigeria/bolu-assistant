// Service Worker Registration for PWA
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return null
  }

  try {
    // Check if service worker file exists
    const swUrl = '/sw.js'
    const response = await fetch(swUrl, { method: 'HEAD' })
    
    if (!response.ok) {
      console.log('Service worker file not found at:', swUrl)
      return null
    }

    // Register the service worker
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/',
      updateViaCache: 'none'
    })

    console.log('Service Worker registered successfully:', registration)
    return registration

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
