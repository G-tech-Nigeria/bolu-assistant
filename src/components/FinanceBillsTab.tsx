import React, { useState } from 'react'
import { Plus, Edit3, Trash2, Calendar, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react'

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

interface FinanceBillsTabProps {
  bills: Bill[]
  transactions: any[]
  selectedMonth: { month: number; year: number }
  onAddBill: () => void
  onEditBill: (bill: Bill) => void
  onDeleteBill: (bill: Bill) => void
  onMarkAsPaid: (bill: Bill) => void
  showBalance: boolean
}

const FinanceBillsTab: React.FC<FinanceBillsTabProps> = ({
  bills,
  transactions,
  selectedMonth,
  onAddBill,
  onEditBill,
  onDeleteBill,
  onMarkAsPaid,
  showBalance
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue'>('all')

  // Filter bills based on status, selected month, and exclude paid bills
  const filteredBills = bills.filter(bill => {
    // Filter out paid bills (they should not appear in the list)
    if (bill.status === 'paid') return false
    
    // Filter by selected month (due date)
    if (bill.dueDate) {
      const dueDate = new Date(bill.dueDate)
      const isSelectedMonth = dueDate.getMonth() === selectedMonth.month && 
                             dueDate.getFullYear() === selectedMonth.year
      if (!isSelectedMonth) return false
    }
    
    // Filter by status
    if (filter === 'all') return true
    return bill.status === filter
  })

  // Calculate upcoming bills for selected month
  const upcomingBills = bills
    .filter(bill => {
      if (bill.status !== 'pending') return false
      
      // Filter by selected month
      if (bill.dueDate) {
        const dueDate = new Date(bill.dueDate)
        const isSelectedMonth = dueDate.getMonth() === selectedMonth.month && 
                               dueDate.getFullYear() === selectedMonth.year
        if (!isSelectedMonth) return false
      }
      
      return true
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const getBillStatus = (bill: Bill) => {
    const today = new Date()
    const dueDate = new Date(bill.dueDate)
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (bill.status === 'paid') return { status: 'paid', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle }
    if (bill.status === 'overdue') return { status: 'overdue', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: AlertTriangle }
    if (daysUntilDue <= 0) return { status: 'overdue', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: AlertTriangle }
    if (daysUntilDue <= 7) return { status: 'urgent', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertTriangle }
    return { status: 'pending', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: Clock }
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Housing': '🏠',
      'Utilities': '⚡',
      'Insurance': '🛡️',
      'Health': '🏥',
      'Transport': '🚗',
      'Entertainment': '🎬',
      'Education': '📚',
      'Other': '📄'
    }
    return icons[category] || '📄'
  }

  const getFrequencyIcon = (frequency: string) => {
    const icons: { [key: string]: string } = {
      'monthly': '📅',
      'quarterly': '📊',
      'yearly': '📈',
      'once': '🎯'
    }
    return icons[frequency] || '📄'
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Bills</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your bills for {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onAddBill}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Bill</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Bills</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{filteredBills.length}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {showBalance ? `£${filteredBills.reduce((sum, bill) => sum + (bill.amount || 0), 0).toLocaleString()}` : '••••••'}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">
                {filteredBills.filter(bill => bill.status === 'overdue').length}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
        {[
          { id: 'all', label: 'All Bills', count: filteredBills.length },
          { id: 'pending', label: 'Pending', count: filteredBills.filter(bill => bill.status === 'pending').length },
          { id: 'overdue', label: 'Overdue', count: filteredBills.filter(bill => bill.status === 'overdue').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              filter === tab.id
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span>{tab.label}</span>
            <span className="bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bills List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Bills ({filteredBills.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredBills.length === 0 ? (
            <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? 'No bills for this month' : `No ${filter} bills`}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'all' 
                  ? 'Add your first bill to start tracking payments' 
                  : `All bills are ${filter === 'pending' ? 'paid or overdue' : 'paid or pending'}`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={onAddBill}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Bill</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}
            </div>
          ) : (
            filteredBills.map(bill => {
              const status = getBillStatus(bill)
              const Icon = status.icon
              
              return (
                <div key={bill.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="text-xl sm:text-2xl flex-shrink-0">{getCategoryIcon(bill.category)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{bill.name}</p>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor}`}>
                            <span className={status.color}>{status.status}</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <span className="truncate">{bill.category}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Due {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'No date'}</span>
                          {bill.isRecurring && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="capitalize">{bill.frequency}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {showBalance ? `£${(bill.amount || 0).toLocaleString()}` : '••••••'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Icon className="w-3 h-3" />
                          <span>{status.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {bill.status === 'pending' && (
                          <button
                            onClick={() => onMarkAsPaid(bill)}
                            className="p-1 text-green-600 hover:text-green-800 dark:hover:text-green-400 transition-colors"
                            title="Mark as paid"
                          >
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onEditBill(bill)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteBill(bill)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default FinanceBillsTab
