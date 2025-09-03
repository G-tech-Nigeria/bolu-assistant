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
  Circle,
  CheckCircle2,
  BookOpen,
  Dumbbell,
  Sun,
  Moon,
  CalendarDays,
  Brain,
  Dumbbell as DumbbellIcon,
  BookOpen as BookOpenIcon,
  Briefcase as BriefcaseIcon,
  Building as BuildingIcon,
  ShoppingCart
} from 'lucide-react'
import { format } from 'date-fns'
import Loader from './Loader'
import FocusTimer from './FocusTimer'

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
  getBills,
  getFitnessGoals,
  getWeeklyGoalProgress,
  getRunStats,
  getUpcomingBirthdays,
  getJobApplications
} from '../lib/database'

import { 
  getAccountabilityTasks,
  getAccountabilityUsers,
  getAccountabilityPenalties
} from '../lib/accountability'
import { supabase } from '../lib/supabase'

interface DashboardStats {
  // Daily Agenda Stats
  totalTasks: number
  completedTasks: number
  taskCompletion: number
  currentTask: any
  nextTasks: any[]
  
  // Dev Roadmap Stats
  devHours: number
  currentStreak: number
  leetcodeSolved: number
  achievementProgress: number
  nextMilestone: any
  
  // Finance Stats
  monthlyIncome: number
  monthlyExpenses: number
  budgetAlerts: number
  upcomingBills: number
  savingsProgress: number
  
  // Plant Care Stats
  totalPlants: number
  plantsNeedWater: number
  plantsNeedRepot: number
  nextWatering: any[]
  
  // Health Habits Stats
  gymStreak: number
  waterIntake: number
  waterTarget: number
  sleepHours: number
  sleepTarget: number
  weeklyGoals: number
  weeklyGoalsCompleted: number
  
  // Notes Stats
  totalNotes: number
  recentNotes: any[]
  noteCategories: any[]
  
  // Goals Stats
  activeGoals: number
  goalProgress: number
  upcomingDeadlines: any[]
  
  // Company Stats
  businessRevenue: number
  businessExpenses: number
  activeProjects: number
  
  // Job Career Stats
  applicationsSubmitted: number
  interviewsScheduled: number
  skillsProgress: number
  
  // Calendar Stats
  todaysEvents: number
  upcomingEvents: number
  eventCategories: number
  
  // Birthday Stats
  totalBirthdays: number
  upcomingBirthdays: number
  nextBirthday: any
  
  // Job Career Stats
  totalApplications: number
  activeApplications: number
  offersReceived: number
  
  // Accountability Stats
  totalAccountabilityTasks: number
  completedAccountabilityTasks: number
  accountabilityCompletionRate: number
  activeAccountabilityUsers: number
  totalPenalties: number
  
