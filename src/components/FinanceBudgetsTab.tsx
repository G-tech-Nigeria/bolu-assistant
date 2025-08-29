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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set spending limits and track your expenses for {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onAddBudget}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-orange-500 w-5 h-5" />
            <h3 className="font-semibold text-orange-800 dark:text-orange-200">Budget Alerts</h3>
          </div>
          <div className="space-y-2">
            {budgetAlerts.map(budget => {
              const percentage = budget.limit > 0 ? (budget.spent || 0) / budget.limit * 100 : 0
              return (
                <div key={budget.id} className="flex items-center justify-between text-sm">
                  <span className="text-orange-700 dark:text-orange-300">{budget.category}</span>
                  <span className="font-medium text-orange-800 dark:text-orange-200">
                    {percentage.toFixed(0)}% used
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => {
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
          const status = getBudgetStatus({ ...budget, spent: monthSpent })
          const remaining = (budget.limit || 0) - monthSpent
          
          return (
            <div key={budget.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getCategoryIcon(budget.category)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {budget.period} • {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditBudget(budget)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteBudget(budget)}
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
                  <span className={`font-semibold ${status.color}`}>{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage >= 100 ? 'bg-red-500' :
                      percentage >= 80 ? 'bg-orange-500' :
                      percentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Amounts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {showBalance ? `£${monthSpent.toLocaleString()}` : '••••••'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Limit</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {showBalance ? `£${(budget.limit || 0).toLocaleString()}` : '••••••'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Remaining</span>
                  <span className={`font-semibold ${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {showBalance ? `£${Math.abs(remaining).toLocaleString()}` : '••••••'}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className={`mt-4 px-3 py-2 rounded-lg ${status.bgColor}`}>
                <div className="flex items-center gap-2">
                  {status.status === 'exceeded' && <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />}
                  {status.status === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                  {status.status === 'moderate' && <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                  {status.status === 'good' && <Target className="w-4 h-4 text-green-600 dark:text-green-400" />}
                  <span className={`text-sm font-medium ${status.color}`}>
                    {status.status === 'exceeded' && 'Budget Exceeded'}
                    {status.status === 'warning' && 'Approaching Limit'}
                    {status.status === 'moderate' && 'Moderate Spending'}
                    {status.status === 'good' && 'On Track'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {budgets.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets set</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create budgets to track your spending and stay on top of your finances
          </p>
          <button
            onClick={onAddBudget}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Budget
          </button>
        </div>
      )}
    </div>
  )
}

export default FinanceBudgetsTab
