import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  ArrowRight, 
  Code, 
  Activity, 
  MessageCircle, 
  FileText, 
  Droplets, 
  Clock, 
  TrendingUp, 
  Leaf,
  Target,
  DollarSign,
  Heart,
  Building,
  Briefcase,
  User,
  Newspaper,
  Rocket,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Lightbulb,
  BarChart3,
  PieChart,
  Target as TargetIcon,
  TrendingDown,
  Plus,
  Home
} from 'lucide-react'
import { CalendarEvent } from './Calendar'
import { format } from 'date-fns'
import BMLogo from './BMLogo'
import Loader from './Loader'
import EncouragingWords from './EncouragingWords'
import BibleVerse from './BibleVerse'

import { 
  getAgendaTasks, 
  getPlants, 
  getHealthHabits, 
  getDevRoadmapDailyLogs, 
  getDevRoadmapUserStats, 
  getCalendarEvents,
  getFinancialAnalytics,
  getBudgets,
  getSavingsGoals,
  getBills
} from '../lib/database'

interface DashboardStats {
  // Task & Productivity
  taskCompletion: number
  totalTasks: number
  completedTasks: number
  
  // Development
  devHours: number
  leetcodeSolved: number
  currentStreak: number
  
  // Health & Wellness
  gymStreak: number
  waterIntake: number
  waterTarget: number
  
  // Plant Care
  plantCareTasks: number
  plantsNeedWater: number
  totalPlants: number
  
  // Finance
  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  budgetAlerts: number
  
  // Goals & Progress
  activeGoals: number
  completedGoals: number
  goalProgress: number
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  href: string
  color: string
  priority: 'high' | 'medium' | 'low'
}

interface SmartSuggestion {
  id: string
  type: 'tip' | 'reminder' | 'achievement' | 'improvement'
  title: string
  description: string
  action?: string
  actionHref?: string
  priority: 'high' | 'medium' | 'low'
}

const EnhancedDashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])
  const [greeting, setGreeting] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    taskCompletion: 0,
    totalTasks: 0,
    completedTasks: 0,
    devHours: 0,
    leetcodeSolved: 0,
    currentStreak: 0,
    gymStreak: 0,
    waterIntake: 0,
    waterTarget: 8,
    plantCareTasks: 0,
    plantsNeedWater: 0,
    totalPlants: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
    budgetAlerts: 0,
    activeGoals: 0,
    completedGoals: 0,
    goalProgress: 0
  })

  // Quick Actions
  const quickActions: QuickAction[] = [
    {
      id: 'add-task',
      title: 'Add Task',
      description: 'Quickly add a new task to your agenda',
      icon: Plus,
      href: '/agenda',
      color: 'bg-blue-500 hover:bg-blue-600',
      priority: 'high'
    },
    {
      id: 'log-dev-time',
      title: 'Log Dev Time',
      description: 'Record your development work time',
      icon: Code,
      href: '/dev-roadmap',
      color: 'bg-green-500 hover:bg-green-600',
      priority: 'high'
    },
    {
      id: 'water-plant',
      title: 'Water Plants',
      description: 'Check and water your plants',
      icon: Leaf,
      href: '/plant-care',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      priority: 'medium'
    },
    {
      id: 'add-expense',
      title: 'Add Expense',
      description: 'Quickly log a financial transaction',
      icon: DollarSign,
      href: '/finance',
      color: 'bg-red-500 hover:bg-red-600',
      priority: 'medium'
    },
    {
      id: 'health-check',
      title: 'Health Check',
      description: 'Update your health habits',
      icon: Heart,
      href: '/health-habits',
      color: 'bg-pink-500 hover:bg-pink-600',
      priority: 'medium'
    },
    {
      id: 'add-note',
      title: 'Add Note',
      description: 'Quickly jot down a note',
      icon: FileText,
      href: '/notes',
      color: 'bg-purple-500 hover:bg-purple-600',
      priority: 'low'
    }
  ]

  // Smart Suggestions
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([])

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Update current time
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Load all dashboard data
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Load all data concurrently
        const [
          calendarEvents,
          agendaTasks,
          devStats,
          healthStats,
          plantStats,
          financeData,
          budgets,
          savingsGoals,
          bills
        ] = await Promise.all([
          getCalendarEvents(),
          getAgendaTasks(format(new Date(), 'yyyy-MM-dd')),
          getDevRoadmapUserStats(),
          getHealthHabits(),
          getPlants(),
          getFinancialAnalytics('month'),
          getBudgets(),
          getSavingsGoals(),
          getBills()
        ])

        // Process calendar events
        if (calendarEvents.length > 0) {
          const events = calendarEvents.map((event: any) => ({
            ...event,
            startDate: new Date(event.start_date),
            endDate: new Date(event.end_date)
          }))
          
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)

          const todaysEvents = events
            .filter((event: any) => {
              const eventStartDate = new Date(event.startDate)
              return eventStartDate >= today && eventStartDate < tomorrow
            })
            .sort((a: any, b: any) => a.startDate.getTime() - b.startDate.getTime())

          setUpcomingEvents(todaysEvents)
        }

        // Process agenda tasks
        if (agendaTasks.length > 0) {
          const completedTasks = agendaTasks.filter((task: any) => task.completed).length
          const totalTasks = agendaTasks.length
          const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          
          setStats(prev => ({
            ...prev,
            taskCompletion: percentage,
            totalTasks,
            completedTasks
          }))
        }

        // Process dev stats
        if (devStats) {
          setStats(prev => ({
            ...prev,
            devHours: devStats.totalHours || 0,
            leetcodeSolved: devStats.leetcodeSolved || 0,
            currentStreak: devStats.currentStreak || 0
          }))
        }

        // Process health stats
        if (healthStats && healthStats.length > 0) {
          const gymHabit = healthStats.find((h: any) => h.habit === 'gym')
          const waterHabit = healthStats.find((h: any) => h.habit === 'water')
          
          setStats(prev => ({
            ...prev,
            gymStreak: gymHabit?.streak || 0,
            waterIntake: waterHabit?.currentValue || 0,
            waterTarget: waterHabit?.targetValue || 8
          }))
        }

        // Process plant stats
        if (plantStats && plantStats.length > 0) {
          const needWater = plantStats.filter((plant: any) => {
            if (!plant.next_watering) return false
            const nextWatering = new Date(plant.next_watering)
            return nextWatering <= new Date()
          }).length

          setStats(prev => ({
            ...prev,
            plantCareTasks: plantStats.length,
            plantsNeedWater: needWater,
            totalPlants: plantStats.length
          }))
        }

        // Process finance data
        if (financeData) {
          setStats(prev => ({
            ...prev,
            monthlyIncome: financeData.income || 0,
            monthlyExpenses: financeData.expenses || 0,
            monthlySavings: financeData.savings || 0
          }))
        }

        // Process budgets and goals
        if (budgets && budgets.length > 0) {
          const alerts = budgets.filter((budget: any) => {
            if (!budget.limit || !budget.spent) return false
            return (budget.spent / budget.limit) > 0.8
          }).length

          setStats(prev => ({
            ...prev,
            budgetAlerts: alerts
          }))
        }

        if (savingsGoals && savingsGoals.length > 0) {
          const active = savingsGoals.filter((goal: any) => !goal.completed).length
          const completed = savingsGoals.filter((goal: any) => goal.completed).length
          const totalProgress = savingsGoals.reduce((sum: number, goal: any) => {
            if (goal.targetAmount && goal.currentAmount) {
              return sum + (goal.currentAmount / goal.targetAmount)
            }
            return sum
          }, 0)
          const avgProgress = savingsGoals.length > 0 ? (totalProgress / savingsGoals.length) * 100 : 0

          setStats(prev => ({
            ...prev,
            activeGoals: active,
            completedGoals: completed,
            goalProgress: Math.round(avgProgress)
          }))
        }

        // Generate smart suggestions
        generateSmartSuggestions()

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()

    return () => clearInterval(timer)
  }, [])

  const generateSmartSuggestions = () => {
    const suggestions: SmartSuggestion[] = []

    // Task completion suggestions
    if (stats.taskCompletion < 50) {
      suggestions.push({
        id: 'low-task-completion',
        type: 'improvement',
        title: 'Low Task Completion',
        description: `You've only completed ${stats.taskCompletion}% of today's tasks. Consider breaking down larger tasks or adjusting your schedule.`,
        action: 'Review Tasks',
        actionHref: '/agenda',
        priority: 'high'
      })
    } else if (stats.taskCompletion >= 80) {
      suggestions.push({
        id: 'high-task-completion',
        type: 'achievement',
        title: 'Great Progress!',
        description: `You've completed ${stats.taskCompletion}% of today's tasks. Keep up the excellent work!`,
        priority: 'medium'
      })
    }

    // Development streak suggestions
    if (stats.currentStreak > 0) {
      suggestions.push({
        id: 'dev-streak',
        type: 'achievement',
        title: 'Development Streak',
        description: `You're on a ${stats.currentStreak}-day development streak! Consistency is key to mastery.`,
        priority: 'medium'
      })
    }

    // Plant care reminders
    if (stats.plantsNeedWater > 0) {
      suggestions.push({
        id: 'plants-need-water',
        type: 'reminder',
        title: 'Plants Need Water',
        description: `${stats.plantsNeedWater} plant${stats.plantsNeedWater > 1 ? 's' : ''} need${stats.plantsNeedWater > 1 ? '' : 's'} watering.`,
        action: 'Water Plants',
        actionHref: '/plant-care',
        priority: 'high'
      })
    }

    // Budget alerts
    if (stats.budgetAlerts > 0) {
      suggestions.push({
        id: 'budget-alerts',
        type: 'reminder',
        title: 'Budget Alerts',
        description: `${stats.budgetAlerts} budget${stats.budgetAlerts > 1 ? 's' : ''} ${stats.budgetAlerts > 1 ? 'are' : 'is'} approaching the limit.`,
        action: 'Review Budgets',
        actionHref: '/finance',
        priority: 'medium'
      })
    }

    // Health suggestions
    if (stats.waterIntake < stats.waterTarget * 0.5) {
      suggestions.push({
        id: 'water-intake',
        type: 'tip',
        title: 'Stay Hydrated',
        description: `You've only had ${stats.waterIntake} glasses of water today. Aim for ${stats.waterTarget} glasses.`,
        action: 'Update Health',
        actionHref: '/health-habits',
        priority: 'medium'
      })
    }

    // Goal progress suggestions
    if (stats.goalProgress > 0 && stats.goalProgress < 50) {
      suggestions.push({
        id: 'goal-progress',
        type: 'improvement',
        title: 'Goal Progress',
        description: `Your savings goals are ${stats.goalProgress}% complete. Consider increasing your savings rate.`,
        action: 'Review Goals',
        actionHref: '/finance',
        priority: 'medium'
      })
    }

    setSmartSuggestions(suggestions.slice(0, 6)) // Show top 6 suggestions
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'medium': return <Star className="w-4 h-4 text-yellow-500" />
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-500" />
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Left side - Greeting and Time */}
            <div className="flex items-center space-x-6">
              <BMLogo />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {greeting}, Welcome Back!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  {format(currentTime, 'EEEE, MMMM do, yyyy')} • {format(currentTime, 'h:mm:ss a')}
                </p>
              </div>
            </div>
            
            {/* Right side - Encouraging Words and Bible Verse */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700/50">
                <EncouragingWords />
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/50">
                <BibleVerse />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                to={action.href}
                className={`${action.color} text-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105`}
              >
                <div className="text-center">
                  <action.icon className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-medium text-sm">{action.title}</h3>
                  <p className="text-xs opacity-90 mt-1">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Unified Stats Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Life Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Productivity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Productivity</h3>
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Task Completion</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.taskCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.taskCompletion}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.completedTasks} of {stats.totalTasks} tasks completed
                </div>
              </div>
            </div>

            {/* Development */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Development</h3>
                <Code className="w-6 h-6 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Hours</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{stats.devHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{stats.currentStreak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">LeetCode Solved</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{stats.leetcodeSolved}</span>
                </div>
              </div>
            </div>

            {/* Health & Wellness */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Health & Wellness</h3>
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gym Streak</span>
                  <span className="font-semibold text-pink-600 dark:text-pink-400">{stats.gymStreak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Water Intake</span>
                  <span className="font-semibold text-pink-600 dark:text-pink-400">{stats.waterIntake}/{stats.waterTarget}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.waterIntake / stats.waterTarget) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Finance & Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Finance & Goals</h3>
                <TargetIcon className="w-6 h-6 text-purple-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Balance</span>
                  <span className={`font-semibold ${stats.monthlyIncome - stats.monthlyExpenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    £{(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Goal Progress</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{stats.goalProgress}%</span>
                </div>
                {stats.budgetAlerts > 0 && (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    ⚠️ {stats.budgetAlerts} budget alert{stats.budgetAlerts > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            Smart Suggestions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-xl border-l-4 ${getPriorityColor(suggestion.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(suggestion.priority)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {suggestion.title}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {suggestion.description}
                </p>
                {suggestion.action && suggestion.actionHref && (
                  <Link
                    to={suggestion.actionHref}
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {suggestion.action}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
              Today's Events
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/calendar"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Rocket className="w-5 h-5 mr-2 text-purple-500" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Original Home', icon: Home, href: '/homepage', color: 'bg-slate-500' },
              { name: 'Life Goals', icon: Target, href: '/goals', color: 'bg-rose-500' },
              { name: 'Daily Agenda', icon: MessageCircle, href: '/agenda', color: 'bg-blue-500' },
              { name: 'Calendar', icon: Calendar, href: '/calendar', color: 'bg-indigo-500' },
              { name: 'Finance', icon: DollarSign, href: '/finance', color: 'bg-green-500' },
              { name: 'Dev Roadmap', icon: Code, href: '/dev-roadmap', color: 'bg-purple-500' },
              { name: 'Health Habits', icon: Heart, href: '/health-habits', color: 'bg-pink-500' },
              { name: 'Plant Care', icon: Leaf, href: '/plant-care', color: 'bg-emerald-500' },
              { name: 'Notes', icon: FileText, href: '/notes', color: 'bg-yellow-500' },
              { name: 'Company', icon: Building, href: '/company', color: 'bg-orange-500' },
              { name: 'Job Career', icon: Briefcase, href: '/job-career', color: 'bg-red-500' },
              { name: 'Portfolio', icon: User, href: '/portfolio', color: 'bg-teal-500' },
              { name: 'Accountability', icon: Newspaper, href: '/accountability', color: 'bg-gray-500' },
              { name: 'Mobile Widgets', icon: Smartphone, href: '/widgets', color: 'bg-violet-500' }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${item.color} hover:opacity-90 text-white p-4 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105`}
              >
                <div className="text-center">
                  <item.icon className="w-6 h-6 mx-auto mb-2" />
                  <h3 className="font-medium text-sm">{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedDashboard
