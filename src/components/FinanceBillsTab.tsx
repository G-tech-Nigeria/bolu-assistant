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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bills & Payments</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your bills and never miss a payment for {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onAddBill}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Bill
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredBills.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredBills.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {filteredBills.filter(b => b.status === 'overdue').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {showBalance ? `£${filteredBills.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}` : '••••••'}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
        {[
          { id: 'all', label: 'All', count: filteredBills.length },
          { id: 'pending', label: 'Pending', count: filteredBills.filter(b => b.status === 'pending').length },
          { id: 'overdue', label: 'Overdue', count: filteredBills.filter(b => b.status === 'overdue').length }
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

      {/* Bills List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bills ({filteredBills.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredBills.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No bills found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'all' 
                  ? 'Start by adding your first bill' 
                  : `No ${filter} bills found`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={onAddBill}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Bill
                </button>
              )}
            </div>
          ) : (
            filteredBills.map(bill => {
              const status = getBillStatus(bill)
              const daysUntilDue = Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              const StatusIcon = status.icon

              return (
                <div key={bill.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getCategoryIcon(bill.category)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{bill.name}</p>
                          {bill.isRecurring && (
                            <span className="text-sm">{getFrequencyIcon(bill.frequency)}</span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${status.bgColor} ${status.color}`}>
                            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                          </span>
                          <span className="truncate">{bill.category}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Due {new Date(bill.dueDate).toLocaleDateString()}</span>
                          {bill.status === 'pending' && daysUntilDue > 0 && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>{daysUntilDue} days left</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {showBalance ? `£${(bill.amount || 0).toLocaleString()}` : '••••••'}
                      </span>
                      <div className="flex items-center gap-1">
                        {bill.status === 'pending' && (
                          <button
                            onClick={() => onMarkAsPaid(bill)}
                            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            title="Mark as paid"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onEditBill(bill)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteBill(bill)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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
