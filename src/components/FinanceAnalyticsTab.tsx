import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Calendar, Filter } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense' | 'savings'
  amount: number
  description: string
  category: string
  date: string
}

interface FinanceAnalyticsTabProps {
  transactions: Transaction[]
  showBalance: boolean
}

const FinanceAnalyticsTab: React.FC<FinanceAnalyticsTabProps> = ({
  transactions,
  showBalance
}) => {
  const [period, setPeriod] = useState<'month' | 'year'>('month')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Calculate analytics data
  const getAnalyticsData = () => {
    const now = new Date()
    const startDate = period === 'month' 
      ? new Date(now.getFullYear(), now.getMonth(), 1)
      : new Date(now.getFullYear(), 0, 1)
    
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= startDate
    })

    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const savings = filteredTransactions
      .filter(t => t.type === 'savings')
      .reduce((sum, t) => sum + t.amount, 0)

    // Category breakdown for expenses
    const categoryBreakdown = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)

    // Monthly trend data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthStart = new Date(now.getFullYear(), i, 1)
      const monthEnd = new Date(now.getFullYear(), i + 1, 0)
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= monthStart && transactionDate <= monthEnd
      })

      return {
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        income: monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        expenses: monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        savings: monthTransactions.filter(t => t.type === 'savings').reduce((sum, t) => sum + t.amount, 0)
      }
    })

    return {
      income,
      expenses,
      savings,
      balance: income - expenses,
      categoryBreakdown,
      monthlyData,
      transactionCount: filteredTransactions.length
    }
  }

  const analytics = getAnalyticsData()

  // Get top spending categories
  const topCategories = Object.entries(analytics.categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  // Calculate percentage for pie chart
  const totalExpenses = analytics.expenses
  const categoryPercentages = topCategories.map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
  }))

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ]
    return colors[index % colors.length]
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Food': '🍕',
      'Transport': '🚗',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Entertainment': '🎬',
      'Health': '🏥',
      'Education': '📚',
      'Other': '📝'
    }
    return icons[category] || '📝'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Insights and trends from your financial data</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'month' | 'year')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {showBalance ? `£${analytics.income.toLocaleString()}` : '••••••'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {showBalance ? `£${analytics.expenses.toLocaleString()}` : '••••••'}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Balance</p>
              <p className={`text-2xl font-bold ${analytics.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                {showBalance ? `£${analytics.balance.toLocaleString()}` : '••••••'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              analytics.balance >= 0 
                ? 'bg-blue-100 dark:bg-blue-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <DollarSign className={`w-6 h-6 ${
                analytics.balance >= 0 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Savings</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {showBalance ? `£${analytics.savings.toLocaleString()}` : '••••••'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending by Category</h3>
            <PieChart className="w-5 h-5 text-gray-500" />
          </div>
          
          {topCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryPercentages.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getCategoryColor(index)}`}></div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(item.category)}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {showBalance ? `£${item.amount.toLocaleString()}` : '••••••'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Trend</h3>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {analytics.monthlyData.slice(-6).map((month, index) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">{month.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-green-600 dark:text-green-400">
                      {showBalance ? `+£${month.income.toLocaleString()}` : '••••••'}
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      {showBalance ? `-£${month.expenses.toLocaleString()}` : '••••••'}
                    </span>
                  </div>
                </div>
                <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${analytics.income > 0 ? (month.income / analytics.income) * 100 : 0}%` }}
                  ></div>
                  <div 
                    className="bg-red-500 h-full transition-all duration-300"
                    style={{ width: `${analytics.expenses > 0 ? (month.expenses / analytics.expenses) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Savings Rate</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {analytics.income > 0 ? `${((analytics.savings / analytics.income) * 100).toFixed(1)}%` : '0%'} of income saved
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Top Spending Category</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {topCategories.length > 0 ? topCategories[0][0] : 'No data'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Transaction Count</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {analytics.transactionCount} transactions this {period}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Average Transaction</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {analytics.transactionCount > 0 
                    ? `£${((analytics.income + analytics.expenses + analytics.savings) / analytics.transactionCount).toFixed(0)}`
                    : '£0'
                  } per transaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinanceAnalyticsTab
