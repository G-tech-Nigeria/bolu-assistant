import React, { useState, useEffect, useRef } from 'react'
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
  Home,
  Circle,
  CheckCircle2,
  BookOpen,
  Dumbbell,
  Sun,
  Moon
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
  getBills,
  getFitnessGoals,
  getWeeklyGoalProgress,
  getRunStats
} from '../lib/database'
import { supabase } from '../lib/supabase'
import { notificationService } from '../lib/notifications'
import { simpleAgendaNotificationService } from '../lib/simpleAgendaNotifications'

// Schedule data from DailyAgenda
const schedules = {
  weekday: {
    day: 'Weekday',
    emoji: '🌱',
    tasks: [
      { id: '1', name: 'Pray & Read Bible', timeRange: '3:00am - 4:00am', completed: false },
      { id: '2', name: 'Clean Room', timeRange: '4:00am - 4:10am', completed: false },
      { id: '3', name: 'Bath & brush', timeRange: '4:10am - 4:30am', completed: false },
      { id: '4', name: 'Eat', timeRange: '4:30am - 4:50am', completed: false },
      { id: '5', name: 'Record Video as you are Reading', timeRange: '4:50am - 5:00am', completed: false },
      { id: '6', name: 'Post video on thread, instagram, youtube and pinterest', timeRange: '5:00am - 5:30am', completed: false },
      { id: '7', name: 'Work (Part time work)', timeRange: '5:00am - 3:30pm', completed: false },
      { id: '8', name: 'Lunch Break at Work (Make sure to eat a fruit)', timeRange: '12:00pm - 12:30pm', completed: false },
      { id: '9', name: 'Eat When you get back from Work', timeRange: '3:30pm - 4:00pm', completed: false },
      { id: '10', name: 'Evening Reading Session (4-5 hours)', timeRange: '4:00pm - 8:00pm', completed: false },
      { id: '11', name: '1 hour home workout', timeRange: '8:10pm - 8:50pm', completed: false },
      { id: '12', name: 'Daily Task Review (Notion)', timeRange: '8:50pm - 9:00pm', completed: false },
      { id: '13', name: 'Bath / Brush', timeRange: '9:00pm - 9:20pm', completed: false },
      { id: '14', name: 'Pray', timeRange: '9:20pm - 9:40pm', completed: false },
      { id: '15', name: 'Sleep Early', timeRange: '9:40pm - 10:00pm', completed: false }
    ]
  },
  monday: {
    day: 'Monday',
    emoji: '🌱',
    tasks: [
      { id: '1', name: 'Pray & Read Bible', timeRange: '3:00am - 4:00am', completed: false },
      { id: '2', name: 'Clean Room', timeRange: '4:00am - 4:10am', completed: false },
      { id: '3', name: 'Bath & brush', timeRange: '4:10am - 4:30am', completed: false },
      { id: '4', name: 'Eat', timeRange: '4:30am - 4:50am', completed: false },
      { id: '5', name: 'Record Video as you are Reading', timeRange: '4:50am - 5:00am', completed: false },
      { id: '6', name: 'Post video on thread, instagram, youtube and pinterest', timeRange: '5:00am - 5:30am', completed: false },
      { id: '7', name: 'Work (Part time work)', timeRange: '5:00am - 3:30pm', completed: false },
      { id: '8', name: 'Lunch Break at Work (Make sure to eat a fruit)', timeRange: '12:00pm - 12:30pm', completed: false },
      { id: '9', name: 'Eat When you get back from Work', timeRange: '3:30pm - 4:00pm', completed: false },
      { id: '10', name: 'Evening Reading Session (4-5 hours)', timeRange: '4:00pm - 8:00pm', completed: false },
      { id: '11', name: '1 hour home workout', timeRange: '8:10pm - 8:50pm', completed: false },
      { id: '12', name: 'Daily Task Review (Notion)', timeRange: '8:50pm - 9:00pm', completed: false },
      { id: '13', name: 'Bath / Brush', timeRange: '9:00pm - 9:20pm', completed: false },
      { id: '14', name: 'Pray', timeRange: '9:20pm - 9:40pm', completed: false },
      { id: '15', name: 'Sleep Early', timeRange: '9:40pm - 10:00pm', completed: false }
    ]
  },
  tuesday: {
    day: 'Tuesday',
    emoji: '🌱',
    tasks: [
      { id: '1', name: 'Pray & Read Bible', timeRange: '3:00am - 4:00am', completed: false },
      { id: '2', name: 'Clean Room', timeRange: '4:00am - 4:10am', completed: false },
      { id: '3', name: 'Bath & brush', timeRange: '4:10am - 4:30am', completed: false },
      { id: '4', name: 'Eat', timeRange: '4:30am - 4:50am', completed: false },
      { id: '5', name: 'Record Video as you are Reading', timeRange: '4:50am - 5:00am', completed: false },
      { id: '6', name: 'Post video on thread, instagram, youtube and pinterest', timeRange: '5:00am - 5:30am', completed: false },
      { id: '7', name: 'Work (Part time work)', timeRange: '5:00am - 3:30pm', completed: false },
      { id: '8', name: 'Lunch Break at Work (Make sure to eat a fruit)', timeRange: '12:00pm - 12:30pm', completed: false },
      { id: '9', name: 'Eat When you get back from Work', timeRange: '3:30pm - 4:00pm', completed: false },
      { id: '10', name: 'Evening Reading Session (4-5 hours)', timeRange: '4:00pm - 8:00pm', completed: false },
      { id: '11', name: '1 hour home workout', timeRange: '8:10pm - 8:50pm', completed: false },
      { id: '12', name: 'Daily Task Review (Notion)', timeRange: '8:50pm - 9:00pm', completed: false },
      { id: '13', name: 'Bath / Brush', timeRange: '9:00pm - 9:20pm', completed: false },
      { id: '14', name: 'Pray', timeRange: '9:20pm - 9:40pm', completed: false },
      { id: '15', name: 'Sleep Early', timeRange: '9:40pm - 10:00pm', completed: false }
    ]
  },
  wednesday: {
    day: 'Wednesday',
    emoji: '🌱',
    tasks: [
      { id: '1', name: 'Pray & Read Bible', timeRange: '3:00am - 4:00am', completed: false },
      { id: '2', name: 'Clean Room', timeRange: '4:00am - 4:10am', completed: false },
      { id: '3', name: 'Bath & brush', timeRange: '4:10am - 4:30am', completed: false },
      { id: '4', name: 'Eat', timeRange: '4:30am - 4:50am', completed: false },
      { id: '5', name: 'Record Video as you are Reading', timeRange: '4:50am - 5:00am', completed: false },
      { id: '6', name: 'Post video on thread, instagram, youtube and pinterest', timeRange: '5:00am - 5:30am', completed: false },
      { id: '7', name: 'Work (Part time work)', timeRange: '5:00am - 3:30pm', completed: false },
      { id: '8', name: 'Lunch Break at Work (Make sure to eat a fruit)', timeRange: '12:00pm - 12:30pm', completed: false },
      { id: '9', name: 'Eat When you get back from Work', timeRange: '3:30pm - 4:00pm', completed: false },
      { id: '10', name: 'Evening Reading Session (4-5 hours)', timeRange: '4:00pm - 8:00pm', completed: false },
      { id: '11', name: '1 hour home workout', timeRange: '8:10pm - 8:50pm', completed: false },
      { id: '12', name: 'Daily Task Review (Notion)', timeRange: '8:50pm - 9:00pm', completed: false },
      { id: '13', name: 'Bath / Brush', timeRange: '9:00pm - 9:20pm', completed: false },
      { id: '14', name: 'Pray', timeRange: '9:20pm - 9:40pm', completed: false },
      { id: '15', name: 'Sleep Early', timeRange: '9:40pm - 10:00pm', completed: false }
    ]
  },
  thursday: {
    day: 'Thursday',
    emoji: '🌱',
    tasks: [
      { id: '1', name: 'Pray & Read Bible', timeRange: '3:00am - 4:00am', completed: false },
      { id: '2', name: 'Clean Room', timeRange: '4:00am - 4:10am', completed: false },
      { id: '3', name: 'Bath & brush', timeRange: '4:10am - 4:30am', completed: false },
      { id: '4', name: 'Eat', timeRange: '4:30am - 4:50am', completed: false },
      { id: '5', name: 'Record Video as you are Reading', timeRange: '4:50am - 5:00am', completed: false },
      { id: '6', name: 'Post video on thread, instagram, youtube and pinterest', timeRange: '5:00am - 5:30am', completed: false },
      { id: '7', name: 'Work (Part time work)', timeRange: '5:00am - 3:30pm', completed: false },
      { id: '8', name: 'Lunch Break at Work (Make sure to eat a fruit)', timeRange: '12:00pm - 12:30pm', completed: false },
      { id: '9', name: 'Eat When you get back from Work', timeRange: '3:30pm - 4:00pm', completed: false },
      { id: '10', name: 'Evening Reading Session (4-5 hours)', timeRange: '4:00pm - 8:00pm', completed: false },
      { id: '11', name: '1 hour home workout', timeRange: '8:10pm - 8:50pm', completed: false },
      { id: '12', name: 'Daily Task Review (Notion)', timeRange: '8:50pm - 9:00pm', completed: false },
      { id: '13', name: 'Bath / Brush', timeRange: '9:00pm - 9:20pm', completed: false },
      { id: '14', name: 'Pray', timeRange: '9:20pm - 9:40pm', completed: false },
      { id: '15', name: 'Sleep Early', timeRange: '9:40pm - 10:00pm', completed: false }
    ]
  },
  friday: {
    day: 'Friday',
    emoji: '🌱',
    tasks: [
      { id: '1', name: 'Pray & Read Bible', timeRange: '3:00am - 4:00am', completed: false },
      { id: '2', name: 'Clean Room', timeRange: '4:00am - 4:10am', completed: false },
      { id: '3', name: 'Bath & brush', timeRange: '4:10am - 4:30am', completed: false },
      { id: '4', name: 'Eat', timeRange: '4:30am - 4:50am', completed: false },
      { id: '5', name: 'Record Video as you are Reading', timeRange: '4:50am - 5:00am', completed: false },
      { id: '6', name: 'Post video on thread, instagram, youtube and pinterest', timeRange: '5:00am - 5:30am', completed: false },
      { id: '7', name: 'Work (Part time work)', timeRange: '5:00am - 3:30pm', completed: false },
      { id: '8', name: 'Lunch Break at Work (Make sure to eat a fruit)', timeRange: '12:00pm - 12:30pm', completed: false },
      { id: '9', name: 'Eat When you get back from Work', timeRange: '3:30pm - 4:00pm', completed: false },
      { id: '10', name: 'Evening Reading Session (4-5 hours)', timeRange: '4:00pm - 8:00pm', completed: false },
      { id: '11', name: '1 hour home workout', timeRange: '8:10pm - 8:50pm', completed: false },
      { id: '12', name: 'Daily Task Review (Notion)', timeRange: '8:50pm - 9:00pm', completed: false },
      { id: '13', name: 'Bath / Brush', timeRange: '9:00pm - 9:20pm', completed: false },
      { id: '14', name: 'Pray', timeRange: '9:20pm - 9:40pm', completed: false },
      { id: '15', name: 'Sleep Early', timeRange: '9:40pm - 10:00pm', completed: false }
    ]
  },
  saturday: {
    day: 'Saturday',
    emoji: '🌱',
    tasks: [
      { id: '1', name: 'Pray & Read Bible', timeRange: '7:00am - 8:00am', completed: false },
      { id: '2', name: 'Cleaning, Washing and Organizing', timeRange: '8:00am - 10:00am', completed: false },
      { id: '3', name: 'Snack & Rest', timeRange: '10:00am - 10:30am', completed: false },
      { id: '4', name: 'Shopping & Errands', timeRange: '10:30am - 1:00pm', completed: false },
      { id: '5', name: 'Record Video as you are Reading', timeRange: '1:00pm - 1:30pm', completed: false },
      { id: '6', name: 'Post video on thread, instagram, youtube and pinterest', timeRange: '1:30pm - 2:00pm', completed: false },
      { id: '7', name: 'Lunch & Relaxation', timeRange: '1:00pm - 2:00pm', completed: false },
      { id: '8', name: 'Reading deep focus', timeRange: '2:00pm - 5:30pm', completed: false },
      { id: '9', name: 'Light Activity / Socializing / break', timeRange: '5:30pm - 6:30pm', completed: false },
      { id: '10', name: 'Dinner & Wind Down', timeRange: '6:30pm - 7:30pm', completed: false },
      { id: '11', name: 'Reading or Reflection Time', timeRange: '7:30pm - 9:30pm', completed: false },
      { id: '12', name: 'Prayer & Mental Reset', timeRange: '9:30pm - 10:00pm', completed: false },
      { id: '13', name: 'Gym Workout', timeRange: '10:00pm - 11:10pm', completed: false },
      { id: '14', name: 'Post Gym Refresh & Snacks', timeRange: '11:10pm - 11:30pm', completed: false },
      { id: '15', name: 'Sleep', timeRange: '11:30pm - 12:00am', completed: false }
    ]
  },
  sunday: {
    day: 'Sunday',
    emoji: '🌱',
    tasks: [
      { id: '1', name: 'Pray & Read Bible', timeRange: '7:00am - 7:30am', completed: false },
      { id: '2', name: 'Clean Room', timeRange: '7:30am - 8:00am', completed: false },
      { id: '3', name: 'Workout / Leisure', timeRange: '8:00am - 9:30am', completed: false },
      { id: '4', name: 'Workout', timeRange: '9:30am - 10:00am', completed: false },
      { id: '5', name: 'Church Service', timeRange: '10:00am - 2:00pm', completed: false },
      { id: '6', name: 'Eat', timeRange: '2:00pm - 3:00pm', completed: false },
      { id: '7', name: 'Reading Session', timeRange: '3:00pm - 7:30pm', completed: false },
      { id: '8', name: 'Prayer & Mental Reset', timeRange: '7:30pm - 8:00pm', completed: false },
      { id: '9', name: 'Relax & Prepare for Sleep (No screen, light activity, or meditation)', timeRange: '8:00pm - 9:00pm', completed: false },
      { id: '10', name: 'Light Out, Sleep', timeRange: '9:00pm - 9:30pm', completed: false }
    ]
  }
}

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