  // Shopping List Stats
  totalShoppingItems: number
  completedShoppingItems: number
  shoppingCompletionRate: number
  highPriorityItems: number
  shoppingCategories: number
  shoppingItems: any[]
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    taskCompletion: 0,
    currentTask: null,
    nextTasks: [],
    devHours: 0,
    currentStreak: 0,
    leetcodeSolved: 0,
    achievementProgress: 0,
    nextMilestone: null,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    budgetAlerts: 0,
    upcomingBills: 0,
    savingsProgress: 0,
    totalPlants: 0,
    plantsNeedWater: 0,
    plantsNeedRepot: 0,
    nextWatering: [],
    gymStreak: 0,
    waterIntake: 0,
    waterTarget: 8,
    sleepHours: 0,
    sleepTarget: 8,
    weeklyGoals: 0,
    weeklyGoalsCompleted: 0,
    totalNotes: 0,
    recentNotes: [],
    noteCategories: [],
    activeGoals: 0,
    goalProgress: 0,
    upcomingDeadlines: [],
    businessRevenue: 0,
    businessExpenses: 0,
    activeProjects: 0,
    applicationsSubmitted: 0,
    interviewsScheduled: 0,
    skillsProgress: 0,
    todaysEvents: 0,
    upcomingEvents: 0,
    eventCategories: 0,
    totalBirthdays: 0,
    upcomingBirthdays: 0,
    nextBirthday: null,
    totalApplications: 0,
    activeApplications: 0,
    offersReceived: 0,
    totalAccountabilityTasks: 0,
    completedAccountabilityTasks: 0,
    accountabilityCompletionRate: 0,
    activeAccountabilityUsers: 0,
    totalPenalties: 0,
    totalShoppingItems: 0,
    completedShoppingItems: 0,
    shoppingCompletionRate: 0,
    highPriorityItems: 0,
    shoppingCategories: 0,
    shoppingItems: []
  })
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Update document title
    document.title = '🏠 Home - Bolu Assistant'
    
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setIsLoading(true)
      // Load data from all major components
      await Promise.all([
        loadAgendaData(),
        loadDevRoadmapData(),
        loadFinanceData(),
        loadPlantCareData(),
        loadHealthHabitsData(),
        loadCalendarData(),
        loadBirthdayData(),
        loadAccountabilityData(),
        loadShoppingListData(),
        loadNotesData(),
        loadGoalsData(),
        loadCompanyData(),
        loadJobCareerData()
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAgendaData = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const tasks = await getAgendaTasks(today)
      
      // If no tasks for today, try to get tasks from the last few days
      let allTasks = tasks
      if (tasks.length === 0) {
        const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
        const dayBeforeYesterday = format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
        
        const [yesterdayTasks, dayBeforeTasks] = await Promise.all([
          getAgendaTasks(yesterday),
          getAgendaTasks(dayBeforeYesterday)
        ])
        
        allTasks = [...yesterdayTasks, ...dayBeforeTasks]
      }
      
      const completed = allTasks.filter(task => task.completed)
      const currentTask = allTasks.find(task => !task.completed)
      const nextTasks = allTasks.filter(task => !task.completed).slice(0, 3)
      
      setStats(prev => ({
        ...prev,
        totalTasks: allTasks.length,
        completedTasks: completed.length,
        taskCompletion: allTasks.length > 0 ? Math.round((completed.length / allTasks.length) * 100) : 0,
        currentTask,
        nextTasks
      }))
    } catch (error) {
      console.error('Error loading agenda data:', error)
    }
  }

  const loadDevRoadmapData = async () => {
    try {
      const userStats = await getDevRoadmapUserStats()
      const dailyLogs = await getDevRoadmapDailyLogs()
      
      // Calculate LeetCode count directly from daily logs
      const totalLeetCode = dailyLogs.reduce((sum, log) => sum + (log.leetcode_problems || 0), 0)
      
      // Calculate total hours from daily logs as fallback
      const totalHours = dailyLogs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)
      
      setStats(prev => ({
        ...prev,
        devHours: userStats?.total_hours || totalHours || 0,
        currentStreak: userStats?.current_streak || 0,
        leetcodeSolved: totalLeetCode, // Use calculated value instead of userStats
        achievementProgress: userStats?.total_achievements_unlocked || 0
      }))
    } catch (error) {
      console.error('Error loading dev roadmap data:', error)
    }
  }

  const loadFinanceData = async () => {
    try {
      const analytics = await getFinancialAnalytics()
      const budgets = await getBudgets()
      const bills = await getBills()
      const savingsGoals = await getSavingsGoals()
      
      // Calculate budget alerts (budgets that are 80% or more spent)
      const budgetAlerts = budgets.filter(budget => {
        if (!budget.limit || budget.limit <= 0) return false
        return (budget.spent / budget.limit) > 0.8
      }).length
      
      // Calculate upcoming bills (due in next 7 days)
      const upcomingBills = bills.filter(bill => {
        if (!bill.dueDate) return false
        const dueDate = new Date(bill.dueDate)
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        return dueDate <= nextWeek
      }).length
      
      // Calculate savings progress
      let savingsProgress = 0
      if (savingsGoals.length > 0) {
        const totalProgress = savingsGoals.reduce((sum, goal) => {
          if (!goal.targetAmount || goal.targetAmount <= 0) return sum
          return sum + (goal.currentAmount / goal.targetAmount)
        }, 0)
        savingsProgress = Math.round((totalProgress / savingsGoals.length) * 100)
      }
      
      setStats(prev => ({
        ...prev,
        monthlyIncome: analytics.income || 0,
        monthlyExpenses: analytics.expenses || 0,
        budgetAlerts: budgetAlerts,
        upcomingBills: upcomingBills,
        savingsProgress: savingsProgress
      }))
    } catch (error) {
      console.error('Error loading finance data:', error)
    }
  }

  const loadPlantCareData = async () => {
    try {
      const plants = await getPlants()
      
      // Calculate plants needing water based on next_watering date
      const needWater = plants.filter(plant => {
        if (!plant.next_watering) return false
        const nextWatering = new Date(plant.next_watering)
        return nextWatering <= new Date() // Plant needs water if next watering date is today or in the past
      })
      
      setStats(prev => ({
        ...prev,
        totalPlants: plants.length,
        plantsNeedWater: needWater.length
      }))
    } catch (error) {
      console.error('Error loading plant care data:', error)
    }
  }

  const loadHealthHabitsData = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const gymHabits = await getHealthHabits('gym')
      const waterHabits = await getHealthHabits('water', today)
      const sleepHabits = await getHealthHabits('sleep', today)
      const weeklyGoals = await getWeeklyGoalProgress()
      
      // Calculate gym streak using the same logic as EnhancedDashboard
      let gymStreak = 0
      if (gymHabits && gymHabits.length > 0 && Array.isArray(gymHabits[0]?.data)) {
        const gymData = gymHabits[0].data
        
        // Calculate gym streak using the same logic as HealthHabits component
        const sortedGymDays = [...gymData].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        // Find the most recent completed day
        const mostRecentCompleted = sortedGymDays.find((day: any) => day.completed)
        
        if (mostRecentCompleted) {
          // Start from the most recent completed day and go backwards
          const startDate = new Date(mostRecentCompleted.date)
          
          // Check consecutive days backwards from the most recent completed day
          for (let i = 0; i < 30; i++) { // Check up to 30 days back
            const checkDate = new Date(startDate)
            checkDate.setDate(startDate.getDate() - i)
            const dateString = checkDate.toISOString().split('T')[0]
            
            const dayEntry = sortedGymDays.find((day: any) => day.date === dateString)
            
            if (dayEntry && dayEntry.completed) {
              gymStreak++
            } else {
              // Either no entry or not completed - streak broken
              break
            }
          }
        }
      }
      
      // Calculate water intake from today's data
      let waterIntake = 0
      let waterTarget = 8
      if (waterHabits && waterHabits.length > 0 && Array.isArray(waterHabits[0]?.data)) {
        const todayWater = waterHabits[0].data.find((entry: any) => entry.date === today)
        if (todayWater) {
          waterIntake = todayWater.scheduledIntakes
            ?.filter((intake: any) => intake.completed)
            ?.reduce((total: number, intake: any) => total + intake.glasses, 0) || 0
          waterTarget = todayWater.target || 8
        }
      }
      
      // Calculate sleep statistics
      let sleepHours = 0
      let sleepTarget = 8
      if (sleepHabits && sleepHabits.length > 0 && Array.isArray(sleepHabits[0]?.data)) {
        const todaySleep = sleepHabits[0].data.find((entry: any) => entry.date === today)
        if (todaySleep) {
          sleepHours = todaySleep.hours || 0
          sleepTarget = todaySleep.target || 8
        }
      }
      
      // Calculate weekly goals progress
      let weeklyGoalsCount = 0
      let weeklyGoalsCompleted = 0
      if (weeklyGoals) {
        // getWeeklyGoalProgress returns an object with runs, distance, calories
        weeklyGoalsCount = 3 // Fixed number of goal categories
        const runsCompleted = weeklyGoals.runs?.current >= weeklyGoals.runs?.target ? 1 : 0
        const distanceCompleted = weeklyGoals.distance?.current >= weeklyGoals.distance?.target ? 1 : 0
        const caloriesCompleted = weeklyGoals.calories?.current >= weeklyGoals.calories?.target ? 1 : 0
        weeklyGoalsCompleted = runsCompleted + distanceCompleted + caloriesCompleted
      }
      
      setStats(prev => ({
        ...prev,
        gymStreak: gymStreak,
        waterIntake: waterIntake,
        waterTarget: waterTarget,
        sleepHours: sleepHours,
        sleepTarget: sleepTarget,
        weeklyGoals: weeklyGoalsCount,
        weeklyGoalsCompleted: weeklyGoalsCompleted
      }))
    } catch (error) {
      console.error('Error loading health habits data:', error)
    }
  }

  const loadNotesData = async () => {
    // Placeholder for notes data
    setStats(prev => ({
      ...prev,
      totalNotes: 0,
      recentNotes: [],
      noteCategories: []
    }))
  }

  const loadGoalsData = async () => {
    // Placeholder for goals data
    setStats(prev => ({
      ...prev,
      activeGoals: 0,
      goalProgress: 0,
      upcomingDeadlines: []
    }))
  }

  const loadCompanyData = async () => {
    // Placeholder for company data
    setStats(prev => ({
      ...prev,
      businessRevenue: 0,
      businessExpenses: 0,
      activeProjects: 0
    }))
  }

  const loadJobCareerData = async () => {
    try {
      const applications = await getJobApplications()
      
      if (applications && applications.length > 0) {
        const totalApplications = applications.length
        
        // Count applications by status
        const activeApplications = applications.filter((app: any) => 
          ['applied', 'screening', 'interview'].includes(app.application_status)
        ).length
        
        const interviewsScheduled = applications.filter((app: any) => 
          app.application_status === 'interview'
        ).length
        
        const offersReceived = applications.filter((app: any) => 
          app.application_status === 'offer'
        ).length

        setStats(prev => ({
          ...prev,
          totalApplications,
          activeApplications,
          interviewsScheduled,
          offersReceived
        }))
      } else {
        setStats(prev => ({
          ...prev,
          totalApplications: 0,
          activeApplications: 0,
          interviewsScheduled: 0,
          offersReceived: 0
        }))
      }
    } catch (error) {
      console.error('Error loading job career data:', error)
    }
  }

  const loadCalendarData = async () => {
    try {
      const events = await getCalendarEvents()
      
      if (events && events.length > 0) {
        const processedEvents = events.map((event: any) => ({
          ...event,
          startDate: new Date(event.start_date),
          endDate: new Date(event.end_date)
        }))
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)

        // Count today's events
        const todaysEvents = processedEvents.filter((event: any) => {
          const eventStartDate = new Date(event.startDate)
          return eventStartDate >= today && eventStartDate < tomorrow
        }).length

        // Count upcoming events (next 7 days)
        const upcomingEvents = processedEvents.filter((event: any) => {
          const eventStartDate = new Date(event.startDate)
          return eventStartDate >= today && eventStartDate < nextWeek
        }).length

        // Count unique event categories
        const categories = new Set(events.map((event: any) => event.category).filter(Boolean))
        const eventCategories = categories.size

        setStats(prev => ({
          ...prev,
          todaysEvents,
          upcomingEvents,
          eventCategories
        }))
      } else {
        setStats(prev => ({
          ...prev,
          todaysEvents: 0,
          upcomingEvents: 0,
          eventCategories: 0
        }))
      }
    } catch (error) {
      console.error('Error loading calendar data:', error)
    }
  }

  const loadBirthdayData = async () => {
    try {
      const upcomingBirthdays = await getUpcomingBirthdays(7) // Get birthdays for next 7 days
      const allBirthdays = await getUpcomingBirthdays(365) // Get all birthdays for the year
      
      if (allBirthdays && allBirthdays.length > 0) {
        const totalBirthdays = allBirthdays.length
        const upcomingCount = upcomingBirthdays.length
        
        // Find the next birthday (closest upcoming)
        let nextBirthday = null
        if (upcomingBirthdays.length > 0) {
          const today = new Date()
          const nextBirthdayData = upcomingBirthdays[0] // First one is closest
          
          // Calculate days until next birthday
          const birthdayDate = new Date(nextBirthdayData.date)
          const nextBirthdayDate = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate())
          
          // If birthday has passed this year, check next year
          if (nextBirthdayDate < today) {
            nextBirthdayDate.setFullYear(today.getFullYear() + 1)
          }
          
          const daysUntil = Math.ceil((nextBirthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          nextBirthday = {
            name: nextBirthdayData.name,
            daysUntil: daysUntil
          }
        }

        setStats(prev => ({
          ...prev,
          totalBirthdays,
          upcomingBirthdays: upcomingCount,
          nextBirthday
        }))
      } else {
        setStats(prev => ({
          ...prev,
          totalBirthdays: 0,
          upcomingBirthdays: 0,
          nextBirthday: null
        }))
      }
    } catch (error) {
      console.error('Error loading birthday data:', error)
    }
  }

  const loadAccountabilityData = async () => {
    try {
      const tasks = await getAccountabilityTasks()
      
      if (tasks && tasks.length > 0) {
        // Get today's date in YYYY-MM-DD format
        const today = format(new Date(), 'yyyy-MM-dd')
        
        // Filter tasks for specific user ID and today's date
        const userTasks = tasks.filter((task: any) => 
          task.user_id === '1755134799016-yxao4n164' && 
          task.date === today
        )
        
        const totalAccountabilityTasks = userTasks.length
        const completedAccountabilityTasks = userTasks.filter((task: any) => task.status === 'completed').length
        const accountabilityCompletionRate = totalAccountabilityTasks > 0 
          ? Math.round((completedAccountabilityTasks / totalAccountabilityTasks) * 100) 
          : 0

        setStats(prev => ({
          ...prev,
          totalAccountabilityTasks,
          completedAccountabilityTasks,
          accountabilityCompletionRate,
          activeAccountabilityUsers: 1, // Just this user
          totalPenalties: 0 // Not tracking penalties for now
        }))
      } else {
        setStats(prev => ({
          ...prev,
          totalAccountabilityTasks: 0,
          completedAccountabilityTasks: 0,
          accountabilityCompletionRate: 0,
          activeAccountabilityUsers: 1, // Just this user
          totalPenalties: 0
        }))
      }
    } catch (error) {
      console.error('Error loading accountability data:', error)
    }
  }

  const loadShoppingListData = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const shoppingData = await getHealthHabits('shopping', today)
      
      if (shoppingData && shoppingData.length > 0 && shoppingData[0].data) {
        const shoppingList = shoppingData[0].data
        
        const totalShoppingItems = shoppingList.length
        const completedShoppingItems = shoppingList.filter((item: any) => item.completed).length
        const shoppingCompletionRate = totalShoppingItems > 0 
          ? Math.round((completedShoppingItems / totalShoppingItems) * 100) 
          : 0
        
        const highPriorityItems = shoppingList.filter((item: any) => item.priority === 'high').length
        
        // Count unique categories
        const categories = new Set(shoppingList.map((item: any) => item.category).filter(Boolean))
        const shoppingCategories = categories.size

        setStats(prev => ({
          ...prev,
          totalShoppingItems,
          completedShoppingItems,
          shoppingCompletionRate,
          highPriorityItems,
          shoppingCategories,
          shoppingItems: shoppingList
        }))
      } else {
        setStats(prev => ({
          ...prev,
          totalShoppingItems: 0,
          completedShoppingItems: 0,
          shoppingCompletionRate: 0,
          highPriorityItems: 0,
          shoppingCategories: 0,
          shoppingItems: []
        }))
      }
    } catch (error) {
      console.error('Error loading shopping list data:', error)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden w-full">


      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 w-full">
        
        {/* Page Header with Dashboard Link */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🏠 Home Dashboard</h1>
          <Link 
            to="/dashboard" 
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:scale-105"
          >
            📊 View Full Dashboard
          </Link>
        </div>
        
        {/* Daily Agenda Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              📅 Daily Agenda Overview
            </h2>
            <div className="flex space-x-2">
              <Link 
                to="/agenda" 
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Full Agenda
              </Link>
              <Link 
                to="/agenda?add=true" 
                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                + Add Task
              </Link>
            </div>
          </div>
          
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Today's Summary</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {stats.totalTasks > 0 
                    ? `${stats.completedTasks} of ${stats.totalTasks} tasks completed`
                    : 'No tasks scheduled for today'
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.taskCompletion}%
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Completion</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Task Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Current Task</h3>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              {stats.currentTask ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stats.currentTask.title}</p>
                  {stats.currentTask.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {stats.currentTask.description}
                    </p>
                  )}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-1/3 animate-pulse"></div>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">In Progress</p>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No current task</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">All caught up!</p>
                </div>
              )}
            </div>

            {/* Task Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Today's Progress</h3>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{stats.completedTasks}/{stats.totalTasks}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${stats.taskCompletion}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">0%</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">{stats.taskCompletion}%</span>
                  <span className="text-gray-500 dark:text-gray-400">100%</span>
                </div>
                {stats.totalTasks === 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    Start by adding some tasks!
                  </p>
                )}
              </div>
            </div>

            {/* Next Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Next Up</h3>
                <ArrowRight className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-2">
                {stats.nextTasks.length > 0 ? (
                  stats.nextTasks.slice(0, 2).map((task, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate flex-1">
                        {task.title}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">No upcoming tasks</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Add some tasks to get started!</p>
                  </div>
                )}
                {stats.nextTasks.length > 2 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1">
                    +{stats.nextTasks.length - 2} more tasks
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Focus Timer Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              ⏱️ Focus Timer
            </h2>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm rounded-lg">
                Pomodoro Technique
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Focus Timer Component */}
            <div className="lg:col-span-1">
              <FocusTimer defaultDuration={25} dailyGoal={5} />
            </div>
            
            {/* Timer Info & Tips */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">How to Use</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Set your focus duration (15, 25, 45, or 60 minutes)</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Click play to start your focus session</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Take short breaks between sessions</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Track your daily progress toward your goal</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Today's Focus Goal</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    5 hours
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aim to complete focused work sessions throughout the day
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Focus Tips</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• Eliminate distractions during focus sessions</p>
                  <p>• Use the timer to maintain consistent work rhythms</p>
                  <p>• Celebrate completing each session</p>
                  <p>• Adjust duration based on your energy levels</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dev Roadmap Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              💻 Development Progress
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadDevRoadmapData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh Dev Roadmap Data"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/dev-roadmap" 
                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                View Dev Roadmap
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Hours */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Hours</h3>
                <Clock className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.devHours}h</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Learning time invested</p>
            </div>

            {/* Current Streak */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Streak</h3>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.currentStreak} days</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Consecutive study days</p>
            </div>

            {/* LeetCode Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">LeetCode</h3>
                <Code className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.leetcodeSolved}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Problems solved</p>
              {stats.leetcodeSolved === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                  No problems logged yet
                </p>
              )}
            </div>

            {/* Achievement Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Achievements</h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.achievementProgress}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Progress unlocked</p>
            </div>
          </div>
        </div>

        {/* Finance Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              💰 Financial Overview
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadFinanceData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh Finance Data"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/finance" 
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
              >
                View Finance
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Monthly Balance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Balance</h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className={`text-2xl font-bold ${stats.monthlyIncome - stats.monthlyExpenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                £{(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()}
              </p>
              <div className="space-y-1 mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Income: £{stats.monthlyIncome.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Expenses: £{stats.monthlyExpenses.toLocaleString()}
                </p>
              </div>
              {stats.monthlyIncome - stats.monthlyExpenses < 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 text-center">
                  ⚠️ Expenses exceed income
                </p>
              )}
            </div>

            {/* Budget Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Budget Alerts</h3>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <p className={`text-2xl font-bold ${stats.budgetAlerts > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                {stats.budgetAlerts}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.budgetAlerts > 0 ? 'Budgets near limits' : 'All budgets healthy'}
              </p>
              {stats.budgetAlerts > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  ⚠️ Review needed
                </p>
              )}
            </div>

            {/* Upcoming Bills */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Bills</h3>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <p className={`text-2xl font-bold ${stats.upcomingBills > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                {stats.upcomingBills}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.upcomingBills > 0 ? 'Due in next 7 days' : 'No bills due soon'}
              </p>
              {stats.upcomingBills > 0 && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  📅 Plan payments
                </p>
              )}
            </div>

            {/* Savings Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Savings Goals</h3>
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.savingsProgress}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Goal completion</p>
              {stats.savingsProgress === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                  No savings goals set
                </p>
              )}
              {stats.savingsProgress > 0 && stats.savingsProgress < 50 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 text-center">
                  Keep saving! 💪
                </p>
              )}
              {stats.savingsProgress >= 50 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 text-center">
                  Great progress! 🎉
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Plant Care Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              🌱 Plant Care Status
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadPlantCareData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh Plant Care Data"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/plant-care" 
                className="px-3 py-1 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
              >
                View Plants
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Plants */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Plants</h3>
                <Leaf className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalPlants}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Plants in your care</p>
              {stats.totalPlants === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                  Add your first plant! 🌱
                </p>
              )}
              {stats.totalPlants > 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 text-center">
                  {stats.plantsNeedWater === 0 ? 'All plants healthy! 🌿' : 'Some plants need water ⚠️'}
                </p>
              )}
            </div>

            {/* Plants Needing Water */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Need Water</h3>
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <p className={`text-2xl font-bold ${stats.plantsNeedWater > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                {stats.plantsNeedWater}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.plantsNeedWater > 0 ? 'Plants need attention' : 'All plants watered'}
              </p>
              {stats.plantsNeedWater > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 text-center">
                  💧 Time to water!
                </p>
              )}
              {stats.totalPlants === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                  No plants added yet
                </p>
              )}
            </div>


          </div>
        </div>

        {/* Health Habits Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              ❤️ Health & Wellness
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadHealthHabitsData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh Health Data"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/health-habits" 
                className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors"
              >
                View Health
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Gym Streak */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Gym Streak</h3>
                <DumbbellIcon className="w-5 h-5 text-pink-500" />
              </div>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.gymStreak} days</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Consecutive workouts</p>
            </div>

            {/* Water Intake */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Water Intake</h3>
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.waterIntake}/{stats.waterTarget}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.waterIntake / stats.waterTarget) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Sleep Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Sleep Hours</h3>
                <Heart className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.sleepHours}/{stats.sleepTarget}h</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Today's sleep</p>
            </div>

            {/* Weekly Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Goals</h3>
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.weeklyGoalsCompleted}/{stats.weeklyGoals}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Goals completed</p>
            </div>
          </div>
        </div>

        {/* Calendar Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              📅 Calendar & Events
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadCalendarData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh Calendar Data"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/calendar" 
                className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
              >
                View Calendar
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Today's Events */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Today's Events</h3>
                <Calendar className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.todaysEvents}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.todaysEvents === 0 ? 'No events today' : 'Events scheduled'}
              </p>
              {stats.todaysEvents > 0 && (
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 text-center">
                  📅 Check your schedule!
                </p>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
                <CalendarDays className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.upcomingEvents}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.upcomingEvents === 0 ? 'No upcoming events' : 'Events this week'}
              </p>
              {stats.upcomingEvents > 0 && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 text-center">
                  🚀 Plan ahead!
                </p>
              )}
            </div>

            {/* Event Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Event Categories</h3>
                <BookOpen className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.eventCategories}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.eventCategories === 0 ? 'No categories set' : 'Active categories'}
              </p>
              {stats.eventCategories > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 text-center">
                  🏷️ Organized events
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Birthday Calendar Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              🎂 Birthday Calendar
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadBirthdayData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh Birthday Data"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/birthday-calendar" 
                className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors"
              >
                View Birthdays
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Birthdays */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Birthdays</h3>
                <User className="w-5 h-5 text-pink-500" />
              </div>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.totalBirthdays}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">People in your calendar</p>
              {stats.totalBirthdays === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                  Add your first birthday! 🎉
                </p>
              )}
            </div>

            {/* Upcoming Birthdays */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming (7 days)</h3>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <p className={`text-2xl font-bold ${stats.upcomingBirthdays > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                {stats.upcomingBirthdays}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.upcomingBirthdays > 0 ? 'Birthdays this week' : 'No birthdays soon'}
              </p>
              {stats.upcomingBirthdays > 0 && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 text-center">
                  🎁 Plan celebrations!
                </p>
              )}
            </div>

            {/* Next Birthday */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Next Birthday</h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              {stats.nextBirthday ? (
                <div className="space-y-1">
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.nextBirthday.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.nextBirthday.daysUntil} days away
                  </p>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No upcoming birthdays</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Add some friends!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Jobs/Career Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              💼 Jobs & Career
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadJobCareerData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh Job Career Data"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/job-career" 
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Career
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Applications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Applications</h3>
                <Briefcase className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalApplications}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Jobs applied to</p>
              {stats.totalApplications === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                  Start applying! 🚀
                </p>
              )}
            </div>

            {/* Active Applications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Active Applications</h3>
                <Clock className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeApplications}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">In progress</p>
              {stats.activeApplications > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 text-center">
                  Keep following up! 📞
                </p>
              )}
            </div>

            {/* Interviews Scheduled */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Interviews</h3>
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.interviewsScheduled}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled</p>
              {stats.interviewsScheduled > 0 && (
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 text-center">
                  Prepare well! 💪
                </p>
              )}
            </div>

            {/* Offers Received */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Offers</h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.offersReceived}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Job offers</p>
              {stats.offersReceived > 0 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 text-center">
                  Congratulations! 🎉
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Accountability Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              ⚡ Accountability System
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadAccountabilityData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh Accountability Data"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/accountability" 
                className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
              >
                View Accountability
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Tasks</h3>
                <CheckCircle className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalAccountabilityTasks}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Accountability tasks</p>
              {stats.totalAccountabilityTasks === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                  Create your first task! 📝
                </p>
              )}
            </div>

            {/* Completed Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Completed Tasks</h3>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedAccountabilityTasks}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tasks finished</p>
              {stats.totalAccountabilityTasks > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 text-center">
                  {stats.accountabilityCompletionRate}% completion
                </p>
              )}
            </div>

            {/* Active Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Active Users</h3>
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.activeAccountabilityUsers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Team members</p>
              {stats.activeAccountabilityUsers === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                  Add team members! 👥
                </p>
              )}
            </div>

            {/* Penalties */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Penalties</h3>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className={`text-2xl font-bold ${stats.totalPenalties > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {stats.totalPenalties}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.totalPenalties > 0 ? 'Missed deadlines' : 'All tasks on time'}
              </p>
              {stats.totalPenalties > 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 text-center">
                  ⚠️ Stay accountable!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Shopping List Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              🛒 Shopping List
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadShoppingListData}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                title="Refresh Shopping List Data"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/health-habits" 
                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                View Health Habits
              </Link>
            </div>
          </div>
          
          {/* Shopping List Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            {stats.totalShoppingItems === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your shopping list is empty</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Add items to your shopping list to get started!</p>
                <Link 
                  to="/health-habits" 
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add Shopping Items
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Shopping List Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stats.totalShoppingItems} items • {stats.completedShoppingItems} completed
                    </span>
                    {stats.highPriorityItems > 0 && (
                      <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        ⚠️ {stats.highPriorityItems} high priority
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {stats.shoppingCompletionRate}% completed
                  </span>
                </div>

                {/* Shopping Items by Category */}
                {(() => {
                  const categories = ['proteins', 'vegetables', 'fruits', 'grains', 'dairy', 'other']
                  const categoryLabels = {
                    proteins: '🥩 Proteins',
                    vegetables: '🥬 Vegetables', 
                    fruits: '🍎 Fruits',
                    grains: '🌾 Grains',
                    dairy: '🥛 Dairy',
                    other: '📦 Other'
                  }
                  
                  return categories.map(category => {
                    const categoryItems = stats.shoppingItems?.filter((item: any) => item.category === category) || []
                    if (categoryItems.length === 0) return null
                    
                    return (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {categoryItems.map((item: any) => (
                            <div 
                              key={item.id} 
                              className={`p-3 rounded-lg border transition-all ${
                                item.completed 
                                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                  : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className={`text-sm font-medium ${
                                      item.completed 
                                        ? 'text-green-700 dark:text-green-300 line-through' 
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                      {item.name}
                                    </span>
                                    {item.priority === 'high' && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                        High
                                      </span>
                                    )}
                                    {item.priority === 'medium' && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                        Medium
                                      </span>
                                    )}
                                    {item.priority === 'low' && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                        Low
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="capitalize">{item.category}</span>
                                    <span>•</span>
                                    <span className="capitalize">{item.priority} priority</span>
                                  </div>
                                </div>
                                <div className="ml-3">
                                  {item.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
