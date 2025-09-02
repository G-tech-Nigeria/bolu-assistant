import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  getAgendaTasks, 
  getPlants, 
  getDevRoadmapUserStats, 
  getFinancialAnalytics,
  getBudgets,
  getHealthHabits,
  getCalendarEvents,
  getSavingsGoals,
  getFitnessGoals,
  getWeeklyGoalProgress,
  getRunStats,
  getBills
} from '../lib/database'

interface WidgetPageProps {
  isWidget?: boolean
}

const WidgetPage: React.FC<WidgetPageProps> = ({ isWidget = false }) => {
  const [stats, setStats] = useState({
    devRoadmapProgress: 0,
    agendaTasks: [] as any[],
    plants: [] as any[],
    monthlyIncome: 0,
    monthlyExpenses: 0,
    totalPlants: 0,
    plantsNeedingWater: 0,
    totalTasks: 0,
    completedTasks: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWidgetData()
    
    // Auto-refresh every 30 seconds to keep data current
    const interval = setInterval(() => {
      loadWidgetData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadWidgetData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Use the EXACT same data loading as EnhancedDashboard
      const [
        agendaTasks,
        plants,
        healthData,
        devStats,
        events,
        financeData,
        budgets,
        savingsGoals,
        bills,
        fitnessGoals,
        weeklyGoals,
        runStats
      ] = await Promise.all([
        getAgendaTasks(today),
        getPlants(),
        getHealthHabits('gym'), // Same as dashboard
        getDevRoadmapUserStats(),
        getCalendarEvents(),
        getFinancialAnalytics(),
        getBudgets(),
        getSavingsGoals(),
        getBills(),
        getFitnessGoals(),
        getWeeklyGoalProgress(),
        getRunStats()
      ])

      // Calculate dev roadmap progress - EXACT same logic as dashboard
      let devProgress = 0
      if (devStats && devStats.total_hours) {
        devProgress = Math.min(Math.round((devStats.total_hours / 8) * 100), 100) // 8 hours = 100%
      }

      // Calculate task completion stats - EXACT same logic as dashboard
      const completedTasks = agendaTasks.filter((task: any) => task.completed).length
      const totalTasks = agendaTasks.length

      // Calculate budget info - EXACT same logic as dashboard
      let monthlyIncome = 0
      let monthlyExpenses = 0
      if (financeData) {
        monthlyIncome = financeData.income || 0
        monthlyExpenses = financeData.expenses || 0
      }

      // Calculate plants needing water - EXACT same logic as dashboard
      let plantsNeedingWater = 0
      if (plants && plants.length > 0) {
        plantsNeedingWater = plants.filter((plant: any) => {
          if (!plant.next_watering) return false
          const nextWatering = new Date(plant.next_watering)
          return nextWatering <= new Date()
        }).length
      }

      setStats({
        devRoadmapProgress: devProgress,
        agendaTasks: agendaTasks || [],
        plants: plants || [],
        monthlyIncome,
        monthlyExpenses,
        totalPlants: plants?.length || 0,
        plantsNeedingWater,
        totalTasks,
        completedTasks
      })
    } catch (error) {
      console.error('Error loading widget data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${isWidget ? 'p-2' : 'min-h-screen bg-gray-50 dark:bg-gray-900 p-4'}`}>
      <div className={`${isWidget ? '' : 'max-w-md mx-auto'}`}>
        {!isWidget && (
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              📱 BoluLife Widget
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Quick overview of your productivity
            </p>
            <button
              onClick={loadWidgetData}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Refresh Data
            </button>
          </div>
        )}

        <div className="space-y-3">
          {/* Refresh indicator for widget view */}
          {isWidget && (
            <div className="text-center mb-2">
              <button
                onClick={loadWidgetData}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh data"
              >
                🔄
              </button>
            </div>
          )}
          
          {/* Daily Progress Widget */}
          <Link 
            to="/dev-roadmap"
            className="block bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Daily Progress</p>
                <p className="text-2xl font-bold">{stats.devRoadmapProgress}%</p>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
            <div className="mt-2 bg-blue-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.devRoadmapProgress}%` }}
              ></div>
            </div>
          </Link>

          {/* Tasks Widget */}
          <Link 
            to="/agenda"
            className="block bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Today's Tasks</p>
                <p className="text-2xl font-bold">{stats.totalTasks}</p>
              </div>
              <div className="text-3xl">📝</div>
            </div>
            <p className="text-xs opacity-80 mt-1">
              {stats.completedTasks} completed
            </p>
          </Link>

          {/* Plant Care Widget */}
          <Link 
            to="/plant-care"
            className="block bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Plants</p>
                <p className="text-2xl font-bold">{stats.totalPlants}</p>
              </div>
              <div className="text-3xl">🌱</div>
            </div>
            <p className="text-xs opacity-80 mt-1">
              {stats.plantsNeedingWater} need water
            </p>
          </Link>

          {/* Finance Widget */}
          <Link 
            to="/finance"
            className="block bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Monthly Income</p>
                <p className="text-2xl font-bold">${stats.monthlyIncome}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
            <p className="text-xs opacity-80 mt-1">
              ${Math.max(stats.monthlyIncome - stats.monthlyExpenses, 0)} remaining
            </p>
          </Link>
        </div>

        {!isWidget && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add this page to your home screen for quick access
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WidgetPage
