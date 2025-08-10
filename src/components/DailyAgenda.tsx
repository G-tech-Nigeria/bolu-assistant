import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { 
  Calendar, 
  Bell, 
  Circle, 
  CheckCircle2, 
  Clock, 
  Sun,
  Moon,
  BookOpen,
  Dumbbell,
  Heart,
  Workflow,
  Target
} from 'lucide-react'
import { addAgendaTask } from '../lib/database'
import { supabase } from '../lib/supabase'
import { notificationService } from '../lib/notifications'

interface Task {
  id: string
  name: string
  timeRange?: string
  completed: boolean
  category?: 'morning' | 'work' | 'evening' | 'health' | 'spiritual' | 'leisure'
}

interface DaySchedule {
  day: string
  emoji: string
  tasks: Task[]
}

const DailyAgenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentSchedule, setCurrentSchedule] = useState<DaySchedule | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null)
  const [notificationStatus, setNotificationStatus] = useState<'granted' | 'denied' | 'default' | 'unsupported'>('default')
  const hasLoadedRef = useRef(false)

  // Schedule templates
  const schedules: Record<string, DaySchedule> = {
    weekday: {
      day: 'Weekday',
      emoji: '🌱',
      tasks: [
        { id: '1', name: 'Pray & Read Bible', timeRange: '3:00am - 4:00am', completed: false },
        { id: '2', name: 'Clean Room', timeRange: '4:00am - 4:10am', completed: false },
        { id: '3', name: 'Bath & brush', timeRange: '4:10am - 4:30am', completed: false },
        { id: '4', name: 'Eat', timeRange: '4:30am - 4:50am', completed: false },
        { id: '5', name: 'Record Video as you are Reading', completed: false },
        { id: '6', name: 'Post video on thread, instagram, youtube and pinterest', completed: false },
        { id: '7', name: 'Work (Part time work)', timeRange: '5:00am - 3:30 pm', completed: false },
        { id: '8', name: 'Lunch Break at Work (Make sure to eat a fruit)', completed: false },
        { id: '9', name: 'Eat When you get back from Work', timeRange: '3:30pm - 4:00pm', completed: false },
        { id: '10', name: 'Evening Reading Session (4-5 hours)', timeRange: '4:00pm - 8:00pm', completed: false },
        { id: '11', name: '1 hour home workout', timeRange: '8:10pm - 8:50pm', completed: false },
        { id: '12', name: 'Daily Task Review (Notion)', timeRange: '8:50pm - 9:00pm', completed: false },
        { id: '13', name: 'Bath / Brush', timeRange: '9:00pm - 9:20pm', completed: false },
        { id: '14', name: 'Pray', timeRange: '9:20pm - 9:40pm', completed: false },
        { id: '15', name: 'Sleep Early', timeRange: '9:40pm', completed: false }
      ]
    },
    saturday: {
      day: 'Saturday',
      emoji: '🌱',
      tasks: [
        { id: '1', name: 'Pray & Read Bible', timeRange: '7:00 - 8:00am', completed: false },
        { id: '2', name: 'Cleaning, Washing and Organizing', timeRange: '8:00 - 10:00am', completed: false },
        { id: '3', name: 'Snack & Rest', timeRange: '10:00 - 10:30am', completed: false },
        { id: '4', name: 'Shopping & Errands', timeRange: '10:30am - 1:00pm', completed: false },
        { id: '5', name: 'Record Video as you are Reading', completed: false },
        { id: '6', name: 'Post video on thread, instagram, youtube and pinterest', completed: false },
        { id: '7', name: 'Lunch & Relaxation', timeRange: '1:00 - 2:00 pm', completed: false },
        { id: '8', name: 'Reading deep focus', timeRange: '2:00 - 5:30pm', completed: false },
        { id: '9', name: 'Light Activity / Socializing / break', timeRange: '5:30 - 6:30pm', completed: false },
        { id: '10', name: 'Dinner & Wind Down', timeRange: '6:30 - 7:30pm', completed: false },
        { id: '11', name: 'Reading or Reflection Time', timeRange: '7:30 - 9:30pm', completed: false },
        { id: '12', name: 'Prayer & Mental Reset', timeRange: '9:30 - 10:00pm', completed: false },
        { id: '13', name: 'Gym Workout', timeRange: '10:00 - 11:10pm', completed: false },
        { id: '14', name: 'Post Gym Refresh & Snacks', timeRange: '11:10 - 11:30pm', completed: false },
        { id: '15', name: 'Sleep', timeRange: '11:30pm', completed: false }
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
        { id: '5', name: 'Church Service', timeRange: '10:00am - 2:00pm (Church)', completed: false },
        { id: '6', name: 'Eat', timeRange: '2:00 - 3:00pm', completed: false },
        { id: '7', name: 'Reading Session', timeRange: '3:00 - 7:30pm', completed: false },
        { id: '8', name: 'Prayer & Mental Reset', timeRange: '7:30 - 8:00 pm', completed: false },
        { id: '9', name: 'Relax & Prepare for Sleep (No screen, light activity, or meditation)', timeRange: '8:00 - 9:00pm', completed: false },
        { id: '10', name: 'Light Out, Sleep', timeRange: '9:00pm', completed: false }
      ]
    }
  }

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      try {
        const success = await notificationService.initialize()
        setNotificationStatus(success ? 'granted' : 'denied')
        
        if (success) {
          
        } else {
          
        }
      } catch (error) {
        console.error('Error initializing notifications:', error)
        setNotificationStatus('unsupported')
      }
    }
    
    initNotifications()
  }, [])

  // Load and sync current day's agenda
  useEffect(() => {
    const loadCurrentDayAgenda = async () => {
      // Prevent duplicate loading
      if (isLoading || hasLoadedRef.current) {
        
        return
      }
      
      setIsLoading(true)
      hasLoadedRef.current = true
      
        try {
          const dateStr = format(currentDate, 'yyyy-MM-dd')
        const dayOfWeek = currentDate.getDay()
        



        
        // Determine which schedule to use
        let scheduleKey = 'weekday'
        if (dayOfWeek === 6) scheduleKey = 'saturday'  // Saturday
        else if (dayOfWeek === 0) scheduleKey = 'sunday'  // Sunday
        


        
        const schedule = schedules[scheduleKey]
        setCurrentSchedule(schedule)
        
        // Step 1: Check if today's tasks already exist in database

        const { data: existingTasksForToday, error } = await supabase
          .from('agenda_tasks')
          .select('*')
          .eq('date', dateStr)
        
        if (error) {
          console.error('Error checking database:', error)
          return
        }
        
        const todayTasksCount = existingTasksForToday?.length || 0

        
        if (todayTasksCount > 0) {
          // Step 2A: Load existing tasks from database (preserve completion status)
          
          
          // Map database tasks to our task format
          const loadedTasks = existingTasksForToday.map((dbTask: any) => ({
            id: dbTask.id,
            name: dbTask.title,
            timeRange: dbTask.description,
            completed: dbTask.completed
          }))
          
          setTasks(loadedTasks)
          
          
          
        } else {
          // Step 2B: Upload today's schedule to database (first time)
          
          
          
          let uploadedCount = 0
          for (const task of schedule.tasks) {
              await addAgendaTask({
                title: task.name,
                description: task.timeRange,
                completed: task.completed,
                date: dateStr,
                priority: 'medium'
              })
            uploadedCount++
          }
          
          
          // Set tasks in UI
          setTasks(schedule.tasks)
        }
        
                      } catch (error) {
        console.error('Error loading agenda:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCurrentDayAgenda()
  }, [currentDate])

  // Start notifications when tasks change
  useEffect(() => {
    if (tasks.length > 0 && notificationStatus === 'granted') {
      notificationService.startTaskNotifications(tasks)
    }
    
    return () => {
      notificationService.stopNotifications()
    }
  }, [tasks, notificationStatus])

  // Toggle task completion with auto-save
  const toggleTaskCompletion = async (taskId: string) => {
    try {
      // Set saving state
      setSavingTaskId(taskId)
      
      // Find the task before updating
      const taskToToggle = tasks.find(task => task.id === taskId)
      if (!taskToToggle) return
      
      // Update local state immediately for instant feedback
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
      setTasks(updatedTasks)
      
      // Find the toggled task
      const toggledTask = updatedTasks.find(task => task.id === taskId)
      if (!toggledTask) return
      
      // Auto-save to database
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      
      // Try to find the task in database by title and date
      const { data: existingTasks, error: searchError } = await supabase
        .from('agenda_tasks')
        .select('*')
        .eq('date', dateStr)
        .eq('title', toggledTask.name)
      
      if (searchError) {
        console.error('Error searching for task:', searchError)
        return
      }
      
      if (existingTasks && existingTasks.length > 0) {
        // Update existing task
        const { error: updateError } = await supabase
          .from('agenda_tasks')
          .update({ completed: toggledTask.completed })
          .eq('id', existingTasks[0].id)
        
        if (updateError) {
          console.error('Error updating task:', updateError)
          // Revert local state if database update failed
          setTasks(tasks)
          return
        }
        
        
      } else {
                        // Task not found in database
        // Revert local state if task not found in database
        setTasks(tasks)
      }
    } catch (error) {
      console.error('Error in auto-save:', error)
      // Revert local state on any error
      setTasks(tasks)
    } finally {
      // Clear saving state
      setSavingTaskId(null)
    }
  }

  // Date navigation functions
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 1)
    setCurrentDate(newDate)
    hasLoadedRef.current = false
    setIsLoading(false)
  }

  const goToNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 1)
    setCurrentDate(newDate)
    hasLoadedRef.current = false
    setIsLoading(false)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    hasLoadedRef.current = false
    setIsLoading(false)
  }



  const requestNotificationPermission = async () => {
    try {
      const success = await notificationService.initialize()
      setNotificationStatus(success ? 'granted' : 'denied')
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  // Helper functions for task categorization and styling
  const getTaskCategory = (taskName: string): Task['category'] => {
    const name = taskName.toLowerCase()
    
    if (name.includes('pray') || name.includes('bible') || name.includes('church')) return 'spiritual'
    if (name.includes('workout') || name.includes('gym') || name.includes('exercise')) return 'health'
    if (name.includes('work') || name.includes('job')) return 'work'
    if (name.includes('read') || name.includes('study')) return 'leisure'
    if (name.includes('sleep') || name.includes('bed')) return 'evening'
    if (name.includes('eat') || name.includes('lunch') || name.includes('dinner')) return 'morning'
    if (name.includes('clean') || name.includes('wash') || name.includes('bath')) return 'morning'
    
    // Time-based categorization
    const timeRange = taskName.toLowerCase()
    if (timeRange.includes('am') || timeRange.includes('morning')) return 'morning'
    if (timeRange.includes('pm') && !timeRange.includes('evening')) return 'work'
    if (timeRange.includes('evening') || timeRange.includes('night')) return 'evening'
    
    return 'morning'
  }

  const getTaskIcon = (category: Task['category']) => {
    switch (category) {
      case 'spiritual': return <Heart className="w-4 h-4" />
      case 'health': return <Dumbbell className="w-4 h-4" />
      case 'work': return <Workflow className="w-4 h-4" />
      case 'leisure': return <BookOpen className="w-4 h-4" />
      case 'evening': return <Moon className="w-4 h-4" />
      case 'morning': return <Sun className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getTaskColor = (category: Task['category']) => {
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

  const isCurrentTimeSlot = (timeRange?: string) => {
    if (!timeRange) return false
    
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes() // minutes since midnight
    
    // Parse time range (e.g., "3:00am - 4:00am", "4:00pm - 8:00pm")
    const timeMatch = timeRange.match(/(\d{1,2}):(\d{2})(am|pm)/gi)
    if (!timeMatch || timeMatch.length < 2) return false
    
    const startTime = timeMatch[0]
    const endTime = timeMatch[1]
    
    // Convert to minutes
    const parseTime = (timeStr: string) => {
      const match = timeStr.match(/(\d{1,2}):(\d{2})(am|pm)/i)
      if (!match) return 0
      
      let hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      const period = match[3].toLowerCase()
      
      if (period === 'pm' && hours !== 12) hours += 12
      if (period === 'am' && hours === 12) hours = 0
      
      return hours * 60 + minutes
    }
    
    const startMinutes = parseTime(startTime)
    const endMinutes = parseTime(endTime)
    
    return currentTime >= startMinutes && currentTime <= endMinutes
  }

  const isOverdue = (timeRange?: string) => {
    if (!timeRange) return false
    
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const timeMatch = timeRange.match(/(\d{1,2}):(\d{2})(am|pm)/gi)
    if (!timeMatch || timeMatch.length < 2) return false
    
    const endTime = timeMatch[1]
    
    const parseTime = (timeStr: string) => {
      const match = timeStr.match(/(\d{1,2}):(\d{2})(am|pm)/i)
      if (!match) return 0
      
      let hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      const period = match[3].toLowerCase()
      
      if (period === 'pm' && hours !== 12) hours += 12
      if (period === 'am' && hours === 12) hours = 0
      
      return hours * 60 + minutes
    }
    
    const endMinutes = parseTime(endTime)
    
    return currentTime > endMinutes
  }

  // Calculate completion rate
  const getCompletionRate = () => {
    if (tasks.length === 0) return 0
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
  }

  if (!currentSchedule) return null

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Calendar className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-blue-500" />
            Daily Agenda
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            {format(currentDate, 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
          {/* Progress Section */}
          <div className="text-center sm:text-right">
            <div className="text-xl md:text-2xl font-bold text-blue-500">{getCompletionRate()}%</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">Completed</div>
            
            {/* Progress Bar */}
            <div className="w-full sm:w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto sm:mx-0">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
                style={{ width: `${getCompletionRate()}%` }}
              />
            </div>
          </div>
            
          {/* Notification Status */}
          <div className="text-center sm:text-left">
            <div className="text-xs">
              {notificationStatus === 'granted' ? (
                <div className="flex items-center justify-center sm:justify-start text-green-600 dark:text-green-400">
                  <Bell className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Notifications ON</span>
                  <span className="sm:hidden">ON</span>
                </div>
              ) : notificationStatus === 'denied' ? (
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-red-600 dark:text-red-400">
                  <div className="flex items-center">
                    <Bell className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Notifications OFF</span>
                    <span className="sm:hidden">OFF</span>
                  </div>
                  <button
                    onClick={requestNotificationPermission}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                    title="Request permission"
                  >
                    Enable
                  </button>
                </div>
              ) : notificationStatus === 'unsupported' ? (
                <div className="flex items-center justify-center sm:justify-start text-gray-500 dark:text-gray-400">
                  <Bell className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Not supported</span>
                  <span className="sm:hidden">N/A</span>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start text-gray-500 dark:text-gray-400">
                  <Bell className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Loading...</span>
                  <span className="sm:hidden">...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 md:mb-6">
        <button
          onClick={goToPreviousDay}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center font-medium"
        >
          <span className="mr-2">←</span>
          <span className="hidden sm:inline">Previous Day</span>
          <span className="sm:hidden">Previous</span>
        </button>
        
        <button
          onClick={goToToday}
          className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Today
        </button>
        
        <button
          onClick={goToNextDay}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center font-medium"
        >
          <span className="hidden sm:inline">Next Day</span>
          <span className="sm:hidden">Next</span>
          <span className="ml-2">→</span>
        </button>
      </div>

      {/* Schedule Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 md:mb-6 space-y-2 sm:space-y-0">
          <div className="flex items-center flex-1">
            <span className="text-xl md:text-2xl mr-2 md:mr-3">{currentSchedule.emoji}</span>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
              {currentSchedule.day} Schedule
            </h2>
          </div>
          <div className="flex items-center justify-center sm:justify-end">
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 mr-2" />
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <span className="hidden sm:inline">5-min notifications enabled</span>
              <span className="sm:hidden">Notifications enabled</span>
            </span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2 md:space-y-3">
          {tasks.map((task) => {
            const category = getTaskCategory(task.name)
            const isCurrent = isCurrentTimeSlot(task.timeRange)
            const isOverdueTask = isOverdue(task.timeRange)
            
            return (
            <div
              key={task.id}
                className={`flex items-start p-3 md:p-4 rounded-lg border transition-all relative ${
                task.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md'
                    : isOverdueTask
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600'
                    : getTaskColor(category)
                } ${!task.completed && !isCurrent && !isOverdueTask ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
              >
                {/* Current time indicator */}
                {isCurrent && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                )}
                
                {/* Overdue indicator */}
                {isOverdueTask && !task.completed && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
                
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                  className="mr-3 md:mr-4 flex-shrink-0 relative p-1 -m-1 touch-manipulation"
                title="Toggle completion"
                  disabled={savingTaskId === task.id}
              >
                  {savingTaskId === task.id ? (
                    <div className="w-6 h-6 md:w-7 md:h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : task.completed ? (
                  <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 md:w-7 md:h-7 text-gray-400 hover:text-green-500" />
                )}
              </button>
              
                {/* Task Icon - Hidden on mobile to save space */}
                <div className="mr-3 flex-shrink-0 hidden sm:block">
                  {getTaskIcon(category)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm md:text-base leading-relaxed ${
                    task.completed 
                      ? 'line-through text-gray-500' 
                      : isCurrent 
                      ? 'text-blue-900 dark:text-blue-100' 
                      : isOverdueTask 
                      ? 'text-red-900 dark:text-red-100' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="break-words">{task.name}</span>
                      <div className="flex items-center mt-1 sm:mt-0 sm:ml-2">
                        {isCurrent && (
                          <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full animate-pulse mr-2">
                            NOW
                          </span>
                        )}
                        {isOverdueTask && !task.completed && (
                          <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                            OVERDUE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {task.timeRange && (
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                      <span className="break-words">{task.timeRange}</span>
                    </div>
                  )}
                </div>
            </div>
            )
          })}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
          <div className="text-xl md:text-2xl font-bold text-blue-500">{tasks.filter(t => t.completed).length}</div>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            <span className="hidden sm:inline">Tasks </span>Completed
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
          <div className="text-xl md:text-2xl font-bold text-orange-500">{tasks.filter(t => !t.completed).length}</div>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            <span className="hidden sm:inline">Tasks </span>Remaining
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyAgenda