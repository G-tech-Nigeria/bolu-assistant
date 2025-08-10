// Minimal Service Worker Registration for PWA Install
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return null
  }

  try {
    console.log('Attempting to register service worker...')
    
    // First check if service worker file exists
    const response = await fetch('/sw.js', { method: 'HEAD' })
    if (!response.ok) {
      console.log('Service worker file not found, skipping registration')
      return null
    }
    
    const registration = await navigator.serviceWorker.register('/sw.js', {
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
