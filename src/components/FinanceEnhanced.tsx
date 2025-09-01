import React, { useState, useEffect } from 'react'
import { 
  DollarSign, TrendingDown, Trash2, X, Eye, EyeOff, Search, PiggyBank, Plus, 
  TrendingUp, Edit3, BarChart3, PieChart, Target, AlertTriangle, Calendar,
  CreditCard, Wallet, Receipt, ArrowUpRight, ArrowDownRight, Settings
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { 
  getFinanceTransactions, 
  addFinanceTransaction, 
  updateFinanceTransaction, 
  deleteFinanceTransaction,
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  getSavingsGoals,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  getBills,
  addBill,
  updateBill,
  deleteBill
} from '../lib/database'
import FinanceTransactionsTab from './FinanceTransactionsTab'
import FinanceBudgetsTab from './FinanceBudgetsTab'
import FinanceGoalsTab from './FinanceGoalsTab'
import FinanceBillsTab from './FinanceBillsTab'
import FinanceAnalyticsTab from './FinanceAnalyticsTab'
import FinanceCharts from './FinanceCharts'

// Enhanced interfaces
interface Transaction {
  id: string
  type: 'income' | 'expense' | 'savings'
  amount: number
  description: string
  category: string
  date: string
}

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'yearly'
}

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
}

interface Bill {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
  isRecurring: boolean
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'once'
  status: 'pending' | 'paid' | 'overdue'
  notes?: string
  paidDate?: string
}

