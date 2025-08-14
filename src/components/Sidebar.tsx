import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, MessageCircle, Calendar, FileText, Code, DollarSign, Menu, X, Settings, Leaf, Heart, Building, Briefcase, User, Newspaper } from 'lucide-react'
import BMLogo from './BMLogo'

const Sidebar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsOpen(window.innerWidth >= 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navigation = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Calendar', icon: Calendar, href: '/calendar' },
    { name: 'Daily Agenda', icon: MessageCircle, href: '/agenda' },
    { name: 'Notes', icon: FileText, href: '/notes' },
    { name: 'Dev Roadmap', icon: Code, href: '/dev-roadmap' },
    { name: 'Finance', icon: DollarSign, href: '/finance' },
    { name: 'Plant Care', icon: Leaf, href: '/plant-care' },
    { name: 'Health & Habits', icon: Heart, href: '/health-habits' },
    { name: 'Job/Career', icon: Briefcase, href: '/job-career' },
    { name: 'Moro Company', icon: Building, href: '/company' },
    { name: 'Portfolio', icon: User, href: '/portfolio' },
    { name: 'Accountability', icon: Newspaper, href: '/accountability' },
  ]

  const bottomNavigation = [
    { name: 'Settings', icon: Settings, href: '/settings' },
  ]



  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 ${isOpen ? 'left-[260px]' : 'left-4'} z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X size={24} className="text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu size={24} className="text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 shadow-xl md:shadow-none`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <BMLogo size="md" />
              <span className="ml-3 font-semibold text-gray-900 dark:text-gray-100 text-lg">Bolu Assistant</span>
            </div>
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