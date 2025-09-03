import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, MessageCircle, Calendar, FileText, Code, DollarSign, Menu, X, Settings, Leaf, Heart, Building, Briefcase, User, Newspaper, Rocket, Smartphone, Target, LayoutDashboard, Bell } from 'lucide-react'
import BMLogo from './BMLogo'

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1280) // iPad and tablet screens (including larger iPads)
      // On desktop (1280px+), sidebar stays open by default
      // On tablet/iPad (768px-1280px), allow closing
      // On mobile (<768px), always allow closing
      const shouldBeOpen = width >= 1280
      setIsOpen(shouldBeOpen)
      onToggle?.(shouldBeOpen)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(newState)
  }

  const handleNavigationClick = () => {
    // Close sidebar on mobile and tablet when navigation link is clicked
    if (isMobile || isTablet) {
      setIsOpen(false)
      onToggle?.(false)
    }
  }

  const navigation = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Life Goals', icon: Target, href: '/goals' },
    { name: 'Calendar', icon: Calendar, href: '/calendar' },
    { name: 'Daily Agenda', icon: MessageCircle, href: '/agenda' },
    { name: 'Notes', icon: FileText, href: '/notes' },
    { name: 'Dev Roadmap', icon: Code, href: '/dev-roadmap' },
    { name: 'Coding Journey', icon: Rocket, href: '/coding-journey' },
    { name: 'Finance', icon: DollarSign, href: '/finance' },
    { name: 'Plant Care', icon: Leaf, href: '/plant-care' },
    { name: 'Health & Habits', icon: Heart, href: '/health-habits' },
    { name: 'Job/Career', icon: Briefcase, href: '/job-career' },
    { name: 'Moro Company', icon: Building, href: '/company' },
    { name: 'Portfolio', icon: User, href: '/portfolio' },
    { name: 'Birthday Calendar', icon: Calendar, href: '/birthday-calendar' },
    { name: 'Accountability', icon: Newspaper, href: '/accountability' },
  ]

  const bottomNavigation = [
    { name: 'Settings', icon: Settings, href: '/settings' },
  ]

  // Show toggle button on mobile and tablet (iPad)
  const showToggleButton = isMobile || isTablet



  return (
    <>
      {/* Mobile/Tablet Menu Button */}
      {showToggleButton && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 ${isOpen ? 'left-[260px]' : 'left-4'} z-50 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700`}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? (
            <X size={24} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu size={24} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>
      )}

      {/* Backdrop for mobile and tablet */}
      {(isMobile || isTablet) && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsOpen(false)
            onToggle?.(false)
          }}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${!isMobile && !isTablet ? 'xl:translate-x-0' : ''} shadow-xl ${!isMobile && !isTablet ? 'xl:shadow-none' : ''}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <BMLogo size="md" />
              <span className="ml-3 font-semibold text-gray-900 dark:text-gray-100 text-lg">Bolu Assistant</span>
            </div>
            {/* Close button for tablet (iPad) */}
            {isTablet && (
              <button
                onClick={() => {
                  setIsOpen(false)
                  onToggle?.(false)
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
                aria-label="Close sidebar"
              >
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleNavigationClick}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out ${isActive
                        ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                      }`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Bottom Navigation */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="space-y-2">
              {bottomNavigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleNavigationClick}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out ${isActive
                        ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                      }`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar