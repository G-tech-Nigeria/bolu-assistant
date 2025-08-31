import React, { useState } from 'react'
import { Search, Plus, Edit3, Trash2, DollarSign } from 'lucide-react'
import { Transaction } from './FinanceEnhanced'

interface FinanceTransactionsTabProps {
  transactions: Transaction[]
  selectedMonth: { month: number; year: number }
  onAddTransaction: () => void
  onEditTransaction: (transaction: Transaction) => void
  onDeleteTransaction: (transaction: Transaction) => void
  showBalance: boolean
}

const FinanceTransactionsTab: React.FC<FinanceTransactionsTabProps> = ({
  transactions,
  selectedMonth,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  showBalance
}) => {
  const [searchTerm, setSearchTerm] = useState('')

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

  // Filter transactions based on search and selected month
  const filteredTransactions = transactions.filter(transaction => {
    // First filter by selected month
    const transactionDate = new Date(transaction.date)
    const isSelectedMonth = transactionDate.getMonth() === selectedMonth.month && 
                           transactionDate.getFullYear() === selectedMonth.year
    
    if (!isSelectedMonth) return false
    
    // Then filter by search term
    return transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage your income, expenses, and savings for {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:gap-2">
          <button
            onClick={onAddTransaction}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('showSavingsModal'))}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">Quick Savings</span>
            <span className="sm:hidden">Savings</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
        />
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              All Transactions
              {searchTerm && (
                <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  ({filteredTransactions.length} results)
                </span>
              )}
            </h3>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline self-start sm:self-auto"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTransactions.length === 0 ? (
            <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
              <DollarSign className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No transactions found' : 'No transactions yet'}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Start by adding your first income, expense, or savings'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={onAddTransaction}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Transaction</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}
            </div>
          ) : (
            filteredTransactions.map(transaction => (
              <div key={transaction.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="text-xl sm:text-2xl flex-shrink-0">{getCategoryIcon(transaction.category)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{transaction.description}</p>
                      <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className={`font-semibold text-sm sm:text-base ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : transaction.type === 'expense'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {showBalance ? `${transaction.type === 'income' ? '+' : '-'}£${(transaction.amount || 0).toLocaleString()}` : '••••••'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditTransaction(transaction)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(transaction)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default FinanceTransactionsTab
