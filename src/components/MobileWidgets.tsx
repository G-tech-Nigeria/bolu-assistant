import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Leaf, 
  Droplets, 
  Activity,
  RefreshCw,
  Settings,
  Smartphone,
  DollarSign,
  Code,
  FileText,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { widgetService, WidgetData } from '../lib/notifications'
import { Link } from 'react-router-dom'

interface MobileWidgetsProps {
  className?: string
  showSettings?: boolean
  compact?: boolean
}

const MobileWidgets: React.FC<MobileWidgetsProps> = ({ 
  className = '', 
  showSettings = true, 
  compact = false 
}) => {
  const [widgets, setWidgets] = useState<WidgetData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedWidgets, setExpandedWidgets] = useState<Set<string>>(new Set([
    'quick-stats', 'today-tasks', 'upcoming-events', 'health-progress', 'plant-care', 
    'finance-summary', 'dev-progress', 'notes-summary'
  ]))
  const [showAllTasks, setShowAllTasks] = useState(false)

  useEffect(() => {
    const initializeWidgets = async () => {
      setIsLoading(true)
      try {
        console.log('Initializing widgets...')
        await widgetService.initializeWidgets()
        const allWidgets = widgetService.getAllWidgets()
        console.log('Widgets loaded:', allWidgets)
        setWidgets(allWidgets)
      } catch (error) {
        console.error('Failed to initialize widgets:', error)
        // Create fallback widgets with sample data
        const fallbackWidgets: WidgetData[] = [
          {
            type: 'quick-stats' as const,
            title: 'Today\'s Progress',
            data: { taskCompletion: 0, devStreak: 0, plantsNeedWater: 0, waterIntake: 0 },
            lastUpdated: new Date().toISOString(),
            refreshInterval: 5
          },
          {
            type: 'today-tasks' as const,
            title: 'Today\'s Tasks',
            data: [],
            lastUpdated: new Date().toISOString(),
            refreshInterval: 2
          },
          {
            type: 'upcoming-events' as const,
            title: 'Upcoming Events',
            data: [],
            lastUpdated: new Date().toISOString(),
            refreshInterval: 10
          },
          {
            type: 'health-progress' as const,
            title: 'Health Progress',
            data: { gymStreak: 0, waterIntake: 0, waterTarget: 8 },
            lastUpdated: new Date().toISOString(),
            refreshInterval: 15
          },
          {
            type: 'plant-care' as const,
            title: 'Plant Care',
            data: { totalPlants: 0, needWater: 0, careTasks: 0 },
            lastUpdated: new Date().toISOString(),
            refreshInterval: 30
          }
        ]
        setWidgets(fallbackWidgets)
      } finally {
        setIsLoading(false)
      }
    }

    initializeWidgets()

    // Listen for widget updates
    const handleWidgetUpdate = (event: CustomEvent) => {
      const { type, data } = event.detail
      setWidgets(prev => prev.map(widget => 
        widget.type === type 
          ? { ...widget, data, lastUpdated: new Date().toISOString() }
          : widget
      ))
    }

    window.addEventListener('widget-updated', handleWidgetUpdate as EventListener)
    
    return () => {
      window.removeEventListener('widget-updated', handleWidgetUpdate as EventListener)
    }
  }, [])

  const handleRefreshWidget = async (type: string) => {
    try {
      await widgetService.refreshWidget(type as any)
    } catch (error) {
      console.error('Failed to refresh widget:', error)
    }
  }

  const toggleWidgetExpansion = (type: string) => {
    setExpandedWidgets(prev => {
      const newSet = new Set(prev)
      if (newSet.has(type)) {
        newSet.delete(type)
      } else {
        newSet.add(type)
      }
      return newSet
    })
  }

  const getWidgetIcon = (type: string) => {
    const icons = {
      'quick-stats': TrendingUp,
      'today-tasks': CheckCircle2,
      'upcoming-events': Calendar,
      'health-progress': Activity,
      'plant-care': Leaf,
      'finance-summary': DollarSign,
      'dev-progress': Code,
      'notes-summary': FileText
    }
    return icons[type as keyof typeof icons] || Activity
  }

  const getWidgetColor = (type: string) => {
    const colors = {
      'quick-stats': 'from-blue-500 to-purple-600',
      'today-tasks': 'from-green-500 to-emerald-600',
      'upcoming-events': 'from-orange-500 to-red-600',
      'health-progress': 'from-pink-500 to-rose-600',
      'plant-care': 'from-emerald-500 to-green-600',
      'finance-summary': 'from-yellow-500 to-orange-600',
      'dev-progress': 'from-indigo-500 to-purple-600',
      'notes-summary': 'from-gray-500 to-slate-600'
    }
    return colors[type as keyof typeof colors] || 'from-gray-500 to-slate-600'
  }

  const getWidgetLink = (type: string) => {
    const links = {
      'quick-stats': '/',
      'today-tasks': '/agenda',
      'upcoming-events': '/calendar',
      'health-progress': '/health-habits',
      'plant-care': '/plant-care',
      'finance-summary': '/finance',
      'dev-progress': '/dev-roadmap',
      'notes-summary': '/notes'
    }
    return links[type as keyof typeof links] || '/'
  }

  const renderQuickStatsWidget = (data: any) => (
    <div className="grid grid-cols-2 gap-2 md:gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-2 md:p-3 rounded-lg md:rounded-xl">
        <div className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">{data.taskCompletion}%</div>
        <div className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">Tasks Done</div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-2 md:p-3 rounded-lg md:rounded-xl">
        <div className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">{data.devStreak}</div>
        <div className="text-xs text-purple-600/70 dark:text-purple-400/70 font-medium">Dev Streak</div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-2 md:p-3 rounded-lg md:rounded-xl">
        <div className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">{data.plantsNeedWater}</div>
        <div className="text-xs text-green-600/70 dark:text-green-400/70 font-medium">Plants Need Water</div>
      </div>
      <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-2 md:p-3 rounded-lg md:rounded-xl">
        <div className="text-lg md:text-2xl font-bold text-pink-600 dark:text-pink-400">{data.waterIntake}</div>
        <div className="text-xs text-pink-600/70 dark:text-pink-400/70 font-medium">Water Glasses</div>
      </div>
    </div>
  )

  const renderTodayTasksWidget = (data: any[]) => (
    <div className="space-y-2 md:space-y-3">
      {(showAllTasks ? data : data.slice(0, 5)).map((task) => (
        <Link
          key={task.id}
          to="/agenda"
          className="block"
        >
          <div className="flex items-center justify-between p-2 md:p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center space-x-2 md:space-x-3 flex-1">
              <CheckCircle2 
                className={`w-4 h-4 md:w-5 md:h-5 ${task.completed ? 'text-green-500' : 'text-gray-400'}`} 
              />
              <span className={`text-xs md:text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {task.priority === 'high' && (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
              {task.priority === 'medium' && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              )}
              {task.priority === 'low' && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
          </div>
        </Link>
      ))}
      {data.length > 5 && (
        <button
          onClick={() => setShowAllTasks(!showAllTasks)}
          className="w-full p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center space-x-1"
        >
          {showAllTasks ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Show {data.length - 5} More</span>
            </>
          )}
        </button>
      )}
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No tasks for today</p>
        </div>
      )}
    </div>
  )

  const renderUpcomingEventsWidget = (data: any[]) => (
    <div className="space-y-3">
      {data.map((event) => (
        <Link
          key={event.id}
          to="/calendar"
          className="block"
        >
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 flex-1">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{event.title}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{event.time}</span>
          </div>
        </Link>
      ))}
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No upcoming events</p>
        </div>
      )}
    </div>
  )

  const renderHealthProgressWidget = (data: any) => (
    <div className="space-y-3 md:space-y-4">
      <Link to="/health-habits" className="block">
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-3 md:p-4 rounded-lg md:rounded-xl hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-800/30 dark:hover:to-pink-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
              <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Gym Streak</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-pink-600 dark:text-pink-400">{data.gymStreak} days</span>
          </div>
        </div>
      </Link>
      <Link to="/health-habits" className="block">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 md:p-4 rounded-lg md:rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Water Intake</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
              {data.waterIntake}/{data.waterTarget}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((data.waterIntake / data.waterTarget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </Link>
    </div>
  )

  const renderPlantCareWidget = (data: any) => (
    <div className="space-y-4">
      <Link to="/plant-care" className="block">
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Plants</span>
            </div>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">{data.totalPlants}</span>
          </div>
        </div>
      </Link>
      <Link to="/plant-care" className="block">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Need Water</span>
            </div>
            <span className={`text-xl font-bold ${data.needWater > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {data.needWater}
            </span>
          </div>
        </div>
      </Link>
      <Link to="/plant-care" className="block">
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-xl hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Care Tasks</span>
            </div>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{data.careTasks}</span>
          </div>
        </div>
      </Link>
    </div>
  )

  const renderFinanceSummaryWidget = (data: any) => (
    <div className="space-y-4">
      <Link to="/finance" className="block">
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Earned Today</span>
            </div>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">${data.totalEarned}</span>
          </div>
        </div>
      </Link>
      <Link to="/finance" className="block">
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/30 dark:hover:to-red-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Spent Today</span>
            </div>
            <span className="text-xl font-bold text-red-600 dark:text-red-400">${data.totalSpent}</span>
          </div>
        </div>
      </Link>
      <Link to="/finance" className="block">
        <div className={`p-4 rounded-xl hover:transition-all duration-200 cursor-pointer ${data.netAmount >= 0 ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30' : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/30 dark:hover:to-red-700/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net Amount</span>
            </div>
            <span className={`text-xl font-bold ${data.netAmount >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
              ${data.netAmount}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )

  const renderDevProgressWidget = (data: any) => (
    <div className="space-y-4">
      <Link to="/dev-roadmap" className="block">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Streak</span>
            </div>
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{data.currentStreak} days</span>
          </div>
        </div>
      </Link>
      <Link to="/dev-roadmap" className="block">
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-xl hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-800/30 dark:hover:to-indigo-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today's Hours</span>
            </div>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{data.todayHours}h</span>
          </div>
        </div>
      </Link>
      <Link to="/dev-roadmap" className="block">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LeetCode Solved</span>
            </div>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{data.leetcodeSolved}</span>
          </div>
        </div>
      </Link>
    </div>
  )

  const renderNotesSummaryWidget = (data: any[]) => (
    <div className="space-y-3">
      {data.map((note) => (
        <Link
          key={note.id}
          to="/notes"
          className="block"
        >
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{note.title}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{note.content}</p>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </Link>
      ))}
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent notes</p>
        </div>
      )}
    </div>
  )

  const renderWidgetContent = (widget: WidgetData) => {
    switch (widget.type) {
      case 'quick-stats':
        return renderQuickStatsWidget(widget.data)
      case 'today-tasks':
        return renderTodayTasksWidget(widget.data)
      case 'upcoming-events':
        return renderUpcomingEventsWidget(widget.data)
      case 'health-progress':
        return renderHealthProgressWidget(widget.data)
      case 'plant-care':
        return renderPlantCareWidget(widget.data)
      case 'finance-summary':
        return renderFinanceSummaryWidget(widget.data)
      case 'dev-progress':
        return renderDevProgressWidget(widget.data)
      case 'notes-summary':
        return renderNotesSummaryWidget(widget.data)
      default:
        return <div>Unknown widget type</div>
    }
  }

  if (isLoading) {
    return (
      <div className={`${className} space-y-6`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mobile Widgets</h2>
          <Smartphone className="w-6 h-6 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} space-y-6`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Mobile Widgets</h2>
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          {showSettings && (
            <Link
              to="/widgets"
              className="p-1 md:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {widgets.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              <Smartphone className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Widgets Available</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Widgets failed to load. Check the console for errors.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        )}
        {widgets.map((widget) => {
          const Icon = getWidgetIcon(widget.type)
          const isExpanded = expandedWidgets.has(widget.type)
          
          return (
            <div
              key={widget.type}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Widget Header */}
              <div className={`bg-gradient-to-r ${getWidgetColor(widget.type)} p-3 md:p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    <h3 className="font-semibold text-sm md:text-base">{widget.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRefreshWidget(widget.type)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Widget Content */}
              <div className="p-3 md:p-4">
                {isExpanded ? (
                  renderWidgetContent(widget)
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click to expand</p>
                  </div>
                )}
              </div>

              {/* Widget Footer */}
              <div className="px-3 md:px-4 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="hidden sm:inline">Last updated: {new Date(widget.lastUpdated).toLocaleTimeString()}</span>
                  <span className="sm:hidden">Updated: {new Date(widget.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <Link
                    to={getWidgetLink(widget.type)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MobileWidgets
