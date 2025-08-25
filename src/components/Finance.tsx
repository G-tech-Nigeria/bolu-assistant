import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingDown, Trash2, X, Eye, EyeOff, Search, PiggyBank, Plus, TrendingUp, Edit3 } from 'lucide-react'
import { 
  getFinanceTransactions, 
  addFinanceTransaction, 
  updateFinanceTransaction, 
  deleteFinanceTransaction
} from '../lib/database'

// Simplified Finance interfaces
interface Transaction {
  id: string
  type: 'income' | 'expense' | 'savings'
  amount: number
  description: string
  category: string
  date: string
}

const Finance = () => {
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showBalance, setShowBalance] = useState(true)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useDatabase, setUseDatabase] = useState(false)

  // Form state
  const [transactionForm, setTransactionForm] = useState({
    type: 'income' as 'income' | 'expense' | 'savings',
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Data loading functions
  const loadDataFromDatabase = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const transactionsData = await getFinanceTransactions()
      setTransactions(transactionsData)
      setUseDatabase(true)
      
    } catch (err) {
      console.error('Database loading failed:', err)
      setError('Failed to load from database. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  // Database-only mode - no migration needed

  // Load data on component mount
  useEffect(() => {
    loadDataFromDatabase()
  }, [])

  // Database-only mode - no localStorage fallbacks

  // Calculate totals
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'income' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlySavings = transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'savings' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyBalance = monthlyIncome - monthlyExpenses

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!transactionForm.description.trim() || transactionForm.amount <= 0) {
      return
    }

    try {
      if (useDatabase) {
        if (editingTransaction) {
          // Update existing transaction
          const updatedTransaction = await updateFinanceTransaction(editingTransaction.id, transactionForm)
          setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? updatedTransaction : t))
        } else {
          // Add new transaction
          const newTransaction = await addFinanceTransaction(transactionForm)
          setTransactions(prev => [newTransaction, ...prev])
        }
      } else {
        // Fallback to localStorage logic
        const newTransaction: Transaction = {
          id: editingTransaction?.id || Date.now().toString(),
          ...transactionForm
        }

        if (editingTransaction) {
          setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? newTransaction : t))
        } else {
          setTransactions(prev => [newTransaction, ...prev])
        }
      }

      // Reset form
      setTransactionForm({
        type: 'income',
        amount: 0,
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      })
      setEditingTransaction(null)
      setShowTransactionModal(false)
      
    } catch (err) {
      console.error('Failed to save transaction:', err)
      setError('Failed to save transaction')
    }
  }

  // Edit transaction
  const editTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setTransactionForm({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date
    })
    setShowTransactionModal(true)
  }

  // Delete transaction
  const deleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (transactionToDelete) {
      try {
        if (useDatabase) {
          await deleteFinanceTransaction(transactionToDelete.id)
        }
        setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id))
        setTransactionToDelete(null)
        setShowDeleteModal(false)
      } catch (err) {
        console.error('Failed to delete transaction:', err)
        setError('Failed to delete transaction')
      }
    }
  }

  const cancelDelete = () => {
    setTransactionToDelete(null)
    setShowDeleteModal(false)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Salary': '💰',
      'Freelance': '💼',
      'Gift': '🎁',
      'Investment': '📈',
      'Emergency Fund': '🛡️',
      'Vacation': '✈️',
      'Investment Goal': '📊',
      'Food': '🍕',
      'Transport': '🚗',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Entertainment': '🎬',
      'Health': '🏥',
      'Other': '📝'
    }
    return icons[category] || '📝'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Finance Tracker</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">Track your income, expenses, balance, and savings</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showBalance ? 'Hide' : 'Show'} Amounts
              </button>
              <button
                onClick={() => setShowTransactionModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading transactions...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-500 mr-3">⚠️</div>
                <div>
                  <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                  <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadDataFromDatabase}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-sm underline"
                >
                  Retry
                </button>

              </div>
            </div>
          </div>
        )}

        {/* Database Status Indicator */}
        {!isLoading && (
          <div className="mb-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Connected to Database
              </span>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Monthly Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</p>
                <p className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">
                  {showBalance ? `£${monthlyIncome.toLocaleString()}` : '••••••'}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</p>
                <p className="text-lg md:text-2xl font-bold text-red-600 dark:text-red-400">
                  {showBalance ? `£${monthlyExpenses.toLocaleString()}` : '••••••'}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Balance</p>
                <p className={`text-lg md:text-2xl font-bold ${monthlyBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  {showBalance ? `£${monthlyBalance.toLocaleString()}` : '••••••'}
                </p>
              </div>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${
                monthlyBalance >= 0 
                  ? 'bg-blue-100 dark:bg-blue-900/30' 
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                <DollarSign className={`w-5 h-5 md:w-6 md:h-6 ${
                  monthlyBalance >= 0 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-red-600 dark:text-red-400'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Savings</p>
                <p className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {showBalance ? `£${monthlySavings.toLocaleString()}` : '••••••'}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-3 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
            />
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                All Transactions
                {searchTerm && (
                  <span className="ml-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    ({filteredTransactions.length} results)
                  </span>
                )}
              </h2>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:underline self-start sm:self-auto"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTransactions.length === 0 ? (
              <div className="px-4 md:px-6 py-8 md:py-12 text-center">
                <DollarSign className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchTerm ? 'No transactions found' : 'No transactions yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm md:text-base">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Start by adding your first income, expense, or savings'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowTransactionModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add Transaction
                  </button>
                )}
              </div>
            ) : (
              filteredTransactions.map(transaction => (
                <div key={transaction.id} className="px-4 md:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="text-xl md:text-2xl">{getCategoryIcon(transaction.category)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate">{transaction.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : transaction.type === 'expense'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          }`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                          <span className="truncate">{transaction.category}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`font-semibold text-sm md:text-base ${
                        transaction.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : transaction.type === 'expense'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-purple-600 dark:text-purple-400'
                      }`}>
                        {showBalance ? `${transaction.type === 'income' ? '+' : '-'}£${transaction.amount.toLocaleString()}` : '••••••'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => editTransaction(transaction)}
                          className="p-2 md:p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction)}
                          className="p-2 md:p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </>
        )}

        {/* Transaction Modal */}
        {showTransactionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </h3>
                <button
                  onClick={() => {
                    setShowTransactionModal(false)
                    setEditingTransaction(null)
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTransactionForm(prev => ({ ...prev, type: 'income' }))}
                      className={`py-3 md:py-2 px-2 md:px-4 rounded-lg border transition-colors text-sm md:text-base ${
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
                      className={`py-3 md:py-2 px-2 md:px-4 rounded-lg border transition-colors text-sm md:text-base ${
                        transactionForm.type === 'expense'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransactionForm(prev => ({ ...prev, type: 'savings' }))}
                      className={`py-3 md:py-2 px-2 md:px-4 rounded-lg border transition-colors text-sm md:text-base ${
                        transactionForm.type === 'savings'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Savings
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
                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
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
                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
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
                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
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

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-3 md:py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingTransaction ? 'Update' : 'Add'} Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTransactionModal(false)
                      setEditingTransaction(null)
                      setTransactionForm({
                        type: 'income',
                        amount: 0,
                        description: '',
                        category: '',
                        date: new Date().toISOString().split('T')[0]
                      })
                    }}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 md:py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && transactionToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Delete Transaction</h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getCategoryIcon(transactionToDelete.category)}</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transactionToDelete.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transactionToDelete.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : transactionToDelete.type === 'expense'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      }`}>
                        {transactionToDelete.type.charAt(0).toUpperCase() + transactionToDelete.type.slice(1)}
                      </span>
                      <span>{transactionToDelete.category}</span>
                      <span>•</span>
                      <span>{new Date(transactionToDelete.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`font-semibold ${
                    transactionToDelete.type === 'income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : transactionToDelete.type === 'expense'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-purple-600 dark:text-purple-400'
                  }`}>
                    {transactionToDelete.type === 'income' ? '+' : '-'}£{transactionToDelete.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white py-3 md:py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Transaction
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 md:py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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

export default Finance 