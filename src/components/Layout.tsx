import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import NotificationBell from './NotificationBell'

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar onToggle={setIsSidebarOpen} />

            {/* Main Content */}
            <main className={`flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out ${
                isSidebarOpen ? 'ml-0 md:ml-[280px]' : 'ml-0'
            }`}>
                {/* Top Bar with Notifications */}
                <div className="flex items-center justify-between mb-6">
                    <div></div> {/* Spacer */}
                    <NotificationBell size="md" />
                </div>
                
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout
