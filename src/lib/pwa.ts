// PWA Install and Management Service
export class PWAService {
  private static instance: PWAService
  private deferredPrompt: any = null
  private isInstalled = false

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService()
    }
    return PWAService.instance
  }

  initialize(): void {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA install prompt available')
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Save the event so it can be triggered later
      this.deferredPrompt = e
      this.showInstallBanner()
    })

    // Listen for the app being installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully')
      this.isInstalled = true
      this.hideInstallBanner()
      this.deferredPrompt = null
    })

    // Check if app is already installed
    this.checkIfInstalled()
    
    // Check if running in standalone mode
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App running in standalone mode')
      this.isInstalled = true
    }
  }

  private checkIfInstalled(): void {
    // Check if running in standalone mode (installed PWA)
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true
    }

    // Check if running as TWA (Trusted Web Activity) on Android
    if ('getInstalledRelatedApps' in navigator) {
      // @ts-ignore
      navigator.getInstalledRelatedApps().then((relatedApps: any[]) => {
        if (relatedApps.length > 0) {
          this.isInstalled = true
        }
      }).catch((error: any) => {
        // Silently handle error - this is expected on most browsers
      })
    }
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice

      if (outcome === 'accepted') {
        this.hideInstallBanner()
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error during PWA installation:', error)
      return false
    } finally {
      // Clear the deferredPrompt
      this.deferredPrompt = null
    }
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled
  }

  isAppInstalled(): boolean {
    return this.isInstalled
  }

  private showInstallBanner(): void {
    // Create install banner if it doesn't exist
    if (!document.getElementById('pwa-install-banner')) {
      const banner = this.createInstallBanner()
      document.body.appendChild(banner)
    }
  }

  private hideInstallBanner(): void {
    const banner = document.getElementById('pwa-install-banner')
    if (banner) {
      banner.remove()
    }
  }

  private createInstallBanner(): HTMLElement {
    const banner = document.createElement('div')
    banner.id = 'pwa-install-banner'
    banner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-3'
    
    banner.innerHTML = `
      <div class="flex-1">
        <h3 class="font-semibold text-sm">Install Bolu Assistant</h3>
        <p class="text-xs opacity-90">Get the full app experience with offline access</p>
      </div>
      <button id="pwa-install-btn" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
        Install
      </button>
      <button id="pwa-dismiss-btn" class="text-white hover:text-gray-200 transition-colors ml-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `

    // Add event listeners
    const installBtn = banner.querySelector('#pwa-install-btn')
    const dismissBtn = banner.querySelector('#pwa-dismiss-btn')

    installBtn?.addEventListener('click', () => {
      this.installApp()
    })

    dismissBtn?.addEventListener('click', () => {
      this.hideInstallBanner()
      // Remember dismissal for this session
      sessionStorage.setItem('pwa-banner-dismissed', 'true')
    })

    // Don't show if dismissed in this session
    if (sessionStorage.getItem('pwa-banner-dismissed') === 'true') {
      return banner
    }

    return banner
  }

  // Share functionality
  async shareApp(data?: { title?: string; text?: string; url?: string }): Promise<boolean> {
    const shareData = {
      title: data?.title || 'Bolu Assistant - Personal Command Center',
      text: data?.text || 'Check out this amazing productivity app!',
      url: data?.url || window.location.origin
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return true
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        return true
      }
    } catch (error) {
      console.error('Error sharing app:', error)
      return false
    }
  }

  // Update functionality
  async checkForUpdates(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
        return true
      }
      return false
    } catch (error) {
      console.error('Error checking for updates:', error)
      return false
    }
  }

  // Get app info
  getAppInfo(): { isInstalled: boolean; canInstall: boolean; isStandalone: boolean } {
    return {
      isInstalled: this.isInstalled,
      canInstall: this.canInstall(),
      isStandalone: window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
    }
  }
}

export const pwaService = PWAService.getInstance()