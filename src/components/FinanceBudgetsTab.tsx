import React, { useState } from 'react'
import { Plus, Edit3, Trash2, Target, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'yearly'
}

interface FinanceBudgetsTabProps {
  budgets: Budget[]
  transactions: any[]
  selectedMonth: { month: number; year: number }
  onAddBudget: () => void
  onEditBudget: (budget: Budget) => void
  onDeleteBudget: (budget: Budget) => void
  showBalance: boolean
}

const FinanceBudgetsTab: React.FC<FinanceBudgetsTabProps> = ({
  budgets,
  transactions,
  selectedMonth,
  onAddBudget,
  onEditBudget,
  onDeleteBudget,
  showBalance
}) => {
  // Calculate budget alerts for selected month (expenses only, not savings)
  const budgetAlerts = budgets.filter(budget => {
    if (budget.period !== 'monthly') return false
    
    // Calculate spent for selected month (expenses only, not savings)
    const monthSpent = transactions
      .filter(t => {
        const transactionDate = new Date(t.date)
        return t.type === 'expense' && 
               t.category === budget.category &&
               transactionDate.getMonth() === selectedMonth.month && 
               transactionDate.getFullYear() === selectedMonth.year
      })
      .reduce((sum, t) => sum + t.amount, 0)
    
    const percentage = budget.limit > 0 ? monthSpent / budget.limit * 100 : 0
    return percentage >= 80
  })

  const getBudgetStatus = (budget: Budget) => {
    const percentage = budget.limit > 0 ? (budget.spent || 0) / budget.limit * 100 : 0
    if (percentage >= 100) return { status: 'exceeded', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' }
    if (percentage >= 80) return { status: 'warning', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' }
    if (percentage >= 60) return { status: 'moderate', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' }
    return { status: 'good', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' }
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Food': '🍕',
      'Transport': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Health': '🏥',
      'Education': '📚',
      'Travel': '✈️',
      'Other': '📝'
    }
    return icons[category] || '📝'
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Budgets</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Set spending limits and track your expenses for {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onAddBudget}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Budget</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <AlertTriangle className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5" />
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 text-sm sm:text-base">Budget Alerts</h3>
          </div>
          <div className="space-y-2">
            {budgetAlerts.map(budget => {
              const percentage = budget.limit > 0 ? (budget.spent || 0) / budget.limit * 100 : 0
              return (
                <div key={budget.id} className="flex items-center justify-between p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-lg sm:text-xl">{getCategoryIcon(budget.category)}</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{budget.category}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        £{(budget.spent || 0).toLocaleString()} / £{(budget.limit || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600 dark:text-orange-400 text-sm sm:text-base">{percentage.toFixed(0)}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">used</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Budget Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {budgets.map(budget => {
          const status = getBudgetStatus(budget)
          const percentage = budget.limit > 0 ? (budget.spent || 0) / budget.limit * 100 : 0
          const remaining = (budget.limit || 0) - (budget.spent || 0)
          
          return (
            <div key={budget.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-xl sm:text-2xl">{getCategoryIcon(budget.category)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{budget.category}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">{budget.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditBudget(budget)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteBudget(budget)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Spent</span>
                  <span className={`font-semibold text-sm sm:text-base ${status.color}`}>
                    £{(budget.spent || 0).toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${status.bgColor.replace('bg-', 'bg-').replace('dark:bg-', 'dark:bg-')}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {percentage.toFixed(0)}% used
                  </span>
                  <span className={`font-medium ${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {remaining >= 0 ? `£${remaining.toLocaleString()} left` : `£${Math.abs(remaining).toLocaleString()} over`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Limit</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    £{(budget.limit || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {budgets.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Target className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets set</h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
            Create your first budget to start tracking your spending
          </p>
          <button
            onClick={onAddBudget}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Budget</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default FinanceBudgetsTab