interface CurrentTask {
  id: string
  name: string
  timeRange: string
  completed: boolean
  isOverdue: boolean
  isCurrent: boolean
}

// Helper functions for task categorization and styling (mirrors DailyAgenda)
const getTaskCategory = (taskName: string): 'morning' | 'work' | 'evening' | 'health' | 'spiritual' | 'leisure' => {
  const name = taskName.toLowerCase()
  if (name.includes('pray') || name.includes('bible') || name.includes('church')) return 'spiritual'
  if (name.includes('workout') || name.includes('gym') || name.includes('exercise')) return 'health'
  if (name.includes('work') || name.includes('job')) return 'work'
  if (name.includes('read') || name.includes('study')) return 'leisure'
  if (name.includes('sleep') || name.includes('bed')) return 'evening'
  if (name.includes('eat') || name.includes('lunch') || name.includes('dinner')) return 'morning'
  if (name.includes('clean') || name.includes('wash') || name.includes('bath')) return 'morning'
  return 'morning'
}

const getTaskIcon = (category: ReturnType<typeof getTaskCategory>) => {
  switch (category) {
    case 'spiritual': return <Heart className="w-4 h-4" />
    case 'health': return <Dumbbell className="w-4 h-4" />
    case 'work': return <Briefcase className="w-4 h-4" />
    case 'leisure': return <BookOpen className="w-4 h-4" />
    case 'evening': return <Moon className="w-4 h-4" />
    case 'morning': return <Sun className="w-4 h-4" />
    default: return <Target className="w-4 h-4" />
  }
}

