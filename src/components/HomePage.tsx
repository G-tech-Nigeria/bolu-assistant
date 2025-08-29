import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Code, Activity, MessageCircle, FileText, Droplets, Clock, TrendingUp, Leaf } from 'lucide-react'
import { CalendarEvent } from './Calendar'
import { format } from 'date-fns'
import BMLogo from './BMLogo'
import Loader from './Loader'
import EncouragingWords from './EncouragingWords'
import BibleVerse from './BibleVerse'

import { getAgendaTasks, getPlants, getHealthHabits, getDevRoadmapDailyLogs, getDevRoadmapUserStats, getCalendarEvents } from '../lib/database'

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])
  const [greeting, setGreeting] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  
  // Statistics from different apps
  const [taskCompletion, setTaskCompletion] = useState(0)
  const [devStats, setDevStats] = useState({ totalHours: 0, leetcodeSolved: 0, currentStreak: 0 })
  const [plantStats, setPlantStats] = useState({ careTasks: 0, needWater: 0, totalPlants: 0 })
  const [healthStats, setHealthStats] = useState({ gymStreak: 0, waterIntake: 0, waterTarget: 8 })

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

    // Load and update events from database
    const loadEvents = async () => {
      try {

        const dbEvents = await getCalendarEvents()
        
        if (dbEvents.length > 0) {
          const events = dbEvents.map((event: any) => ({
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
              // Include only events that start today
              const eventStartDate = new Date(event.startDate)
              return eventStartDate >= today && eventStartDate < tomorrow
            })
            .sort((a: any, b: any) => a.startDate.getTime() - b.startDate.getTime())

          
          setUpcomingEvents(todaysEvents)
        } else {
          
          setUpcomingEvents([])
        }
      } catch (error) {
        console.error('Error loading calendar events:', error)
        setUpcomingEvents([])
      }
    }

    // Load statistics from different apps
    const loadStatistics = async () => {
      
      try {
        // Calculate task completion percentage from agenda
        const today = format(new Date(), 'yyyy-MM-dd')
        const dbTasks = await getAgendaTasks(today)
        if (dbTasks.length > 0) {
          const completedTasks = dbTasks.filter((task: any) => task.completed).length
          const totalTasks = dbTasks.length
          const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          
          setTaskCompletion(percentage)
        } else {
          
          setTaskCompletion(0)
        }

        // Load Dev Roadmap statistics from database
        try {
  
          const userStats = await getDevRoadmapUserStats()
          const dailyLogs = await getDevRoadmapDailyLogs()
          
          if (userStats) {

            setDevStats({
              totalHours: userStats.total_hours || 0,
              leetcodeSolved: userStats.total_leetcode_solved || 0,
              currentStreak: userStats.current_streak || 0
            })
          } else if (dailyLogs.length > 0) {
            // Fallback: calculate from daily logs if user stats not available
            const totalHours = dailyLogs.reduce((sum: number, log: any) => sum + (log.hours_spent || 0), 0)
            const leetcodeSolved = dailyLogs.reduce((sum: number, log: any) => sum + (log.leetcode_problems || 0), 0)
            
            // Calculate current streak
            let currentStreak = 0
            const sortedLogs = dailyLogs.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            
            for (const log of sortedLogs) {
              if ((log.hours_spent || 0) > 0 || (log.leetcode_problems || 0) > 0) {
                currentStreak++
              } else {
                break
              }
            }
            
            
            setDevStats({
              totalHours,
              leetcodeSolved,
              currentStreak
            })
          } else {

            setDevStats({ totalHours: 0, leetcodeSolved: 0, currentStreak: 0 })
          }
        } catch (error) {
          console.error('Error loading dev roadmap stats:', error)
          setDevStats({ totalHours: 0, leetcodeSolved: 0, currentStreak: 0 })
        }

        // Load Plant Care statistics
        const dbPlants = await getPlants()
        if (dbPlants.length > 0) {
          const totalPlants = dbPlants.length || 0
          
          // Count total care tasks across all plants
          const careTasks = dbPlants.reduce((total: number, plant: any) => {
            return total + (plant.care_tasks ? plant.care_tasks.length : 0)
          }, 0)
          
          // Count plants that need water
          const needWater = dbPlants.filter((plant: any) => {
            const nextWatering = new Date(plant.next_watering)
            return nextWatering <= new Date()
          }).length
          
          
          setPlantStats({ careTasks, needWater, totalPlants })
        } else {
          
          setPlantStats({ careTasks: 0, needWater: 0, totalPlants: 0 })
        }

                // Load Health & Habits statistics
        const gymData = await getHealthHabits('gym')
        const waterData = await getHealthHabits('water', today)
        
        if (gymData.length > 0 && Array.isArray(gymData[0].data) && gymData[0].data.length > 0) {
          const gymDays = gymData[0].data
          
          // Calculate gym streak using the same logic as HealthHabits
          
          // Sort days by date (newest first)
          const sortedDays = [...gymDays].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          
          let streak = 0
          
          // Find the most recent completed day
          const mostRecentCompleted = sortedDays.find((day: any) => day.completed)
          
          if (mostRecentCompleted) {
            // Start from the most recent completed day and go backwards
            const startDate = new Date(mostRecentCompleted.date)
            
            // Check consecutive days backwards from the most recent completed day
            for (let i = 0; i < 30; i++) { // Check up to 30 days back
              const checkDate = new Date(startDate)
              checkDate.setDate(startDate.getDate() - i)
              const dateString = checkDate.toISOString().split('T')[0]
              const dayEntry = sortedDays.find((day: any) => day.date === dateString)
              
              if (dayEntry && dayEntry.completed) {
                streak++
              } else {
                // Either no entry or not completed - streak broken
                break
              }
            }
          }
          
          
          setHealthStats(prev => ({ ...prev, gymStreak: streak }))
        } else {
          
          setHealthStats(prev => ({ ...prev, gymStreak: 0 }))
        }
        
        // Load water intake data
        if (waterData.length > 0) {
          const todayWater = waterData[0].data.find((entry: any) => entry.date === today)
          if (todayWater) {
            const completedGlasses = todayWater.scheduledIntakes
              ?.filter((intake: any) => intake.completed)
              ?.reduce((total: number, intake: any) => total + intake.glasses, 0) || 0
            

            setHealthStats(prev => ({ 
              ...prev, 
              waterIntake: completedGlasses,
              waterTarget: todayWater.target || 8
            }))
          } else {
            
            setHealthStats(prev => ({ ...prev, waterIntake: 0, waterTarget: 8 }))
          }
        } else {
          
          setHealthStats(prev => ({ ...prev, waterIntake: 0, waterTarget: 8 }))
        }
      } catch (error) {
        console.error('Error loading statistics:', error)
      }
    }

    // Initial load
    const initializeData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([loadEvents(), loadStatistics()])
      } catch (error) {
        console.error('Error initializing data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()

    // Load data every minute to keep them current
    const eventTimer = setInterval(() => {
      loadEvents()
      loadStatistics()
    }, 60000)

    return () => {
      clearInterval(timer)
      clearInterval(eventTimer)
    }
  }, [])

  // const getEventTypeIcon = (type: string) => {
  //   switch (type) {
  //     case 'meeting':
  //       return <Calendar className="w-5 h-5 text-blue-500" />
  //     case 'task':
  //       return <CheckCircle2 className="w-5 h-5 text-green-500" />
  //     case 'reminder':
  //       return <AlertCircle className="w-5 h-5 text-yellow-500" />
  //     default:
  //       return <Clock className="w-5 h-5 text-purple-500" />
  //   }
  // }

  const quickActions = [
    {
      title: 'Calendar',
      description: 'Advanced calendar with Google sync & multiple views',
      icon: Calendar,
      color: 'bg-blue-500',
      href: '/calendar'
    },
    {
      title: 'Daily Agenda',
      description: 'Your structured daily routine & time blocks',
      icon: MessageCircle,
      color: 'bg-green-500',
      href: '/agenda'
    },
    {
      title: 'Notes',
      description: 'Quick notes, ideas, and thoughts',
      icon: FileText,
      color: 'bg-indigo-500',
      href: '/notes'
    },
    {
      title: 'Dev Roadmap',
      description: 'Track your software engineering progress',
      icon: Code,
      color: 'bg-purple-500',
      href: '/dev-roadmap'
    }
  ]

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Loader message="Loading your dashboard..." size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8 md:py-12">
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <Clock className="w-5 h-5 md:w-6 md:h-6 text-gray-500 mr-2" />
          <span className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
            {format(currentTime, 'EEEE, MMMM do, yyyy • h:mm:ss a')}
          </span>
        </div>

        <div className="flex items-center justify-center mb-4 md:mb-6">
          <BMLogo size="lg" className="mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Bolu Assistant
          </h1>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {greeting}! 👋
        </h2>
        
        {/* Encouraging Words Slideshow */}
        <EncouragingWords />
        
        {/* Daily Bible Verse */}
        <div className="mt-8">
          <BibleVerse />
        </div>
      </div>

      {/* Today's Progress Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center mb-3 md:mb-4">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 mr-2 md:mr-3" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base">Today's Progress</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">{taskCompletion}%</p>
          <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300">Tasks completed</p>
        </div>

        <div className="p-4 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center mb-3 md:mb-4">
            <Code className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400 mr-2 md:mr-3" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 text-sm md:text-base">Dev Streak</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">{devStats.currentStreak}</p>
          <p className="text-xs md:text-sm text-purple-700 dark:text-purple-300">Days coding</p>
        </div>

        <div className="p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center mb-3 md:mb-4">
            <Leaf className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400 mr-2 md:mr-3" />
            <h3 className="font-semibold text-green-900 dark:text-green-100 text-sm md:text-base">Plants Need Water</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-100 mb-1">{plantStats.needWater}</p>
          <p className="text-xs md:text-sm text-green-700 dark:text-green-300">Need attention today</p>
        </div>

        <div className="p-4 md:p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl border border-pink-200 dark:border-pink-800">
          <div className="flex items-center mb-3 md:mb-4">
            <Droplets className="w-5 h-5 md:w-6 md:h-6 text-pink-600 dark:text-pink-400 mr-2 md:mr-3" />
            <h3 className="font-semibold text-pink-900 dark:text-pink-100 text-sm md:text-base">Water Intake</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-pink-900 dark:text-pink-100 mb-1">{healthStats.waterIntake}/{healthStats.waterTarget}</p>
          <p className="text-xs md:text-sm text-pink-700 dark:text-pink-300">Glasses today</p>
        </div>
      </div>



      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 card-hover cursor-pointer block"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg ${action.color} mr-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ml-auto" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {action.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {action.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Today's Events */}
      <div>
        <div className="flex items-center mb-6">
          <Calendar className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Today's Events
          </h2>
        </div>

        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''} today
                </div>
                <Link
                  to="/calendar"
                  className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center"
                >
                  View Calendar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              {/* Today's events list */}
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${event.category.color} mr-2`}></div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {event.title}
                      </h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{format(event.startDate, 'h:mm a')}</span>
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {event.description}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      📍 {event.location}
                    </p>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Calendar className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">No events scheduled for today</p>
              <Link
                to="/calendar"
                className="mt-4 inline-block px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Add an event for today
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dev Roadmap Stats */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Code className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dev Roadmap</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Hours</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{devStats.totalHours}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">LeetCode Solved</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{devStats.leetcodeSolved}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{devStats.currentStreak} days</span>
            </div>
          </div>
          <Link
            to="/dev-roadmap"
            className="mt-4 inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Plant Care Stats */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Leaf className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Plant Care</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Plants</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{plantStats.totalPlants || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Need Water</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{plantStats.needWater}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Care Tasks</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{plantStats.careTasks}</span>
            </div>
          </div>
          <Link
            to="/plant-care"
            className="mt-4 inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Health & Habits Stats */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-pink-600 dark:text-pink-400 mr-3" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Health & Habits</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Gym Streak</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{healthStats.gymStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Water Intake</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{healthStats.waterIntake}/{healthStats.waterTarget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{Math.round((healthStats.waterIntake / healthStats.waterTarget) * 100)}%</span>
            </div>
          </div>
          <Link
            to="/health-habits"
            className="mt-4 inline-flex items-center text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage