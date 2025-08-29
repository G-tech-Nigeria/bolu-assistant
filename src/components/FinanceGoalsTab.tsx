import React, { useState } from 'react'
import { Plus, Edit3, Trash2, Target, TrendingUp, Calendar, DollarSign, PiggyBank } from 'lucide-react'

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
}

interface FinanceGoalsTabProps {
  savingsGoals: SavingsGoal[]
  onAddGoal: () => void
  onEditGoal: (goal: SavingsGoal) => void
  onDeleteGoal: (goal: SavingsGoal) => void
  onUpdateProgress: (goal: SavingsGoal, newAmount: number) => void
  showBalance: boolean
}

const FinanceGoalsTab: React.FC<FinanceGoalsTabProps> = ({
  savingsGoals,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onUpdateProgress,
  showBalance
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Filter goals based on status
  const filteredGoals = savingsGoals.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    if (filter === 'all') return true
    if (filter === 'active') return progress < 100
    if (filter === 'completed') return progress >= 100
    return true
  })

  // Calculate overall progress
  const totalTargetAmount = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

  const getGoalStatus = (goal: SavingsGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    const today = new Date()
    const targetDate = new Date(goal.targetDate)
    const daysUntilTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (progress >= 100) return { status: 'completed', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' }
    if (daysUntilTarget <= 30 && progress < 50) return { status: 'urgent', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' }
    if (daysUntilTarget <= 90 && progress < 75) return { status: 'warning', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' }
    return { status: 'on-track', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Emergency': '🛡️',
      'Travel': '✈️',
      'Transport': '🚗',
      'Housing': '🏠',
      'Education': '📚',
      'Investment': '📈',
      'Wedding': '💒',
      'Holiday': '🏖️',
      'Other': '🎯'
    }
    return icons[category] || '🎯'
  }

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Set and track your financial goals</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddGoal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('showSavingsModal'))}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Quick Add Savings
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">All savings goals combined</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{overallProgress.toFixed(1)}%</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                {showBalance ? `£${(totalCurrentAmount || 0).toLocaleString()} / £${(totalTargetAmount || 0).toLocaleString()}` : '•••••• / ••••••'}
              </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-blue-600 dark:bg-blue-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{savingsGoals.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Goals</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {savingsGoals.filter(g => (g.currentAmount / g.targetAmount) * 100 < 100).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {savingsGoals.filter(g => (g.currentAmount / g.targetAmount) * 100 >= 100).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
        {[
          { id: 'all', label: 'All', count: savingsGoals.length },
          { id: 'active', label: 'Active', count: savingsGoals.filter(g => (g.currentAmount / g.targetAmount) * 100 < 100).length },
          { id: 'completed', label: 'Completed', count: savingsGoals.filter(g => (g.currentAmount / g.targetAmount) * 100 >= 100).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
            <span className="px-2 py-1 text-xs bg-white dark:bg-gray-700 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const status = getGoalStatus(goal)
          const daysUntilTarget = getDaysUntilTarget(goal.targetDate)
          const remaining = goal.targetAmount - goal.currentAmount
          
          return (
            <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getCategoryIcon(goal.category)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditGoal(goal)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Amounts */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {showBalance ? `£${(goal.currentAmount || 0).toLocaleString()}` : '••••••'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Target</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {showBalance ? `£${(goal.targetAmount || 0).toLocaleString()}` : '••••••'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Remaining</span>
                  <span className={`font-semibold ${remaining >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                    {showBalance ? `£${Math.abs(remaining || 0).toLocaleString()}` : '••••••'}
                  </span>
                </div>
              </div>

              {/* Target Date */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                  {daysUntilTarget > 0 ? `${daysUntilTarget} days` : 'Overdue'}
                </span>
              </div>

              {/* Status Indicator */}
              <div className={`px-3 py-2 rounded-lg ${status.bgColor}`}>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className={`text-sm font-medium ${status.color}`}>
                    {status.status === 'completed' && 'Goal Achieved! 🎉'}
                    {status.status === 'urgent' && 'Needs Attention'}
                    {status.status === 'warning' && 'Behind Schedule'}
                    {status.status === 'on-track' && 'On Track'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No goals found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {filter === 'all' 
              ? 'Start by creating your first savings goal' 
              : `No ${filter} goals found`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={onAddGoal}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default FinanceGoalsTab
