import React, { useState, useEffect } from 'react'
import { 
  Target, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Circle, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  Award,
  Lightbulb,
  BarChart3,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react'
import { 
  addLifeGoal, 
  updateLifeGoal, 
  deleteLifeGoal, 
 
  getLifeGoals 
} from '../lib/database'

interface LifeGoal {
  id: string
  title: string
  description: string
  category: GoalCategory
  targetDate: string
  currentProgress: number
  targetValue: number
  unit: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'paused'
  milestones: Milestone[]
  createdAt: string
  updatedAt: string
}

interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  completed: boolean
  completedAt?: string
}

type GoalCategory = 
  | 'health' 
  | 'career' 
  | 'finance' 
  | 'learning' 
  | 'relationships' 
  | 'personal' 
  | 'spiritual' 
  | 'travel' 
  | 'business' 
  | 'other'

const GoalManagement = () => {
  const [goals, setGoals] = useState<LifeGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<LifeGoal | null>(null)
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'paused'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showBalance, setShowBalance] = useState(true)
  const [savingMilestones, setSavingMilestones] = useState<Set<string>>(new Set())

  // Form state
  const [goalForm, setGoalForm] = useState<Omit<LifeGoal, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    category: 'personal',
    targetDate: '',
    currentProgress: 0,
    targetValue: 1,
    unit: '%',
    priority: 'medium',
    status: 'active',
    milestones: []
  })

  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    targetDate: ''
  })

  // Category configurations
  const goalCategories: { value: GoalCategory; label: string; icon: string; color: string }[] = [
    { value: 'health', label: 'Health & Fitness', icon: '💪', color: 'bg-green-500' },
    { value: 'career', label: 'Career & Work', icon: '💼', color: 'bg-blue-500' },
    { value: 'finance', label: 'Finance & Money', icon: '💰', color: 'bg-yellow-500' },
    { value: 'learning', label: 'Learning & Skills', icon: '📚', color: 'bg-purple-500' },
    { value: 'relationships', label: 'Relationships', icon: '❤️', color: 'bg-pink-500' },
    { value: 'personal', label: 'Personal Growth', icon: '🌟', color: 'bg-indigo-500' },
    { value: 'spiritual', label: 'Spiritual & Faith', icon: '🙏', color: 'bg-gray-500' },
    { value: 'travel', label: 'Travel & Adventure', icon: '✈️', color: 'bg-cyan-500' },
    { value: 'business', label: 'Business & Entrepreneurship', icon: '🚀', color: 'bg-orange-500' },
    { value: 'other', label: 'Other', icon: '🎯', color: 'bg-gray-400' }
  ]

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    setIsLoading(true)
    try {
      const goals = await getLifeGoals()
      setGoals(goals)
    } catch (error) {
      console.error('Failed to load goals:', error)
    } finally {
      setIsLoading(false)
    }
  }



  const filteredGoals = goals.filter(goal => {
    const matchesCategory = filterCategory === 'all' || goal.category === filterCategory
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesStatus && matchesSearch
  })

  const getCategoryInfo = (category: GoalCategory) => {
    return goalCategories.find(cat => cat.value === category) || goalCategories[goalCategories.length - 1]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'bg-green-100 dark:bg-green-900/30'
      default: return 'bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400'
      case 'completed': return 'text-blue-600 dark:text-blue-400'
      case 'paused': return 'text-yellow-600 dark:text-yellow-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Circle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'paused': return <Clock className="w-4 h-4" />
      default: return <Circle className="w-4 h-4" />
    }
  }

  const calculateProgress = (goal: LifeGoal) => {
    const current = Number(goal.currentProgress) || 0
    const target = Number(goal.targetValue) || 1
    
    if (target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }

  const getDaysRemaining = (targetDate: string) => {
    if (!targetDate) return 0
    
    try {
      const target = new Date(targetDate)
      if (isNaN(target.getTime())) return 0
      
      const today = new Date()
      const diffTime = target.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch (error) {
      console.error('Error calculating days remaining:', error)
      return 0
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const handleAddGoal = async () => {
    // Validate required fields
    if (!goalForm.title.trim()) {
      console.error('Title is required')
      return // Form validation will show error
    }

    // Check if target date exists and is valid
    if (!goalForm.targetDate || goalForm.targetDate === '') {
      console.error('Target date is required')
      return // Form validation will show error
    }

    try {
      // Clean the form data before sending
      const cleanGoalForm = {
        ...goalForm,
        title: goalForm.title.trim(),
        description: goalForm.description.trim(),
        targetDate: goalForm.targetDate,
        currentProgress: goalForm.currentProgress || 0,
        targetValue: goalForm.targetValue || 1,
        unit: goalForm.unit || '%',
        milestones: goalForm.milestones.map((milestone, index) => ({
          ...milestone,
          id: `${Date.now()}-${index}`,
          title: milestone.title || '',
          description: milestone.description || '',
          targetDate: milestone.targetDate || goalForm.targetDate, // Use goal date as fallback
          completed: false
        }))
      }

      const newGoal: Omit<LifeGoal, 'id' | 'createdAt' | 'updatedAt'> = cleanGoalForm

      const addedGoal = await addLifeGoal(newGoal)
      
      if (addedGoal) {
        setGoals(prev => [addedGoal, ...prev])
        setShowAddModal(false)
        resetForm()
      } else {
        console.error('addLifeGoal returned null or undefined')
      }
    } catch (error) {
      console.error('Error adding goal:', error)
      // Show more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
    }
  }

  const handleUpdateGoal = async () => {
    if (!selectedGoal) return

    // Validate required fields
    if (!goalForm.title.trim()) {
      return // Form validation will show error
    }

    // Check if target date exists and is valid
    if (!goalForm.targetDate || goalForm.targetDate === '') {
      return // Form validation will show error
    }

    try {
      // Clean the form data before sending
      const cleanGoalForm = {
        ...goalForm,
        title: goalForm.title.trim(),
        description: goalForm.description.trim(),
        targetDate: goalForm.targetDate,
        currentProgress: goalForm.currentProgress || 0,
        targetValue: goalForm.targetValue || 1,
        unit: goalForm.unit || '%',
        milestones: goalForm.milestones.map(milestone => ({
          ...milestone,
          title: milestone.title || '',
          description: milestone.description || '',
          targetDate: milestone.targetDate || goalForm.targetDate, // Use goal date as fallback
          completed: milestone.completed || false
        }))
      }

      const updatedGoal = await updateLifeGoal(selectedGoal.id, cleanGoalForm)
      
      if (updatedGoal) {
        setGoals(prev => {
          const newGoals = prev.map(goal => 
            goal.id === selectedGoal.id ? updatedGoal : goal
          )
          return newGoals
        })
        setShowEditModal(false)
        setSelectedGoal(null)
        resetForm()
      } else {
        console.error('updateLifeGoal returned null or undefined')
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return

    try {
      await deleteLifeGoal(selectedGoal.id)
      setGoals(prev => prev.filter(goal => goal.id !== selectedGoal.id))
      setShowDeleteModal(false)
      setSelectedGoal(null)
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const handleEditGoal = (goal: LifeGoal) => {
    setSelectedGoal(goal)
    
    // Handle date formatting for the date input
    let formattedDate = ''
    
    if (goal.targetDate) {
      
      if (typeof goal.targetDate === 'string') {
        // If it's already in YYYY-MM-DD format, use it directly
        if (goal.targetDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          formattedDate = goal.targetDate
        } else {
          // Try to parse the date and format it
          try {
            const parsedDate = new Date(goal.targetDate)
            if (!isNaN(parsedDate.getTime())) {
              formattedDate = parsedDate.toISOString().split('T')[0]
            } else {
              // Try to extract just the date part
              const dateMatch = goal.targetDate.match(/(\d{4}-\d{2}-\d{2})/)
              if (dateMatch) {
                formattedDate = dateMatch[1]
              }
            }
          } catch (error) {
            console.error('Error parsing date:', error)
          }
        }
      }
    }
    
    // If we still don't have a formatted date, try to use the original as fallback
    if (!formattedDate && goal.targetDate) {
      formattedDate = goal.targetDate.toString()
    }
    
    setGoalForm({
      title: goal.title || '',
      description: goal.description || '',
      category: goal.category || 'personal',
      targetDate: formattedDate,
      currentProgress: goal.currentProgress || 0,
      targetValue: goal.targetValue || 1,
      unit: goal.unit || '%',
      priority: goal.priority || 'medium',
      status: goal.status || 'active',
      milestones: goal.milestones || []
    })
    setShowEditModal(true)
  }

  const handleDeleteClick = (goal: LifeGoal) => {
    setSelectedGoal(goal)
    setShowDeleteModal(true)
  }

  const handleMarkComplete = async (goal: LifeGoal) => {
    try {
      const updatedGoal = await updateLifeGoal(goal.id, {
        ...goal,
        status: 'completed',
        currentProgress: goal.targetValue // Set progress to 100%
      })
      
      // Update local state
      setGoals(prev => prev.map(g => g.id === goal.id ? updatedGoal : g))
    } catch (error) {
      console.error('Error marking goal as complete:', error)
    }
  }

  const handleToggleMilestone = async (goal: LifeGoal, milestoneIndex: number) => {
    const milestoneKey = `${goal.id}-${milestoneIndex}`
    
    try {
      // Set loading state
      setSavingMilestones(prev => new Set(prev).add(milestoneKey))
      
      const updatedMilestones = [...goal.milestones]
      const currentMilestone = updatedMilestones[milestoneIndex]
      const newCompletedState = !currentMilestone.completed
      
      updatedMilestones[milestoneIndex] = {
        ...currentMilestone,
        completed: newCompletedState,
        completedAt: newCompletedState ? new Date().toISOString() : null
      }
      
      // Create the update object with the correct field mapping
      const updateData = {
        title: goal.title,
        description: goal.description,
        category: goal.category,
        targetDate: goal.targetDate,
        currentProgress: goal.currentProgress,
        targetValue: goal.targetValue,
        unit: goal.unit,
        priority: goal.priority,
        status: goal.status,
        milestones: updatedMilestones
      }

      const updatedGoal = await updateLifeGoal(goal.id, updateData)
      
      if (updatedGoal) {
        // Update local state with the response from database
        setGoals(prev => prev.map(g => g.id === goal.id ? updatedGoal : g))
      } else {
        console.error('updateLifeGoal returned null or undefined')
      }
    } catch (error) {
      console.error('Error toggling milestone:', error)
      // Show more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      // Show error to user
      alert(`Failed to save milestone: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      // Clear loading state
      setSavingMilestones(prev => {
        const newSet = new Set(prev)
        newSet.delete(milestoneKey)
        return newSet
      })
    }
  }

  const handleQuickProgressUpdate = async (goal: LifeGoal, newProgress: number) => {
    try {
      // Optimistically update the UI first
      setGoals(prev => prev.map(g => 
        g.id === goal.id 
          ? { ...g, currentProgress: newProgress }
          : g
      ))

      // Then update the database
      const updateData = {
        title: goal.title,
        description: goal.description,
        category: goal.category,
        targetDate: goal.targetDate,
        currentProgress: newProgress,
        targetValue: goal.targetValue,
        unit: goal.unit,
        priority: goal.priority,
        status: goal.status,
        milestones: goal.milestones
      }

      const updatedGoal = await updateLifeGoal(goal.id, updateData)
      
      if (updatedGoal) {
        // Update with the actual response from database
        setGoals(prev => prev.map(g => g.id === goal.id ? updatedGoal : g))
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      // Revert the optimistic update on error
      setGoals(prev => prev.map(g => 
        g.id === goal.id 
          ? { ...g, currentProgress: goal.currentProgress }
          : g
      ))
    }
  }

  const addMilestone = () => {
    if (!milestoneForm.title.trim()) {
      return // Button is disabled, so this shouldn't happen
    }

    // Use goal's target date as fallback if milestone date is empty
    const milestoneDate = milestoneForm.targetDate || goalForm.targetDate
    
    const newMilestone: Milestone = {
      id: `${Date.now()}`,
      title: milestoneForm.title.trim(),
      description: milestoneForm.description.trim(),
      targetDate: milestoneDate,
      completed: false
    }

    setGoalForm(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }))

    // Clear the form
    setMilestoneForm({ title: '', description: '', targetDate: '' })
  }

  const removeMilestone = (index: number) => {
    setGoalForm(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  const resetForm = () => {
    setGoalForm({
      title: '',
      description: '',
      category: 'personal',
      targetDate: '',
      currentProgress: 0,
      targetValue: 1,
      unit: '%',
      priority: 'medium',
      status: 'active',
      milestones: []
    })
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Life Goals & Vision
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Set, track, and achieve your most important life goals
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showBalance ? 'Hide' : 'Show'} Details
              </button>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Goal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Goals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Goals</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {goals.filter(g => g.status === 'active').length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {goals.filter(g => g.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Progress</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {goals.length > 0 
                      ? Math.round(goals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / goals.length)
                      : 0}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search goals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as GoalCategory | 'all')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {goalCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed' | 'paused')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => {
            const categoryInfo = getCategoryInfo(goal.category)
            const progress = calculateProgress(goal)
            const daysRemaining = getDaysRemaining(goal.targetDate)
            const isOverdue = daysRemaining < 0

            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Goal Header - Compact */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 ${categoryInfo.color} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
                        {categoryInfo.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                          {goal.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {categoryInfo.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBgColor(goal.priority)} ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </span>
                      <div className={`flex items-center space-x-1 ${getStatusColor(goal.status)}`}>
                        {getStatusIcon(goal.status)}
                      </div>
                    </div>
                  </div>

                  {/* Description - Truncated */}
                  {goal.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress Section - Enhanced */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {showBalance ? `${goal.currentProgress || 0} / ${goal.targetValue || 1} ${goal.unit || '%'}` : '••••••'}
                      </span>
                    </div>
                    
                    {/* Circular Progress Ring */}
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200 dark:text-gray-700"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`${getProgressColor(progress)} transition-all duration-300`}
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${progress}, 100`}
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {isNaN(progress) ? '0' : Math.round(progress)}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Quick Progress Update */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max={goal.targetValue || 100}
                            value={goal.currentProgress || 0}
                            onChange={(e) => handleQuickProgressUpdate(goal, parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            / {goal.targetValue || 1} {goal.unit || '%'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {isOverdue 
                            ? `${Math.abs(daysRemaining)} days overdue`
                            : `${daysRemaining} days left`
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Target Date - Compact */}
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>Target: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No date'}</span>
                  </div>
                </div>

                {/* Milestones - Enhanced Display */}
                {goal.milestones.length > 0 && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Milestones</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {goal.milestones.map((milestone, index) => {
                        const milestoneKey = `${goal.id}-${index}`
                        const isSaving = savingMilestones.has(milestoneKey)
                        
                        return (
                          <div key={milestone.id} className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleMilestone(goal, index)}
                              disabled={isSaving}
                              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-0"
                            >
                              {isSaving ? (
                                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                              ) : milestone.completed ? (
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                              ) : (
                                <Circle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              )}
                              <span className={`text-xs truncate ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                {milestone.title}
                              </span>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Actions - Compact */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(goal)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {goal.status === 'active' && (
                        <button 
                          onClick={() => handleMarkComplete(goal)}
                          className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {goal.status === 'completed' && (
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs font-medium">Done!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No goals found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Start by adding your first life goal'
              }
            </p>
            {!searchQuery && filterCategory === 'all' && filterStatus === 'all' && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Your First Goal
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Goal Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {showAddModal ? 'Add New Goal' : 'Edit Goal'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your goal title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={goalForm.description}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe your goal in detail"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={goalForm.category}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, category: e.target.value as GoalCategory }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {goalCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={goalForm.priority}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Date *
                    </label>
                    <input
                      type="date"
                      value={goalForm.targetDate || ''}
                      onChange={(e) => {
                        setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                    {!goalForm.targetDate && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Please select a target date
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="flex items-center space-x-2">
                      <select
                        value={goalForm.status}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, status: e.target.value as 'active' | 'completed' | 'paused' }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                      </select>
                      
                      {goalForm.status === 'completed' && (
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Achieved!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Progress
                    </label>
                    <input
                      type="number"
                      value={goalForm.currentProgress}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, currentProgress: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Value
                    </label>
                    <input
                      type="number"
                      value={goalForm.targetValue}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={goalForm.unit}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="%, £, km, etc."
                    />
                  </div>
                </div>

                                 {/* Milestones */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Milestones
                   </label>
                   
                   {/* Add New Milestone Input */}
                   <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                     <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Milestone</h4>
                     <div className="space-y-3">
                       <input
                         type="text"
                         value={milestoneForm.title}
                         onChange={(e) => setMilestoneForm(prev => ({ ...prev, title: e.target.value }))}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                         placeholder="Milestone title (e.g., Complete first module)"
                       />
                       <textarea
                         value={milestoneForm.description}
                         onChange={(e) => setMilestoneForm(prev => ({ ...prev, description: e.target.value }))}
                         rows={2}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                         placeholder="Description (optional)"
                       />
                       <div className="flex items-center space-x-3">
                         <input
                           type="date"
                           value={milestoneForm.targetDate}
                           onChange={(e) => setMilestoneForm(prev => ({ ...prev, targetDate: e.target.value }))}
                           className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                           placeholder="Target date"
                         />
                         <button
                           onClick={addMilestone}
                           disabled={!milestoneForm.title.trim()}
                           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                         >
                           Add Milestone
                         </button>
                       </div>
                       {!milestoneForm.title.trim() && (
                         <p className="text-sm text-gray-500 dark:text-gray-400">
                           Enter a milestone title to add it
                         </p>
                       )}
                     </div>
                   </div>
                   
                                        {/* Existing Milestones */}
                     <div className="space-y-3">
                       {goalForm.milestones.length > 0 ? (
                         goalForm.milestones.map((milestone, index) => (
                           <div key={index} className={`flex items-center space-x-2 p-3 rounded-lg border ${
                             milestone.completed 
                               ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                               : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                           }`}>
                             {/* Completion Checkbox */}
                             <input
                               type="checkbox"
                               checked={milestone.completed || false}
                               onChange={(e) => {
                                 const newMilestones = [...goalForm.milestones]
                                 newMilestones[index] = {
                                   ...newMilestones[index],
                                   completed: e.target.checked,
                                   completedAt: e.target.checked ? new Date().toISOString() : null
                                 }
                                 setGoalForm(prev => ({ ...prev, milestones: newMilestones }))
                               }}
                               className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                             />
                             
                             <div className="flex-1">
                               <input
                                 type="text"
                                 value={milestone.title || ''}
                                 onChange={(e) => {
                                   const newMilestones = [...goalForm.milestones]
                                   newMilestones[index].title = e.target.value
                                   setGoalForm(prev => ({ ...prev, milestones: newMilestones }))
                                 }}
                                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                   milestone.completed 
                                     ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 line-through text-gray-500' 
                                     : 'border-gray-300 dark:border-gray-600'
                                 }`}
                                 placeholder="Milestone title"
                               />
                             </div>
                             
                             <input
                               type="date"
                               value={milestone.targetDate || goalForm.targetDate || ''}
                               onChange={(e) => {
                                 const newMilestones = [...goalForm.milestones]
                                 newMilestones[index].targetDate = e.target.value || goalForm.targetDate
                                 setGoalForm(prev => ({ ...prev, milestones: newMilestones }))
                               }}
                               className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                                 milestone.completed 
                                   ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
                                   : 'border-gray-300 dark:border-gray-600'
                               }`}
                             />
                             
                             <button
                               onClick={() => removeMilestone(index)}
                               className="px-2 py-2 text-red-600 hover:text-red-800 transition-colors"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                           No milestones added yet. Add your first milestone above.
                         </div>
                       )}
                     </div>
                 </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showAddModal ? handleAddGoal : handleUpdateGoal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {showAddModal ? 'Add Goal' : 'Update Goal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Goal
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{selectedGoal?.title}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGoal}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalManagement
