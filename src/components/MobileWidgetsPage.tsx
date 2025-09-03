import React, { useState } from 'react'
import { 
  Smartphone, 
  Settings, 
  Grid, 
  List, 
  Plus, 
  Trash2,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react'
import MobileWidgets from './MobileWidgets'


const MobileWidgetsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showSettings, setShowSettings] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)

  const handleRefreshAllWidgets = async () => {
    try {
      const widgetTypes = ['quick-stats', 'today-tasks', 'upcoming-events', 'health-progress', 'plant-care']
      await Promise.all(widgetTypes.map(type => widgetService.refreshWidget(type as any)))
    } catch (error) {
      console.error('Failed to refresh widgets:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Mobile Widgets
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your mobile dashboard widgets
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefreshAllWidgets}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh all widgets"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={`p-2 rounded-lg transition-colors ${
              isCustomizing 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Customize widgets"
          >
            {isCustomizing ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Widget settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Widget Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Refresh Intervals */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Refresh Intervals
              </h4>
              <div className="space-y-3">
                {[
                  { name: 'Quick Stats', default: 5 },
                  { name: 'Today Tasks', default: 2 },
                  { name: 'Upcoming Events', default: 10 },
                  { name: 'Health Progress', default: 15 },
                  { name: 'Plant Care', default: 30 }
                ].map((widget) => (
                  <div key={widget.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {widget.name}
                    </span>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option value={widget.default}>{widget.default} min</option>
                      <option value="1">1 min</option>
                      <option value="5">5 min</option>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Display Options
              </h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Show widget titles
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Show last updated time
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Enable animations
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Auto-refresh on focus
                  </span>
                </label>
              </div>
            </div>

            {/* Mobile Optimization */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Mobile Optimization
              </h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Touch-friendly buttons
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Swipe gestures
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Haptic feedback
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Responsive layout
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widgets Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        <MobileWidgets 
          showSettings={false} 
          compact={viewMode === 'grid'}
          className={viewMode === 'list' ? 'space-y-4' : ''}
        />
      </div>

      {/* Installation Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          📱 Mobile Installation Guide
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">iOS Installation</h4>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>1. Open BoluLife in Safari</li>
              <li>2. Tap the Share button (square with arrow)</li>
              <li>3. Scroll down and tap "Add to Home Screen"</li>
              <li>4. Customize the name if desired</li>
              <li>5. Tap "Add" to install</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Android Installation</h4>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>1. Open BoluLife in Chrome</li>
              <li>2. Tap the menu button (three dots)</li>
              <li>3. Tap "Add to Home screen"</li>
              <li>4. Customize the name if desired</li>
              <li>5. Tap "Add" to install</li>
            </ol>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Pro Tip:</strong> After installation, you can access widgets directly from your home screen for quick updates without opening the full app!
          </p>
        </div>
      </div>

      {/* Widget Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <RefreshCw className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Real-time Updates</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Widgets automatically refresh to show the latest data from your apps and activities.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Mobile Optimized</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Designed specifically for mobile devices with touch-friendly interfaces and responsive layouts.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Customizable</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Adjust refresh intervals, display options, and layout preferences to match your needs.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MobileWidgetsPage