const getTaskColor = (category: ReturnType<typeof getTaskCategory>) => {
  switch (category) {
    case 'spiritual': return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
    case 'health': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
    case 'work': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
    case 'leisure': return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
    case 'evening': return 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20'
    case 'morning': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
    default: return 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50'
  }
}

const EnhancedDashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])
  const [greeting, setGreeting] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [currentTask, setCurrentTask] = useState<CurrentTask | null>(null)
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
  const [connectionError, setConnectionError] = useState(false)
  const hasScheduledRef = useRef(false)

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

  // Function to find current task based on time
  const findCurrentTask = (tasks: any[], currentTime: Date) => {
    if (!tasks || tasks.length === 0) return null
    
    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    
    let currentTask = null
    let overdueTask = null
    
    // Find the task that should be happening now
    for (const task of tasks) {
      if (!task.timeRange || task.completed) continue
      
      // Parse time range (e.g., "2:00pm - 3:00pm")
      const timeMatch = task.timeRange.match(/^(\d{1,2}):(\d{2})(am|pm)\s*-\s*(\d{1,2}):(\d{2})(am|pm)$/i)
      
      if (timeMatch) {
        const [_, startHourStr, startMinuteStr, startPeriod, endHourStr, endMinuteStr, endPeriod] = timeMatch
        
        let startHour = parseInt(startHourStr)
        let startMinute = parseInt(startMinuteStr)
        let endHour = parseInt(endHourStr)
        let endMinute = parseInt(endMinuteStr)
        
        // Convert to 24-hour format
        if (startPeriod.toLowerCase() === 'pm' && startHour !== 12) startHour += 12
        else if (startPeriod.toLowerCase() === 'am' && startHour === 12) startHour = 0
        
        if (endPeriod.toLowerCase() === 'pm' && endHour !== 12) endHour += 12
        else if (endPeriod.toLowerCase() === 'am' && endHour === 12) endHour = 0
        
        const startTimeInMinutes = startHour * 60 + startMinute
        const endTimeInMinutes = endHour * 60 + endMinute
        
        // Check if current time is within this task's time range
        if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
          currentTask = {
            id: task.id,
            name: task.name,
            timeRange: task.timeRange,
            completed: task.completed,
            isOverdue: false,
            isCurrent: true
          }
        }
        // Check if task is overdue (past end time)
        else if (currentTimeInMinutes > endTimeInMinutes) {
          // Only set overdue task if we don't have a current task
          if (!currentTask) {
            overdueTask = {
              id: task.id,
              name: task.name,
              timeRange: task.timeRange,
              completed: task.completed,
              isOverdue: true,
              isCurrent: false
            }
          }
        }
      }
    }
    
    // Return current task first, then overdue task
    return currentTask || overdueTask
  }

  // Function to handle task completion from dashboard
  const handleTaskComplete = async (taskId: string) => {
    try {
      // Since we're using schedule data, the taskId is not a database UUID
      // We need to find the actual database task for today's date
      const today = new Date()
      const dateStr = today.toISOString().split('T')[0] // YYYY-MM-DD format
      
      // Get the current task name from the schedule
      const currentTaskName = currentTask?.name
      if (!currentTaskName) {
        return
      }
      
      // Find the database task by name and date
      const { data: dbTasks, error: findError } = await supabase
        .from('agenda_tasks')
        .select('*')
        .eq('title', currentTaskName)
        .eq('date', dateStr)
      
      if (findError) {
        return
      }
      
      if (!dbTasks || dbTasks.length === 0) {
        // Update the current task state anyway for immediate feedback
        setCurrentTask(prev => prev ? { ...prev, completed: true } : null)
        return
      }
      
      const dbTask = dbTasks[0]
      
      // Update the task in the database using the actual UUID
      const { error: updateError } = await supabase
        .from('agenda_tasks')
        .update({ completed: true })
        .eq('id', dbTask.id)
      
      if (updateError) {
        // Revert the state change if database update failed
        setCurrentTask(prev => prev ? { ...prev, completed: false } : null)
      } else {
        // Update the current task state
        setCurrentTask(prev => prev ? { ...prev, completed: true } : null)
        // Refresh dashboard data to update stats
        loadDashboardData()
      }
    } catch (error) {
      // Revert the state change if there was an error
      setCurrentTask(prev => prev ? { ...prev, completed: false } : null)
    }
  }

  // Load all dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Get current day's schedule
      const today = new Date()
      const dayOfWeek = today.getDay()
      
      // Determine which schedule to use
      // Day numbers: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
      let scheduleKey = 'weekday'
      if (dayOfWeek === 1) scheduleKey = 'monday'      // Monday
      else if (dayOfWeek === 2) scheduleKey = 'tuesday'    // Tuesday
      else if (dayOfWeek === 3) scheduleKey = 'wednesday'  // Wednesday
      else if (dayOfWeek === 4) scheduleKey = 'thursday'   // Thursday
      else if (dayOfWeek === 5) scheduleKey = 'friday'     // Friday
      else if (dayOfWeek === 6) scheduleKey = 'saturday'   // Saturday
      else if (dayOfWeek === 0) scheduleKey = 'sunday'     // Sunday
      
      const schedule = schedules[scheduleKey as keyof typeof schedules]
      const todayTasks = schedule.tasks
      
      // Find current task based on current time
      const currentTaskData = findCurrentTask(todayTasks, currentTime)
      setCurrentTask(currentTaskData)
      
      // Schedule today's notifications once
      if (!hasScheduledRef.current) {
        // The simple agenda notification service runs automatically
        hasScheduledRef.current = true
      }

      // Get today's date for database queries
      const todayStr = today.toISOString().split('T')[0]

      // Load all dashboard data from actual database functions
      const [
        agendaTasks,
        plants,
        healthData,
        devStats,
        events,
        financeData,
        budgets,
        savingsGoals,
        bills,
        fitnessGoals,
        weeklyGoals,
        runStats
      ] = await Promise.all([
        getAgendaTasks(todayStr),
        getPlants(),
        getHealthHabits('gym'), // Remove date parameter to get all gym data
        getDevRoadmapUserStats(),
        getCalendarEvents(),
        getFinancialAnalytics(),
        getBudgets(),
        getSavingsGoals(),
        getBills(),
        getFitnessGoals(),
        getWeeklyGoalProgress(),
        getRunStats()
      ])



      // Calculate task completion stats from actual agenda tasks
      const completedTasks = agendaTasks.filter((task: any) => task.completed).length
      const totalTasks = agendaTasks.length
      const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      
      setStats(prev => ({
        ...prev,
        taskCompletion: percentage,
        totalTasks,
        completedTasks
      }))

      // Process calendar events
      if (events.length > 0) {
        const processedEvents = events.map((event: any) => ({
          ...event,
          startDate: new Date(event.start_date),
          endDate: new Date(event.end_date)
        }))
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const todaysEvents = processedEvents
          .filter((event: any) => {
            const eventStartDate = new Date(event.startDate)
            return eventStartDate >= today && eventStartDate < tomorrow
          })
          .sort((a: any, b: any) => a.startDate.getTime() - b.startDate.getTime())

        setUpcomingEvents(todaysEvents)
      }

      // Process plant stats
      if (plants && plants.length > 0) {
        const needWater = plants.filter((plant: any) => {
          if (!plant.next_watering) return false
          const nextWatering = new Date(plant.next_watering)
          return nextWatering <= new Date()
        }).length

        setStats(prev => ({
          ...prev,
          plantCareTasks: plants.length,
          plantsNeedWater: needWater,
          totalPlants: plants.length
        }))
      }

          // Process health stats from actual health data
          try {
            if (healthData && healthData.length > 0 && Array.isArray(healthData[0]?.data)) {
              const gymData = healthData[0].data
              
              // Calculate gym streak using the same logic as HealthHabits component
              const sortedGymDays = [...gymData].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              let gymStreak = 0
              
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
              
              // Get water data
              const waterData = await getHealthHabits('water', todayStr)
              let waterIntake = 0
              let waterTarget = 8
              
              if (waterData.length > 0 && Array.isArray(waterData[0]?.data)) {
                const todayWater = waterData[0].data.find((entry: any) => entry.date === todayStr)
                if (todayWater) {
                  waterIntake = todayWater.scheduledIntakes
                    ?.filter((intake: any) => intake.completed)
                    ?.reduce((total: number, intake: any) => total + intake.glasses, 0) || 0
                  waterTarget = todayWater.target || 8
                }
              }
              

        
        setStats(prev => ({
          ...prev,
                gymStreak,
                waterIntake,
                waterTarget
              }))
            } else {
              // Set default values if no health data
              setStats(prev => ({
                ...prev,
                gymStreak: 0,
                waterIntake: 0,
                waterTarget: 8
              }))
            }
          } catch (error) {
            console.error('Error processing health data:', error)
            // Set default values on error
            setStats(prev => ({
              ...prev,
              gymStreak: 0,
              waterIntake: 0,
              waterTarget: 8
            }))
          }

      // Process dev stats from actual dev roadmap data
      if (devStats) {
        setStats(prev => ({
          ...prev,
          devHours: devStats.total_hours || 0,
          leetcodeSolved: devStats.total_leetcode_solved || 0,
          currentStreak: devStats.current_streak || 0
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

      // Process budget alerts
      if (budgets && budgets.length > 0) {
        const alerts = budgets.filter((budget: any) => {
          if (!budget.limit || budget.limit <= 0) return false
          return (budget.spent / budget.limit) > 0.8
        }).length

        setStats(prev => ({
          ...prev,
          budgetAlerts: alerts
        }))
      }

      // Process savings goals
      if (savingsGoals && savingsGoals.length > 0) {
        const totalProgress = savingsGoals.reduce((sum: number, goal: any) => {
          if (!goal.target_amount || goal.target_amount <= 0) return sum
          return sum + (goal.current_amount / goal.target_amount)
        }, 0)
        
        const averageProgress = totalProgress / savingsGoals.length
        setStats(prev => ({
          ...prev,
          goalProgress: Math.round(averageProgress * 100)
        }))
      }

          // Process fitness goals and weekly progress
    if (fitnessGoals && fitnessGoals.length > 0) {
      const activeGoals = fitnessGoals.filter((goal: any) => goal.status === 'active').length
      const completedGoals = fitnessGoals.filter((goal: any) => goal.status === 'completed').length
      
      setStats(prev => ({
        ...prev,
        activeGoals,
        completedGoals
      }))
    }

    // Get additional health metrics (sleep, mood, etc.)
    try {
      const [sleepData, moodData, metricsData] = await Promise.all([
        getHealthHabits('sleep', todayStr),
        getHealthHabits('mood', todayStr),
        getHealthHabits('metrics', todayStr)
      ])

      // Process sleep data if available
      if (sleepData.length > 0 && sleepData[0].data.length > 0) {
        const todaySleep = sleepData[0].data.find((entry: any) => entry.date === todayStr)
        if (todaySleep) {
          // Could add sleep hours to stats if needed
        }
      }

      // Process mood data if available
      if (moodData.length > 0 && moodData[0].data.length > 0) {
        const todayMood = moodData[0].data.find((entry: any) => entry.date === todayStr)
        if (todayMood) {
          // Could add mood tracking to stats if needed
        }
      }

      // Process health metrics if available
      if (metricsData.length > 0 && metricsData[0].data.length > 0) {
        const todayMetrics = metricsData[0].data.find((entry: any) => entry.date === todayStr)
        if (todayMetrics) {
          // Could add weight, blood pressure, etc. to stats if needed
        }
      }
    } catch (error) {
      // Silent error handling
    }

      // Process run stats for additional health metrics
      if (runStats) {
        // Add run stats to health metrics if needed
      }

      // Clear connection error if data loads successfully
      setConnectionError(false)

      // Generate smart suggestions based on loaded data
      generateSmartSuggestions()

    } catch (error: any) {
      console.error('Error loading dashboard data:', error)
      
      // Set fallback stats if database calls fail
      setStats({
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
      
      // Show user-friendly error message
      if (error.message?.includes('ERR_CONNECTION_CLOSED') || error.code === 'ECONNRESET') {
        setConnectionError(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle manual retry
  const handleRetry = async () => {
    setConnectionError(false)
    await loadDashboardData()
  }

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Update current time and current task
    const timer = setInterval(() => {
      const newTime = new Date()
      setCurrentTime(newTime)
      
      // Update current task when time changes
      const dayOfWeek = newTime.getDay()
      let scheduleKey = 'weekday'
      if (dayOfWeek === 1) scheduleKey = 'monday'
      else if (dayOfWeek === 2) scheduleKey = 'tuesday'
      else if (dayOfWeek === 3) scheduleKey = 'wednesday'
      else if (dayOfWeek === 4) scheduleKey = 'thursday'
      else if (dayOfWeek === 5) scheduleKey = 'friday'
      else if (dayOfWeek === 6) scheduleKey = 'saturday'
      else if (dayOfWeek === 0) scheduleKey = 'sunday'
      
      const schedule = schedules[scheduleKey as keyof typeof schedules]
      if (schedule) {
        const currentTaskData = findCurrentTask(schedule.tasks, newTime)
        setCurrentTask(currentTaskData)
      }
    }, 1000)

    // Load initial data
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
    } else if (stats.devHours === 0) {
      suggestions.push({
        id: 'start-dev-work',
        type: 'tip',
        title: 'Start Learning',
        description: 'You haven\'t logged any development time yet. Start your learning journey today!',
        action: 'Start Learning',
        actionHref: '/dev-roadmap',
        priority: 'high'
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

    // Gym streak encouragement
    if (stats.gymStreak > 0) {
      suggestions.push({
        id: 'gym-streak',
        type: 'achievement',
        title: 'Fitness Streak!',
        description: `You're on a ${stats.gymStreak}-day gym streak. Keep up the great work!`,
        priority: 'medium'
      })
    } else {
      suggestions.push({
        id: 'start-fitness',
        type: 'tip',
        title: 'Start Your Fitness Journey',
        description: 'Begin your fitness journey today. Even a short workout makes a difference!',
        action: 'Log Workout',
        actionHref: '/health-habits',
        priority: 'medium'
      })
    }

    // Water intake encouragement
    if (stats.waterIntake > 0 && stats.waterIntake < stats.waterTarget * 0.7) {
      suggestions.push({
        id: 'water-progress',
        type: 'tip',
        title: 'Hydration Progress',
        description: `You've had ${stats.waterIntake} glasses of water. ${stats.waterTarget - stats.waterIntake} more to reach your daily goal!`,
        action: 'Log Water',
        actionHref: '/health-habits',
        priority: 'medium'
      })
    } else if (stats.waterIntake >= stats.waterTarget) {
      suggestions.push({
        id: 'water-achievement',
        type: 'achievement',
        title: 'Hydration Goal Met!',
        description: `Great job! You've reached your daily water intake goal of ${stats.waterTarget} glasses.`,
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

    // Financial balance suggestions
    if (stats.monthlyIncome > 0 && stats.monthlyExpenses > 0) {
      const balance = stats.monthlyIncome - stats.monthlyExpenses
      if (balance < 0) {
        suggestions.push({
          id: 'negative-balance',
          type: 'reminder',
          title: 'Budget Review Needed',
          description: `Your monthly expenses exceed income by £${Math.abs(balance).toLocaleString()}. Consider reviewing your budget.`,
          action: 'Review Finance',
          actionHref: '/finance',
          priority: 'high'
        })
      } else if (balance > 0) {
        suggestions.push({
          id: 'positive-balance',
          type: 'achievement',
          title: 'Great Financial Health!',
          description: `You have a positive monthly balance of £${balance.toLocaleString()}. Keep up the good financial habits!`,
          priority: 'medium'
        })
      }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden w-full">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 w-full">
          <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            {/* Left side - Greeting and Time */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <BMLogo />
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {greeting}, Welcome Back!
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-gray-600 dark:text-gray-400 font-medium">
                  {format(currentTime, 'EEEE, MMMM do, yyyy')} • {format(currentTime, 'h:mm:ss a')}
                </p>
              </div>
            </div>
            
            {/* Right side - Encouraging Words and Bible Verse */}
            <div className="flex flex-col space-y-2 sm:space-y-3 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4 xl:space-x-6">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-2 sm:p-3 md:p-4 border border-orange-200 dark:border-orange-700/50">
                <EncouragingWords />
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-2 sm:p-3 md:p-4 border border-blue-200 dark:border-blue-700/50">
                <BibleVerse />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Error Message */}
      {connectionError && (
        <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium">Connection Issue Detected</p>
                  <p className="mt-1 opacity-90">Some dashboard data may not be available due to database connection issues.</p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex-shrink-0"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 w-full">
        {/* Quick Actions */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 flex items-center">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                to={action.href}
                className={`${action.color} text-white p-2 sm:p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105`}
              >
                <div className="text-center">
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mx-auto mb-1 sm:mb-2" />
                  <h3 className="font-medium text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">{action.title}</h3>
                  <p className="text-xs opacity-90 mt-1 hidden sm:block overflow-hidden text-ellipsis whitespace-nowrap">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Current Task Widget */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 flex items-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
            Current Task
          </h2>
          {currentTask ? (
            (() => {
              const category = getTaskCategory(currentTask.name)
              const isCurrent = currentTask.isCurrent
              const isOverdueTask = currentTask.isOverdue
              return (
                <div className={`flex items-start p-3 md:p-4 rounded-lg border transition-all relative ${
                  currentTask.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md'
                    : isOverdueTask
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600'
                    : getTaskColor(category)
                }`}>
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  )}
                  {isOverdueTask && !currentTask.completed && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                  <div className="mr-3 flex-shrink-0 hidden sm:block">
                    {getTaskIcon(category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm md:text-base leading-relaxed ${
                      currentTask.completed
                        ? 'line-through text-gray-500'
                        : isCurrent
                        ? 'text-blue-900 dark:text-blue-100'
                        : isOverdueTask
                        ? 'text-red-900 dark:text-red-100'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="break-words">{currentTask.name}</span>
                        <div className="flex items-center mt-1 sm:mt-0 sm:ml-2">
                          {isCurrent && (
                            <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full animate-pulse mr-2">
                              NOW
                            </span>
                          )}
                          {isOverdueTask && !currentTask.completed && (
                            <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                              OVERDUE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {currentTask.timeRange && (
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                        <span className="break-words">{currentTask.timeRange}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    {!currentTask.completed ? (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleTaskComplete(currentTask.id) }}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        title="Complete"
                      >
                        Complete
                      </button>
                    ) : (
                      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">
                        Completed
                      </div>
                    )}
                    <Link
                      to="/agenda"
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">No Current Task</div>
            </div>
          )}
        </div>

        {/* Unified Stats Overview */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 flex items-center">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
            Life Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {/* Productivity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">Productivity</h3>
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500" />
              </div>
              <div className="space-y-1 sm:space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Task Completion</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs sm:text-sm md:text-base">{stats.taskCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.taskCompletion}%` }}
                  ></div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {stats.completedTasks} of {stats.totalTasks} tasks completed
                </div>
              </div>
            </div>

            {/* Development */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">Development</h3>
                <Code className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />
              </div>
              <div className="space-y-1 sm:space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Hours</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-xs sm:text-sm md:text-base">{stats.devHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-xs sm:text-sm md:text-base">{stats.currentStreak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">LeetCode Solved</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-xs sm:text-sm md:text-base">{stats.leetcodeSolved}</span>
                </div>
              </div>
            </div>

            {/* Health & Wellness */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">Health & Wellness</h3>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pink-500" />
              </div>
              <div className="space-y-1 sm:space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Gym Streak</span>
                  <span className="font-semibold text-pink-600 dark:text-pink-400 text-xs sm:text-sm md:text-base">{stats.gymStreak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Water Intake</span>
                  <span className="font-semibold text-pink-600 dark:text-pink-400 text-xs sm:text-sm md:text-base">{stats.waterIntake}/{stats.waterTarget}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.waterIntake / stats.waterTarget) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Plant Care */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">Plant Care</h3>
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-500" />
              </div>
              <div className="space-y-1 sm:space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Plants</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm md:text-base">{stats.totalPlants}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Need Water</span>
                  <span className={`font-semibold text-xs sm:text-sm md:text-base ${stats.plantsNeedWater > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {stats.plantsNeedWater}
                  </span>
                </div>
                {stats.plantsNeedWater > 0 && (
                  <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400">
                    ⚠️ {stats.plantsNeedWater} plant{stats.plantsNeedWater > 1 ? 's' : ''} need{stats.plantsNeedWater > 1 ? '' : 's'} watering
                  </div>
                )}
              </div>
            </div>

            {/* Finance & Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">Finance & Goals</h3>
                <TargetIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-500" />
              </div>
              <div className="space-y-1 sm:space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Monthly Balance</span>
                  <span className={`font-semibold text-xs sm:text-sm md:text-base ${stats.monthlyIncome - stats.monthlyExpenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    £{(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Goal Progress</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400 text-xs sm:text-sm md:text-base">{stats.goalProgress}%</span>
                </div>
                {stats.budgetAlerts > 0 && (
                  <div className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                    ⚠️ {stats.budgetAlerts} budget alert{stats.budgetAlerts > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
            Smart Suggestions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {smartSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-3 sm:p-4 rounded-xl border-l-4 ${getPriorityColor(suggestion.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(suggestion.priority)}
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {suggestion.title}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  {suggestion.description}
                </p>
                {suggestion.action && suggestion.actionHref && (
                  <Link
                    to={suggestion.actionHref}
                    className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {suggestion.action}
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-500" />
              Today's Events
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{event.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/calendar"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs sm:text-sm font-medium flex-shrink-0 ml-2"
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
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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
                className={`${item.color} hover:opacity-90 text-white p-3 sm:p-4 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105`}
              >
                <div className="text-center">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                  <h3 className="font-medium text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Widget-like Quick Stats Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              📱 Quick Stats (Widget View)
              <span className="ml-2 text-sm text-gray-500">Tap to open detailed views</span>
            </h2>
            <Link 
              to="/widgets" 
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              Full Widget View
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Hours Invested Widget */}
            <Link 
              to="/dev-roadmap"
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Hours Invested</p>
                  <p className="text-2xl font-bold">{stats.devHours}h</p>
                  <p className="text-xs opacity-80 mt-1">
                    Total learning time
                  </p>
                </div>
                <div className="text-3xl">⏰</div>
              </div>
            </Link>

            {/* Tasks Widget */}
            <Link 
              to="/agenda"
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Today's Tasks</p>
                  <p className="text-2xl font-bold">{stats.totalTasks}</p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
              <p className="text-xs opacity-80 mt-1">{stats.completedTasks} completed</p>
            </Link>

            {/* Plant Care Widget */}
            <Link 
              to="/plant-care"
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Plants</p>
                  <p className="text-2xl font-bold">{stats.totalPlants}</p>
                </div>
                <div className="text-3xl">🌱</div>
              </div>
              <p className="text-xs opacity-80 mt-1">{stats.plantsNeedWater} need water</p>
            </Link>

            {/* Finance Widget */}
            <Link 
              to="/finance"
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Monthly Budget</p>
                  <p className="text-2xl font-bold">${stats.monthlyIncome}</p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
              <p className="text-xs opacity-80 mt-1">${Math.max(stats.monthlyIncome - stats.monthlyExpenses, 0)} remaining</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedDashboard
