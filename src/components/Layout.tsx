import { ReactNode, useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import Sidebar from './Sidebar'
import NotificationBell from './NotificationBell'
import { getUserPreference, setUserPreference } from '../lib/database'

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [darkMode, setDarkMode] = useState(false)

    // Load theme preference
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await getUserPreference('theme')
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    setDarkMode(true)
                    document.documentElement.classList.add('dark')
                } else {
                    setDarkMode(false)
                    document.documentElement.classList.remove('dark')
                }
            } catch (error) {
                console.error('Error loading theme preference:', error)
                // Fallback to system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                if (prefersDark) {
                    setDarkMode(true)
                    document.documentElement.classList.add('dark')
                }
            }
        }

        loadTheme()
    }, [])

    const toggleDarkMode = async () => {
        try {
            if (darkMode) {
                document.documentElement.classList.remove('dark')
                await setUserPreference('theme', 'light')
            } else {
                document.documentElement.classList.add('dark')
                await setUserPreference('theme', 'dark')
            }
            setDarkMode(!darkMode)
        } catch (error) {
            console.error('Error saving theme preference:', error)
            // Still toggle the theme even if saving fails
            setDarkMode(!darkMode)
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
            {/* Sidebar */}
            <Sidebar onToggle={setIsSidebarOpen} />

            {/* Main Content */}
            <main className={`flex-1 p-2 sm:p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out overflow-x-hidden ${
                isSidebarOpen ? 'ml-0 md:ml-[280px]' : 'ml-0'
            }`}>
                {/* Top Bar with Theme Toggle and Notifications */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div></div> {/* Spacer */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                            ) : (
                                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>
                        
                        {/* Notification Bell */}
                        <NotificationBell size="md" />
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout
