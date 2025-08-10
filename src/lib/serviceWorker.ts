// Minimal Service Worker Registration for PWA Install
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
    return registration
  } catch (error) {
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
    }
  } catch (error) {
    // Silent error handling
  }
}
