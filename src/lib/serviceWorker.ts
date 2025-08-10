// Service Worker Registration for PWA
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return null
  }

  // Skip service worker registration for now - PWA will work without it
  console.log('Skipping service worker registration - PWA features disabled')
  return null
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
