import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Transaction {
  id: string
  type: 'income' | 'expense' | 'savings'
  amount: number
  description: string
  category: string
  date: string
}

interface FinanceChartsProps {
  transactions: Transaction[]
  selectedMonth: { month: number; year: number }
  showBalance: boolean
}

const FinanceCharts: React.FC<FinanceChartsProps> = ({
  transactions,
  selectedMonth,
  showBalance
}) => {
  // Filter transactions for selected month
  const monthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getMonth() === selectedMonth.month && 
           transactionDate.getFullYear() === selectedMonth.year
  })

  // Calculate data for charts
  const income = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const expenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const savings = monthTransactions
    .filter(t => t.type === 'savings')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  // Category breakdown for expenses
  const categoryBreakdown = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + (t.amount || 0)
      return acc
    }, {} as Record<string, number>)

  // Monthly trend data (last 6 months)
  const monthlyTrendData = Array.from({ length: 6 }, (_, i) => {
    const targetMonth = new Date(selectedMonth.year, selectedMonth.month - i, 1)
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === targetMonth.getMonth() && 
             transactionDate.getFullYear() === targetMonth.getFullYear()
    })

    return {
      month: targetMonth.toLocaleDateString('en-US', { month: 'short' }),
      income: monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0),
      expenses: monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0),
      savings: monthTransactions.filter(t => t.type === 'savings').reduce((sum, t) => sum + (t.amount || 0), 0)
    }
  }).reverse()

  // Chart configurations
  const spendingTrendConfig = {
    data: {
      labels: monthlyTrendData.map(d => d.month),
      datasets: [
        {
          label: 'Income',
          data: monthlyTrendData.map(d => d.income),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(34, 197, 94)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Expenses',
          data: monthlyTrendData.map(d => d.expenses),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(239, 68, 68)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Savings',
          data: monthlyTrendData.map(d => d.savings),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(147, 51, 234)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: '6-Month Financial Trends',
          font: {
            size: 16,
            weight: 'bold' as const
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context: any) {
              return `${context.dataset.label}: £${context.parsed.y.toLocaleString()}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(156, 163, 175, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return '£' + value.toLocaleString()
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(156, 163, 175, 0.1)'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index' as const
      }
    }
  }

  const categoryBreakdownConfig = {
    data: {
      labels: Object.keys(categoryBreakdown),
      datasets: [
        {
          data: Object.values(categoryBreakdown),
          backgroundColor: [
            '#3B82F6', // Blue
            '#10B981', // Green
            '#F59E0B', // Yellow
            '#EF4444', // Red
            '#8B5CF6', // Purple
            '#F97316', // Orange
            '#06B6D4', // Cyan
            '#84CC16'  // Lime
          ],
          borderWidth: 2,
          borderColor: '#fff',
          hoverBorderWidth: 3,
          hoverBorderColor: '#fff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: 'Spending by Category',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const total = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return `${context.label}: £${context.parsed.toLocaleString()} (${percentage}%)`
            }
          }
        }
      }
    }
  }

  const monthlyComparisonConfig = {
    data: {
      labels: ['Income', 'Expenses', 'Savings'],
      datasets: [
        {
          data: [income, expenses, savings],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',   // Green for income
            'rgba(239, 68, 68, 0.8)',   // Red for expenses
            'rgba(147, 51, 234, 0.8)'   // Purple for savings
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(239, 68, 68)',
            'rgb(147, 51, 234)'
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Monthly Overview',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `£${context.parsed.toLocaleString()}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(156, 163, 175, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return '£' + value.toLocaleString()
            }
          }
        }
      }
    }
  }

  // Get top spending categories for display
  const topCategories = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Financial Analytics & Charts
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Visual insights for {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trends Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="h-80">
            <Line {...spendingTrendConfig} />
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="h-80">
            <Doughnut {...categoryBreakdownConfig} />
          </div>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="h-64">
          <Bar {...monthlyComparisonConfig} />
        </div>
      </div>

      {/* Top Spending Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Spending Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCategories.map(([category, amount], index) => {
            const total = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0)
            const percentage = total > 0 ? (amount / total) * 100 : 0
            
            return (
              <div key={category} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{category}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {showBalance ? `£${amount.toLocaleString()}` : '••••••'}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                      ][index % 5]
                    }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chart Legend & Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Chart Features</h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>Interactive:</strong> Hover over charts to see detailed values</p>
              <p><strong>Responsive:</strong> Charts adapt to your screen size</p>
              <p><strong>Real-time:</strong> Data updates automatically with your transactions</p>
              <p><strong>Mobile-friendly:</strong> Touch gestures work on phones and tablets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinanceCharts
