import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  getAgendaTasks, 
  getPlants, 
  getDevRoadmapUserStats, 
  getFinancialAnalytics,
  getBudgets
} from '../lib/database'

interface WidgetPageProps {
  isWidget?: boolean
}

const WidgetPage: React.FC<WidgetPageProps> = ({ isWidget = false }) => {
  const [stats, setStats] = useState({
    devRoadmapProgress: 0,
    agendaTasks: [] as any[],
    plants: [] as any[],
    monthlyBudget: 0,
    remainingBudget: 0,
    plantsNeedingWater: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWidgetData()
  }, [])

  const loadWidgetData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const [agendaTasks, plants, devStats, financeData, budgets] = await Promise.all([
        getAgendaTasks(today),
        getPlants(),
        getDevRoadmapUserStats(),
        getFinancialAnalytics(),
        getBudgets()
      ])

      // Calculate dev roadmap progress
      let devProgress = 0
      if (devStats && devStats.total_hours) {
        devProgress = Math.min(Math.round((devStats.total_hours / 8) * 100), 100) // 8 hours = 100%
      }

      // Calculate budget info
      let monthlyBudget = 0
      let remainingBudget = 0
      if (budgets && budgets.length > 0) {
        const currentBudget = budgets[0]
        monthlyBudget = currentBudget.limit || 0
        remainingBudget = monthlyBudget - (financeData?.expenses || 0)
      }

      // Calculate plants needing water
      const plantsNeedingWater = plants?.filter((p: any) => p.needsWater)?.length || 0

      setStats({
        devRoadmapProgress: devProgress,
        agendaTasks: agendaTasks || [],
        plants: plants || [],
        monthlyBudget,
        remainingBudget: Math.max(remainingBudget, 0),
        plantsNeedingWater
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
          </div>
        )}

        <div className="space-y-3">
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
                <p className="text-2xl font-bold">{stats.agendaTasks.length}</p>
              </div>
              <div className="text-3xl">📝</div>
            </div>
            <p className="text-xs opacity-80 mt-1">
              {stats.agendaTasks.filter((t: any) => t.completed).length} completed
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
                <p className="text-2xl font-bold">{stats.plants.length}</p>
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
                <p className="text-sm opacity-90">Monthly Budget</p>
                <p className="text-2xl font-bold">${stats.monthlyBudget}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
            <p className="text-xs opacity-80 mt-1">
              ${stats.remainingBudget} remaining
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
