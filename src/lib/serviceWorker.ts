// Minimal Service Worker Registration for PWA Install
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return null
  }

  try {
    console.log('Attempting to register service worker...')
    
    // Try different paths for service worker
    const swPaths = ['/sw.js', './sw.js', 'sw.js']
    
    for (const swPath of swPaths) {
      try {
        console.log(`Trying service worker path: ${swPath}`)
        const response = await fetch(swPath, { method: 'HEAD' })
        if (response.ok) {
          console.log(`Service worker found at: ${swPath}`)
          const registration = await navigator.serviceWorker.register(swPath, {
            scope: '/',
            updateViaCache: 'none'
          })
          console.log('Service Worker registered successfully:', registration)
          return registration
        }
      } catch (pathError) {
        console.log(`Path ${swPath} failed:`, pathError)
        continue
      }
    }
    
    console.log('Service worker file not found at any path, skipping registration')
    return null
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