const FinanceEnhanced = () => {
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'goals' | 'bills' | 'analytics' | 'charts'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<{ month: number; year: number }>({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  })

  // Modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showBillModal, setShowBillModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSavingsModal, setShowSavingsModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set())

  // Form states
  const [transactionForm, setTransactionForm] = useState({
    type: 'income' as 'income' | 'expense',
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  })

  const [budgetForm, setBudgetForm] = useState({
    category: '',
    limit: 0,
    period: 'monthly' as 'monthly' | 'yearly'
  })

  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    category: ''
  })

  const [billForm, setBillForm] = useState({
    name: '',
    amount: 0,
    dueDate: '',
    category: '',
    isRecurring: false,
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly' | 'once',
    notes: '',
    paidDate: ''
  })

  // Savings form state
  const [savingsForm, setSavingsForm] = useState({
    amount: 0,
    description: '',
    category: '',
    goalId: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Delete confirmation state
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // Delete functions
  const deleteTransaction = async (transaction: any) => {
    try {
      await deleteFinanceTransaction(transaction.id)
      // Don't update local state here - let real-time handle it
    } catch (err) {
      console.error('Failed to delete transaction:', err)
      setError('Failed to delete transaction')
    }
  }

  const handleDeleteBudget = async (budget: any) => {
    try {
      await deleteBudget(budget.id)
      // Don't update local state here - let real-time handle it
    } catch (err) {
      console.error('Failed to delete budget:', err)
      setError('Failed to delete budget')
    }
  }

  const handleDeleteGoal = async (goal: any) => {
    try {
      await deleteSavingsGoal(goal.id)
      // Don't update local state here - let real-time handle it
    } catch (err) {
      console.error('Failed to delete goal:', err)
      setError('Failed to delete goal')
    }
  }

  const handleDeleteBill = async (bill: any) => {
    try {
      await deleteBill(bill.id)
      // Don't update local state here - let real-time handle it
    } catch (err) {
      console.error('Failed to delete bill:', err)
      setError('Failed to delete bill')
    }
  }

  // Load data
  useEffect(() => {
    loadData()
  }, [])



  // Listen for custom events from child components
  useEffect(() => {
    const handleShowSavingsModal = () => setShowSavingsModal(true)
    
    window.addEventListener('showSavingsModal', handleShowSavingsModal)
    
    return () => {
      window.removeEventListener('showSavingsModal', handleShowSavingsModal)
    }
  }, [])

  // Real-time subscriptions
  useEffect(() => {
    // Subscribe to real-time changes
    const transactionsSubscription = supabase
      .channel('finance_transactions_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'finance_transactions' },
        (payload) => {
          console.log('Transaction change detected:', payload)
          
          // Create a unique key for this update to prevent duplicates
          const updateKey = `${payload.eventType}-${payload.new?.id || payload.old?.id}-${Date.now()}`
          
          setLastUpdate(`Transaction ${payload.eventType.toLowerCase()}d at ${new Date().toLocaleTimeString()}`)
          
          // Update local state immediately for better UX
          if (payload.eventType === 'INSERT') {
            // Add new transaction to the beginning of the list, but check for duplicates
            const newTransaction = {
              id: payload.new.id,
              type: payload.new.type,
              amount: payload.new.amount,
              description: payload.new.description,
              category: payload.new.category,
              date: payload.new.date
            }
            setTransactions(prev => {
              // Check if transaction already exists to prevent duplicates
              const exists = prev.some(t => t.id === newTransaction.id)
              if (exists) {
                console.log('Transaction already exists, skipping duplicate')
                return prev
              }
              console.log('Adding new transaction:', newTransaction.id)
              return [newTransaction, ...prev]
            })
          } else if (payload.eventType === 'UPDATE') {
            // Update existing transaction
            const updatedTransaction = {
              id: payload.new.id,
              type: payload.new.type,
              amount: payload.new.amount,
              description: payload.new.description,
              category: payload.new.category,
              date: payload.new.date
            }
            setTransactions(prev => {
              const exists = prev.some(t => t.id === updatedTransaction.id)
              if (!exists) {
                console.log('Transaction not found for update, adding as new')
                return [updatedTransaction, ...prev]
              }
              return prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
            })
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted transaction
            setTransactions(prev => prev.filter(t => t.id !== payload.old.id))
          }
        }
      )
            .subscribe((status) => {
        console.log('Transactions subscription status:', status)
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true)
        }
      })

    const budgetsSubscription = supabase
      .channel('budgets_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'budgets' },
        (payload) => {
          console.log('Budget change detected:', payload)
          // Update local state immediately
          if (payload.eventType === 'INSERT') {
            const newBudget = {
              id: payload.new.id,
              category: payload.new.category,
              limit: payload.new.budget_limit,
              spent: payload.new.spent,
              period: payload.new.period,
              createdAt: payload.new.created_at
            }
            setBudgets(prev => {
              // Check if budget already exists to prevent duplicates
              const exists = prev.some(b => b.id === newBudget.id)
              if (exists) {
                console.log('Budget already exists, skipping duplicate')
                return prev
              }
              return [newBudget, ...prev]
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedBudget = {
              id: payload.new.id,
              category: payload.new.category,
              limit: payload.new.budget_limit,
              spent: payload.new.spent,
              period: payload.new.period,
              createdAt: payload.new.created_at
            }
            setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? updatedBudget : b))
          } else if (payload.eventType === 'DELETE') {
            setBudgets(prev => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    const savingsGoalsSubscription = supabase
      .channel('savings_goals_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'savings_goals' },
        (payload) => {
          console.log('Savings goal change detected:', payload)
          // Update local state immediately
          if (payload.eventType === 'INSERT') {
            const newGoal = {
              id: payload.new.id,
              name: payload.new.name,
              targetAmount: payload.new.target_amount,
              currentAmount: payload.new.current_amount,
              targetDate: payload.new.target_date,
              category: payload.new.category,
              createdAt: payload.new.created_at
            }
            setSavingsGoals(prev => {
              // Check if goal already exists to prevent duplicates
              const exists = prev.some(g => g.id === newGoal.id)
              if (exists) {
                console.log('Savings goal already exists, skipping duplicate')
                return prev
              }
              return [newGoal, ...prev]
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedGoal = {
              id: payload.new.id,
              name: payload.new.name,
              targetAmount: payload.new.target_amount,
              currentAmount: payload.new.current_amount,
              targetDate: payload.new.target_date,
              category: payload.new.category,
              createdAt: payload.new.created_at
            }
            setSavingsGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g))
          } else if (payload.eventType === 'DELETE') {
            setSavingsGoals(prev => prev.filter(g => g.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    const billsSubscription = supabase
      .channel('bills_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bills' },
        (payload) => {
          console.log('Bill change detected:', payload)
          // Update local state immediately
          if (payload.eventType === 'INSERT') {
            const newBill = {
              id: payload.new.id,
              name: payload.new.name,
              amount: payload.new.amount,
              dueDate: payload.new.due_date,
              category: payload.new.category,
              isRecurring: payload.new.is_recurring,
              frequency: payload.new.frequency,
              status: payload.new.status,
              notes: payload.new.notes,
              paidDate: payload.new.paid_date,
              createdAt: payload.new.created_at
            }
            setBills(prev => {
              // Check if bill already exists to prevent duplicates
              const exists = prev.some(b => b.id === newBill.id)
              if (exists) {
                console.log('Bill already exists, skipping duplicate')
                return prev
              }
              return [newBill, ...prev]
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedBill = {
              id: payload.new.id,
              name: payload.new.name,
              amount: payload.new.amount,
              dueDate: payload.new.due_date,
              category: payload.new.category,
              isRecurring: payload.new.is_recurring,
              frequency: payload.new.frequency,
              status: payload.new.status,
              notes: payload.new.notes,
              paidDate: payload.new.paid_date,
              createdAt: payload.new.created_at
            }
            setBills(prev => prev.map(b => b.id === updatedBill.id ? updatedBill : b))
          } else if (payload.eventType === 'DELETE') {
            setBills(prev => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      transactionsSubscription.unsubscribe()
      budgetsSubscription.unsubscribe()
      savingsGoalsSubscription.unsubscribe()
      billsSubscription.unsubscribe()
    }
  }, [])

  // Cleanup processed IDs periodically to prevent memory leaks
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setProcessedIds(new Set())
    }, 60000) // Clear every minute

    return () => clearInterval(cleanupInterval)
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Load all data from database
      const [transactionsData, budgetsData, goalsData, billsData] = await Promise.all([
        getFinanceTransactions(),
        getBudgets(),
        getSavingsGoals(),
        getBills()
      ])
      
      setTransactions(transactionsData)
      setBudgets(budgetsData)
      setSavingsGoals(goalsData)
      setBills(billsData)
      
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load data. Please run the SQL setup first.')
      
      // Fallback to sample data if database fails
      setBudgets([
        { id: '1', category: 'Food', limit: 500, spent: 320, period: 'monthly' },
        { id: '2', category: 'Transport', limit: 200, spent: 150, period: 'monthly' },
        { id: '3', category: 'Entertainment', limit: 300, spent: 280, period: 'monthly' }
      ])
      
      setSavingsGoals([
        { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500, targetDate: '2024-12-31', category: 'Emergency' },
        { id: '2', name: 'Vacation Fund', targetAmount: 5000, currentAmount: 1200, targetDate: '2024-06-30', category: 'Travel' }
      ])
      
      setBills([
        { id: '1', name: 'Rent', amount: 1200, dueDate: '2024-01-01', category: 'Housing', isRecurring: true, frequency: 'monthly', status: 'pending' },
        { id: '2', name: 'Electricity', amount: 150, dueDate: '2024-01-15', category: 'Utilities', isRecurring: true, frequency: 'monthly', status: 'pending' },
        { id: '3', name: 'Car Insurance', amount: 800, dueDate: '2024-03-01', category: 'Insurance', isRecurring: true, frequency: 'yearly', status: 'pending' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate financial metrics for selected month
  const monthlyIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'income' && 
             transactionDate.getMonth() === selectedMonth.month && 
             transactionDate.getFullYear() === selectedMonth.year
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const monthlyExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'expense' && 
             transactionDate.getMonth() === selectedMonth.month && 
             transactionDate.getFullYear() === selectedMonth.year
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlySavings = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'savings' && 
             transactionDate.getMonth() === selectedMonth.month && 
             transactionDate.getFullYear() === selectedMonth.year
    })
    .reduce((sum, t) => sum + t.amount, 0)



  // Calculate available spending money (Income - Savings - Expenses)
  const monthlyAvailableToSpend = monthlyIncome - monthlySavings - monthlyExpenses

  // Calculate upcoming bills for selected month
  const upcomingBills = bills
    .filter(bill => {
      if (bill.status !== 'pending' || !bill.dueDate) return false
      
      // Filter by selected month
      const dueDate = new Date(bill.dueDate)
      const isSelectedMonth = dueDate.getMonth() === selectedMonth.month && 
                             dueDate.getFullYear() === selectedMonth.year
      
      return isSelectedMonth
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const totalUpcomingBills = upcomingBills.reduce((sum, bill) => sum + (bill.amount || 0), 0)

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

  // Calculate monthly budget summary for selected month
  const monthlyBudgetSummary = budgets
    .filter(budget => budget.period === 'monthly')
    .map(budget => {
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
      const remaining = (budget.limit || 0) - monthSpent
      return {
        ...budget,
        spent: monthSpent,
        percentage,
        remaining,
        monthYear: new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
    })

  // Calculate savings progress
  const totalSavingsGoals = savingsGoals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0)
  const totalCurrentSavings = savingsGoals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0)
  const savingsProgress = totalSavingsGoals > 0 ? (totalCurrentSavings / totalSavingsGoals) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Financial Planning</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">Track, plan, and optimize your finances</p>
            </div>
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:gap-3">
              {/* Month Picker */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:gap-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      const prevMonth = selectedMonth.month === 0 ? 11 : selectedMonth.month - 1
                      const prevYear = selectedMonth.month === 0 ? selectedMonth.year - 1 : selectedMonth.year
                      setSelectedMonth({ month: prevMonth, year: prevYear })
                    }}
                    className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Previous Month"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                    <select
                      value={selectedMonth.month}
                      onChange={(e) => setSelectedMonth(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                      className="px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 cursor-pointer min-w-[100px] sm:min-w-[140px] text-center"
                    >
                      {[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ].map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={selectedMonth.year}
                      onChange={(e) => setSelectedMonth(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 cursor-pointer min-w-[80px] sm:min-w-[100px] text-center"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => {
                      const nextMonth = selectedMonth.month === 11 ? 0 : selectedMonth.month + 1
                      const nextYear = selectedMonth.month === 11 ? selectedMonth.year + 1 : selectedMonth.year
                      setSelectedMonth({ month: nextMonth, year: nextYear })
                    }}
                    className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Next Month"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Current Month Button */}
                <button
                  onClick={() => setSelectedMonth({
                    month: new Date().getMonth(),
                    year: new Date().getFullYear()
                  })}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors font-medium ${
                    selectedMonth.month === new Date().getMonth() && selectedMonth.year === new Date().getFullYear()
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Current Month
                </button>
              </div>
              
              {/* Real-time connection indicator */}
              <div className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs">
                <div className={`w-2 h-2 rounded-full ${isRealtimeConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className={isRealtimeConnected ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                  {isRealtimeConnected ? 'Live Updates' : 'Connecting...'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                >
                  {showBalance ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                  <span className="hidden sm:inline">{showBalance ? 'Hide' : 'Show'} Amounts</span>
                  <span className="sm:hidden">{showBalance ? 'Hide' : 'Show'}</span>
                </button>
                
                <button
                  onClick={loadData}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                >
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">↻</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex flex-wrap gap-1 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'transactions', label: 'Transactions', icon: Receipt },
              { id: 'budgets', label: 'Budgets', icon: Target },
              { id: 'goals', label: 'Goals', icon: TrendingUp },
              { id: 'bills', label: 'Bills', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: PieChart },
              { id: 'charts', label: 'Charts', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.charAt(0)}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Real-time Update Notification */}
        {lastUpdate && (
          <div className="mb-4 sm:mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                <span className="text-xs sm:text-sm text-green-800 dark:text-green-200">{lastUpdate}</span>
              </div>
              <button
                onClick={() => setLastUpdate('')}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {!isLoading && (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                          {showBalance ? `£${monthlyIncome.toLocaleString()}` : '••••••'}
                        </p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 dark:text-red-400">
                          {showBalance ? `£${monthlyExpenses.toLocaleString()}` : '••••••'}
                        </p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Available to Spend</p>
                        <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${monthlyAvailableToSpend >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                          {showBalance ? `£${monthlyAvailableToSpend.toLocaleString()}` : '••••••'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          After savings & expenses
                        </p>
                      </div>
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center ${
                        monthlyAvailableToSpend >= 0 
                          ? 'bg-blue-100 dark:bg-blue-900/30' 
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        <DollarSign className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                          monthlyAvailableToSpend >= 0 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Savings</p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {showBalance ? `£${monthlySavings.toLocaleString()}` : '••••••'}
                        </p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>

                </div>



                {/* Alerts and Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Budget Alerts */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Budget Alerts</h3>
                      <button
                        onClick={() => setActiveTab('budgets')}
                        className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    {budgetAlerts.length === 0 ? (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">All budgets are within limits</p>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {budgetAlerts.map(budget => {
                          const percentage = budget.limit > 0 ? (budget.spent || 0) / budget.limit * 100 : 0
                          return (
                            <div key={budget.id} className="flex items-center justify-between p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                              <div>
                                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{budget.category}</p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                  £{(budget.spent || 0).toLocaleString()} / £{(budget.limit || 0).toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm sm:text-base font-semibold text-red-600 dark:text-red-400">{percentage.toFixed(0)}%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">used</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Upcoming Bills */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        Upcoming Bills - {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <button
                        onClick={() => setActiveTab('bills')}
                        className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    {upcomingBills.length === 0 ? (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No upcoming bills</p>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {upcomingBills.map(bill => (
                          <div key={bill.id} className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div>
                              <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{bill.name}</p>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                Due {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'No date'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="text-right">
                                <p className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">
                                  £{(bill.amount || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{bill.category}</p>
                              </div>
                              <button
                                onClick={async () => {
                                  try {
                                    // Create transaction from bill
                                    const newTransaction = {
                                      type: 'expense' as const,
                                      amount: bill.amount,
                                      description: `Bill Payment: ${bill.name}`,
                                      category: bill.category,
                                      date: new Date().toISOString().split('T')[0] // Today's date
                                    }
                                    
                                    // Add transaction to database
                                    const createdTransaction = await addFinanceTransaction(newTransaction)
                                    
                                    // Update local state immediately as fallback
                                    setTransactions(prev => [{
                                      id: createdTransaction.id,
                                      type: createdTransaction.type,
                                      amount: createdTransaction.amount,
                                      description: createdTransaction.description,
                                      category: createdTransaction.category,
                                      date: createdTransaction.date
                                    }, ...prev])
                                    
                                    // Update bill status to paid and add payment date
                                    await updateBill(bill.id, {
                                      status: 'paid',
                                      paidDate: new Date().toISOString().split('T')[0]
                                    })
                                    
                                    // Real-time subscriptions will handle the updates automatically
                                  } catch (error) {
                                    console.error('Error marking bill as paid:', error)
                                    setError('Failed to mark bill as paid')
                                  }
                                }}
                                className="p-1 text-blue-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                title="Mark as paid"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recently Paid Bills */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recently Paid Bills - {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setActiveTab('bills')}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      View All
                    </button>
                  </div>
                  {(() => {
                    const paidBills = bills
                      .filter(bill => {
                        if (bill.status !== 'paid' || !bill.paidDate) return false
                        
                        // Filter by selected month (when it was paid)
                        const paidDate = new Date(bill.paidDate)
                        const isSelectedMonth = paidDate.getMonth() === selectedMonth.month && 
                                               paidDate.getFullYear() === selectedMonth.year
                        
                        return isSelectedMonth
                      })
                      .sort((a, b) => new Date(b.paidDate).getTime() - new Date(a.paidDate).getTime())
                      .slice(0, 3)
                    
                    return paidBills.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No bills paid this month</p>
                    ) : (
                      <div className="space-y-3">
                        {paidBills.map(bill => (
                          <div key={bill.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{bill.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Paid {bill.paidDate ? new Date(bill.paidDate).toLocaleDateString() : 'Unknown date'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600 dark:text-green-400">
                                £{(bill.amount || 0).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{bill.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>



                {/* Monthly Budget Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Monthly Budget Summary - {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setActiveTab('budgets')}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      View All
                    </button>
                  </div>
                  {monthlyBudgetSummary.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No monthly budgets set</p>
                  ) : (
                    <div className="space-y-4">
                      {monthlyBudgetSummary.map(budget => (
                        <div key={budget.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{budget.category}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                £{(budget.spent || 0).toLocaleString()} / £{(budget.limit || 0).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${
                                budget.percentage >= 100 ? 'text-red-600 dark:text-red-400' :
                                budget.percentage >= 80 ? 'text-orange-600 dark:text-orange-400' :
                                budget.percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                              }`}>
                                {budget.percentage.toFixed(0)}%
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                £{(budget.remaining || 0).toLocaleString()} remaining
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                budget.percentage >= 100 ? 'bg-red-500' :
                                budget.percentage >= 80 ? 'bg-orange-500' :
                                budget.percentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Savings Goals Progress */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowSavingsModal(true)}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Quick Add
                      </button>
                      <button
                        onClick={() => setActiveTab('goals')}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {savingsGoals.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No savings goals yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first savings goal to start tracking progress</p>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setActiveTab('goals')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Goal
                          </button>
                          <button
                            onClick={() => setShowSavingsModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Quick Add
                          </button>
                        </div>
                      </div>
                    ) : (
                      savingsGoals.map(goal => {
                        const progress = goal.targetAmount > 0 ? (goal.currentAmount || 0) / goal.targetAmount * 100 : 0
                        return (
                          <div key={goal.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{goal.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  £{(goal.currentAmount || 0).toLocaleString()} / £{(goal.targetAmount || 0).toLocaleString()}
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                {progress.toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <FinanceTransactionsTab
                transactions={transactions}
                selectedMonth={selectedMonth}
                onAddTransaction={() => setShowTransactionModal(true)}
                onEditTransaction={(transaction) => {
                  setEditingItem(transaction)
                  setTransactionForm({
                    type: transaction.type,
                    amount: transaction.amount,
                    description: transaction.description,
                    category: transaction.category,
                    date: transaction.date
                  })
                  setShowTransactionModal(true)
                }}
                onDeleteTransaction={(transaction) => {
                  setItemToDelete(transaction)
                  setShowDeleteModal(true)
                }}
                showBalance={showBalance}
              />
            )}

            {/* Budgets Tab */}
            {activeTab === 'budgets' && (
              <FinanceBudgetsTab
                budgets={budgets}
                transactions={transactions}
                selectedMonth={selectedMonth}
                onAddBudget={() => setShowBudgetModal(true)}
                onEditBudget={(budget) => {
                  setEditingItem(budget)
                  setBudgetForm({
                    category: budget.category,
                    limit: budget.limit,
                    period: budget.period
                  })
                  setShowBudgetModal(true)
                }}
                onDeleteBudget={(budget) => {
                  setItemToDelete(budget)
                  setShowDeleteModal(true)
                }}
                showBalance={showBalance}
              />
            )}

            {/* Goals Tab */}
            {activeTab === 'goals' && (
              <FinanceGoalsTab
                savingsGoals={savingsGoals}
                onAddGoal={() => setShowGoalModal(true)}
                onEditGoal={(goal) => {
                  setEditingItem(goal)
                  setGoalForm({
                    name: goal.name,
                    targetAmount: goal.targetAmount,
                    currentAmount: goal.currentAmount,
                    targetDate: goal.targetDate,
                    category: goal.category
                  })
                  setShowGoalModal(true)
                }}
                onDeleteGoal={(goal) => {
                  setItemToDelete(goal)
                  setShowDeleteModal(true)
                }}
                onUpdateProgress={(goal, newAmount) => {
                  // Update goal progress
                  setSavingsGoals(prev => prev.map(g => 
                    g.id === goal.id ? { ...g, currentAmount: newAmount } : g
                  ))
                }}
                showBalance={showBalance}
              />
            )}

            {/* Bills Tab */}
            {activeTab === 'bills' && (
              <FinanceBillsTab
                bills={bills}
                transactions={transactions}
                selectedMonth={selectedMonth}
                onAddBill={() => setShowBillModal(true)}
                onEditBill={(bill) => {
                  setEditingItem(bill)
                  setBillForm({
                    name: bill.name,
                    amount: bill.amount,
                    dueDate: bill.dueDate,
                    category: bill.category,
                    isRecurring: bill.isRecurring,
                    frequency: bill.frequency,
                    notes: bill.notes || '',
                    paidDate: bill.paidDate || ''
                  })
                  setShowBillModal(true)
                }}
                onDeleteBill={(bill) => {
                  setItemToDelete(bill)
                  setShowDeleteModal(true)
                }}
                onMarkAsPaid={async (bill) => {
                  try {
                    // Create transaction from bill
                    const newTransaction = {
                      type: 'expense' as const,
                      amount: bill.amount,
                      description: `Bill Payment: ${bill.name}`,
                      category: bill.category,
                      date: new Date().toISOString().split('T')[0] // Today's date
                    }
                    
                    // Add transaction to database
                    await addFinanceTransaction(newTransaction)
                    
                    // Update bill status to paid and add payment date
                    await updateBill(bill.id, {
                      status: 'paid',
                      paidDate: new Date().toISOString().split('T')[0]
                    })
                    
                    // Real-time subscriptions will handle the updates automatically
                  } catch (error) {
                    console.error('Error marking bill as paid:', error)
                    setError('Failed to mark bill as paid')
                  }
                }}
                showBalance={showBalance}
              />
            )}

                    {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <FinanceAnalyticsTab
            transactions={transactions}
            showBalance={showBalance}
          />
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <FinanceCharts
            transactions={transactions}
            selectedMonth={selectedMonth}
            showBalance={showBalance}
          />
        )}
          </>
        )}

        {/* Transaction Modal */}
        {showTransactionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingItem ? 'Edit Transaction' : 'Add Transaction'}
                </h3>
                <button
                  onClick={() => {
                    setShowTransactionModal(false)
                    setEditingItem(null)
                    setTransactionForm({
                      type: 'income',
                      amount: 0,
                      description: '',
                      category: '',
                      date: new Date().toISOString().split('T')[0]
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!transactionForm.description.trim() || transactionForm.amount <= 0) return

                try {
                  // Prepare transaction data
                  const transactionData = {
                    type: transactionForm.type,
                    amount: transactionForm.amount,
                    description: transactionForm.description,
                    category: transactionForm.category,
                    date: transactionForm.date
                  }

                  if (editingItem) {
                    const updatedTransaction = await updateFinanceTransaction(editingItem.id, transactionData)
                    // Update local state immediately as fallback
                    setTransactions(prev => prev.map(t => t.id === editingItem.id ? {
                      id: updatedTransaction.id,
                      type: updatedTransaction.type,
                      amount: updatedTransaction.amount,
                      description: updatedTransaction.description,
                      category: updatedTransaction.category,
                      date: updatedTransaction.date
                    } : t))
                  } else {
                    const newTransaction = await addFinanceTransaction(transactionData)
                    // Update local state immediately as fallback
                    setTransactions(prev => [{
                      id: newTransaction.id,
                      type: newTransaction.type,
                      amount: newTransaction.amount,
                      description: newTransaction.description,
                      category: newTransaction.category,
                      date: newTransaction.date
                    }, ...prev])
                  }

                  setTransactionForm({
                    type: 'income',
                    amount: 0,
                    description: '',
                    category: '',
                    date: new Date().toISOString().split('T')[0]
                  })
                  setEditingItem(null)
                  setShowTransactionModal(false)
                } catch (err) {
                  console.error('Failed to save transaction:', err)
                  setError('Failed to save transaction')
                }
              }} className="space-y-4">
                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTransactionForm(prev => ({ ...prev, type: 'income' }))}
                      className={`py-2 px-4 rounded-lg border transition-colors text-sm ${
                        transactionForm.type === 'income'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransactionForm(prev => ({ ...prev, type: 'expense' }))}
                      className={`py-2 px-4 rounded-lg border transition-colors text-sm ${
                        transactionForm.type === 'expense'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Expense
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="What was this for?"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {transactionForm.type === 'income' && (
                      <>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Gift">Gift</option>
                        <option value="Investment">Investment</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                    {transactionForm.type === 'expense' && (
                      <>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                    {transactionForm.type === 'savings' && (
                      <>
                        <option value="Emergency Fund">Emergency Fund</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Investment Goal">Investment Goal</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Transaction Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    When you recorded this transaction
                  </p>
                </div>

                {/* Pending Income Fields - Only show for income type */}
                {transactionForm.type === 'income' && (
                  <>
                    {/* Income Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Income Status
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTransactionForm(prev => ({ ...prev, status: 'received' }))}
                          className={`py-2 px-4 rounded-lg border transition-colors text-sm ${
                            transactionForm.status === 'received'
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          ✅ Received
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransactionForm(prev => ({ ...prev, status: 'pending' }))}
                          className={`py-2 px-4 rounded-lg border transition-colors text-sm ${
                            transactionForm.status === 'pending'
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          ⏳ Pending
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <strong>Received:</strong> Money already in your account | <strong>Pending:</strong> Money you expect but haven't received yet
                      </p>
                    </div>

                    {/* Expected Date - Only show for pending income */}
                    {transactionForm.status === 'pending' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expected Payment Date
                        </label>
                        <input
                          type="date"
                          value={transactionForm.expectedDate}
                          onChange={(e) => setTransactionForm(prev => ({ ...prev, expectedDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          required={transactionForm.status === 'pending'}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          When you expect to receive this money
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Add'} Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTransactionModal(false)
                      setEditingItem(null)
                      setTransactionForm({
                        type: 'income',
                        amount: 0,
                        description: '',
                        category: '',
                        date: new Date().toISOString().split('T')[0]
                      })
                    }}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Savings Modal */}
        {showSavingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Savings to Goal
                </h3>
                <button
                  onClick={() => {
                    setShowSavingsModal(false)
                    setSavingsForm({
                      amount: 0,
                      description: '',
                      category: '',
                      goalId: '',
                      date: new Date().toISOString().split('T')[0]
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!savingsForm.description.trim() || savingsForm.amount <= 0 || !savingsForm.goalId) return

                try {
                  // Create savings transaction
                  const newTransaction = {
                    type: 'savings' as const,
                    amount: savingsForm.amount,
                    description: savingsForm.description,
                    category: savingsForm.category,
                    date: savingsForm.date
                  }
                  
                  // Add transaction to database
                  await addFinanceTransaction(newTransaction)
                  
                  // Update savings goal progress
                  const selectedGoal = savingsGoals.find(g => g.id === savingsForm.goalId)
                  if (selectedGoal) {
                    await updateSavingsGoal(selectedGoal.id, {
                      currentAmount: (selectedGoal.currentAmount || 0) + savingsForm.amount
                    })
                  }
                  
                  // Reset form and close modal
                  setSavingsForm({
                    amount: 0,
                    description: '',
                    category: '',
                    goalId: '',
                    date: new Date().toISOString().split('T')[0]
                  })
                  setShowSavingsModal(false)
                  
                  // Real-time subscriptions will handle the updates automatically
                } catch (error) {
                  console.error('Error adding savings:', error)
                  setError('Failed to add savings')
                }
              }} className="space-y-4">
                {/* Goal Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Goal *
                  </label>
                  <select
                    value={savingsForm.goalId}
                    onChange={(e) => {
                      const goalId = e.target.value
                      const selectedGoal = savingsGoals.find(g => g.id === goalId)
                      setSavingsForm(prev => ({ 
                        ...prev, 
                        goalId,
                        category: selectedGoal?.category || prev.category
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Choose a savings goal</option>
                    {savingsGoals.map(goal => (
                      <option key={goal.id} value={goal.id}>
                        {goal.name} - £{(goal.currentAmount || 0).toLocaleString()} / £{(goal.targetAmount || 0).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={savingsForm.amount}
                    onChange={(e) => setSavingsForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={savingsForm.description}
                    onChange={(e) => setSavingsForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Monthly savings, Bonus, Gift"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={savingsForm.category}
                    onChange={(e) => setSavingsForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Emergency, Vacation, House"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={savingsForm.date}
                    onChange={(e) => setSavingsForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  Add Savings
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Budget Modal */}
        {showBudgetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingItem ? 'Edit Budget' : 'Add Budget'}
                </h3>
                <button
                  onClick={() => {
                    setShowBudgetModal(false)
                    setEditingItem(null)
                    setBudgetForm({
                      category: '',
                      limit: 0,
                      period: 'monthly'
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!budgetForm.category.trim() || budgetForm.limit <= 0) return

                try {
                  if (editingItem) {
                    await updateBudget(editingItem.id, budgetForm)
                    // Let real-time handle the state update
                  } else {
                    await addBudget(budgetForm)
                    // Let real-time handle the state update
                  }

                  setBudgetForm({
                    category: '',
                    limit: 0,
                    period: 'monthly'
                  })
                  setEditingItem(null)
                  setShowBudgetModal(false)
                } catch (err) {
                  console.error('Failed to save budget:', err)
                  setError('Failed to save budget')
                }
              }} className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Limit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgetForm.limit}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, limit: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Period
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBudgetForm(prev => ({ ...prev, period: 'monthly' }))}
                      className={`py-2 px-4 rounded-lg border transition-colors text-sm ${
                        budgetForm.period === 'monthly'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetForm(prev => ({ ...prev, period: 'yearly' }))}
                      className={`py-2 px-4 rounded-lg border transition-colors text-sm ${
                        budgetForm.period === 'yearly'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Add'} Budget
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBudgetModal(false)
                      setEditingItem(null)
                      setBudgetForm({
                        category: '',
                        limit: 0,
                        period: 'monthly'
                      })
                    }}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Goal Modal */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingItem ? 'Edit Savings Goal' : 'Add Savings Goal'}
                </h3>
                <button
                  onClick={() => {
                    setShowGoalModal(false)
                    setEditingItem(null)
                    setGoalForm({
                      name: '',
                      targetAmount: 0,
                      currentAmount: 0,
                      targetDate: '',
                      category: ''
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!goalForm.name.trim() || goalForm.targetAmount <= 0) return

                try {
                  if (editingItem) {
                    await updateSavingsGoal(editingItem.id, goalForm)
                    // Let real-time handle the state update
                  } else {
                    await addSavingsGoal(goalForm)
                    // Let real-time handle the state update
                  }

                  setGoalForm({
                    name: '',
                    targetAmount: 0,
                    currentAmount: 0,
                    targetDate: '',
                    category: ''
                  })
                  setEditingItem(null)
                  setShowGoalModal(false)
                } catch (err) {
                  console.error('Failed to save goal:', err)
                  setError('Failed to save goal')
                }
              }} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={goalForm.name}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>

                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={goalForm.targetAmount}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Current Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={goalForm.currentAmount}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, currentAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Target Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={goalForm.category}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Emergency">Emergency Fund</option>
                    <option value="Travel">Travel</option>
                    <option value="Investment">Investment</option>
                    <option value="Home">Home</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Add'} Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoalModal(false)
                      setEditingItem(null)
                      setGoalForm({
                        name: '',
                        targetAmount: 0,
                        currentAmount: 0,
                        targetDate: '',
                        category: ''
                      })
                    }}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bill Modal */}
        {showBillModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingItem ? 'Edit Bill' : 'Add Bill'}
                </h3>
                <button
                  onClick={() => {
                    setShowBillModal(false)
                    setEditingItem(null)
                    setBillForm({
                      name: '',
                      amount: 0,
                      dueDate: '',
                      category: '',
                      isRecurring: false,
                      frequency: 'monthly',
                      notes: ''
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!billForm.name.trim() || billForm.amount <= 0) return

                try {
                  if (editingItem) {
                    await updateBill(editingItem.id, billForm)
                    // Let real-time handle the state update
                  } else {
                    await addBill(billForm)
                    // Let real-time handle the state update
                  }

                  setBillForm({
                    name: '',
                    amount: 0,
                    dueDate: '',
                    category: '',
                    isRecurring: false,
                    frequency: 'monthly',
                    notes: '',
                    paidDate: ''
                  })
                  setEditingItem(null)
                  setShowBillModal(false)
                } catch (err) {
                  console.error('Failed to save bill:', err)
                  setError('Failed to save bill')
                }
              }} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bill Name
                  </label>
                  <input
                    type="text"
                    value={billForm.name}
                    onChange={(e) => setBillForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Rent"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={billForm.amount}
                    onChange={(e) => setBillForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={billForm.dueDate}
                    onChange={(e) => setBillForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={billForm.category}
                    onChange={(e) => setBillForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Housing">Housing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Recurring */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={billForm.isRecurring}
                      onChange={(e) => setBillForm(prev => ({ ...prev, isRecurring: e.target.checked }))}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recurring Bill
                    </span>
                  </label>
                </div>

                {/* Frequency */}
                {billForm.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequency
                    </label>
                    <select
                      value={billForm.frequency}
                      onChange={(e) => setBillForm(prev => ({ ...prev, frequency: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={billForm.notes}
                    onChange={(e) => setBillForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Add'} Bill
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBillModal(false)
                      setEditingItem(null)
                      setBillForm({
                        name: '',
                        amount: 0,
                        dueDate: '',
                        category: '',
                        isRecurring: false,
                        frequency: 'monthly',
                        notes: ''
                      })
                    }}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Item</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="font-medium text-gray-900 dark:text-white">
                  Are you sure you want to delete this item?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    // Handle delete based on item type
                    if (itemToDelete.type) {
                      // Transaction
                      deleteTransaction(itemToDelete)
                    } else if (itemToDelete.limit !== undefined) {
                      // Budget
                      handleDeleteBudget(itemToDelete)
                    } else if (itemToDelete.targetAmount !== undefined) {
                      // Goal
                      handleDeleteGoal(itemToDelete)
                    } else if (itemToDelete.dueDate) {
                      // Bill
                      handleDeleteBill(itemToDelete)
                    }
                    setShowDeleteModal(false)
                    setItemToDelete(null)
                  }}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setItemToDelete(null)
                  }}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FinanceEnhanced
