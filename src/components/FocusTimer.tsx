import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Clock, Maximize2, Minimize2, X } from 'lucide-react'

interface FocusTimerProps {
  defaultDuration?: number // in minutes
  dailyGoal?: number // in hours
}

export default function FocusTimer({ defaultDuration = 25, dailyGoal = 5 }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(defaultDuration * 60) // in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [todayMinutes, setTodayMinutes] = useState(0)
  const [originalTime, setOriginalTime] = useState(defaultDuration * 60)
  const [isFullScreen, setIsFullScreen] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Calculate progress percentages
  const sessionProgress = ((originalTime - timeLeft) / originalTime) * 100
  const dailyProgress = (todayMinutes / (dailyGoal * 60)) * 100

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Start timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      setIsPaused(false)
      startTimeRef.current = Date.now()
      
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            setIsPaused(false)
            setCompletedSessions(prev => prev + 1)
            setTodayMinutes(prev => prev + (originalTime / 60))
            
            // Play notification sound or show notification
            if (Notification.permission === 'granted') {
              new Notification('Focus Timer Complete!', {
                body: 'Great job! Your focus session is complete.',
                icon: '/logo.png'
              })
            }
            
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  // Pause timer
  const pauseTimer = () => {
    if (isRunning && !isPaused) {
      clearInterval(intervalRef.current!)
      setIsPaused(true)
    }
  }

  // Resume timer
  const resumeTimer = () => {
    if (isRunning && isPaused) {
      setIsPaused(false)
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            setIsPaused(false)
            setCompletedSessions(prev => prev + 1)
            setTodayMinutes(prev => prev + (originalTime / 60))
            
            if (Notification.permission === 'granted') {
              new Notification('Focus Timer Complete!', {
                body: 'Great job! Your focus session is complete.',
                icon: '/logo.png'
              })
            }
            
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current!)
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(originalTime)
  }

  // Change duration
  const changeDuration = (minutes: number) => {
    if (!isRunning) {
      setOriginalTime(minutes * 60)
      setTimeLeft(minutes * 60)
    }
  }

  // Toggle full screen
  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev)
  }

  // Exit full screen explicitly
  const exitFullScreen = () => {
    setIsFullScreen(false)
  }

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    if (isFullScreen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isFullScreen])

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Full Screen Mode
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            backgroundSize: '400px 400px'
          }}></div>
        </div>

        {/* Header */}
        <div className="fixed top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-60 bg-gradient-to-r from-black/40 to-transparent backdrop-blur-md">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={exitFullScreen}
              className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Full Screen</span>
              <span className="sm:hidden">Exit</span>
            </button>
            <div className="h-6 w-px bg-white/20"></div>
            <span className="text-white/80 text-xs sm:text-sm font-medium">Focus Mode Active</span>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-white/60">Daily Goal</div>
              <div className="text-sm sm:text-lg font-bold text-white">{Math.floor(todayMinutes)}m / {dailyGoal}h</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-white/60">Sessions</div>
              <div className="text-sm sm:text-lg font-bold text-white">{completedSessions}</div>
            </div>
          </div>
        </div>

        {/* Main Timer */}
        <div className="pt-20 sm:pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center px-4 sm:px-6">
            {/* Large Circular Timer */}
            <div className="relative mb-6 sm:mb-8">
              <svg className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - sessionProgress / 100)}`}
                  className="transition-all duration-1000 ease-out drop-shadow-lg"
                />
              </svg>
              
              {/* Timer text overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                    <span className="text-5xl sm:text-6xl md:text-8xl font-bold text-white drop-shadow-2xl">
                      {formatTime(timeLeft)}
                    </span>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-white/80 mb-1 sm:mb-2">
                    / {Math.floor(originalTime / 60)}m planned
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-white/60">
                    {Math.round(sessionProgress)}% complete
                  </p>
                </div>
              </div>
            </div>

            {/* Large Timer Controls */}
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 shadow-2xl hover:scale-105"
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ml-1 sm:ml-2" />
                </button>
              ) : isPaused ? (
                <button
                  onClick={resumeTimer}
                  className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 shadow-2xl hover:scale-105"
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ml-1 sm:ml-2" />
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-all duration-300 shadow-2xl hover:scale-105"
                >
                  <Pause className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full transition-all duration-300 shadow-xl"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Session Progress Bar */}
            <div className="w-64 sm:w-80 md:w-96 mx-auto mb-6 sm:mb-8">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-white/80 text-sm sm:text-base md:text-lg">Session Progress</span>
                <span className="text-white/80 text-sm sm:text-base md:text-lg">{Math.floor(originalTime / 60)}m</span>
              </div>
              <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-2 sm:h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${sessionProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Duration Buttons */}
            <div className="flex justify-center space-x-2 sm:space-x-4">
              {[15, 25, 45, 60].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => changeDuration(minutes)}
                  disabled={isRunning}
                  className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-sm sm:text-base md:text-lg font-medium rounded-lg sm:rounded-xl transition-all duration-300 ${
                    Math.floor(originalTime / 60) === minutes
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {minutes}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-60 bg-gradient-to-r from-transparent to-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-8">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-white/60">Current Session</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-white">{Math.floor(originalTime / 60)} minutes</div>
            </div>
            <div className="h-8 sm:h-12 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-white/60">Daily Progress</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-white">{Math.round(dailyProgress)}%</div>
            </div>
            <div className="h-8 sm:h-12 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-white/60">Status</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-white">
                {!isRunning ? 'Ready' : isPaused ? 'Paused' : 'Focusing'}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Regular Mode
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-200 dark:border-gray-700 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Focus Timer</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleFullScreen}
            className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-3 text-sm lg:text-base bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px] touch-manipulation"
          >
            <Maximize2 className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="hidden sm:inline">Full Screen</span>
            <span className="sm:hidden">Full</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-3 text-sm lg:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] touch-manipulation">
            <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="hidden sm:inline">History</span>
            <span className="sm:hidden">Hist</span>
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center mb-4 sm:mb-6 lg:mb-8 flex-1">
        {/* Circular Timer */}
        <div className="relative mb-4 sm:mb-6">
          <svg className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
              className="dark:stroke-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - sessionProgress / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Timer text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white">
                  {formatTime(timeLeft)}
                </span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-yellow-400 rounded-full"></div>
              </div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 dark:text-gray-400">
                / {Math.floor(originalTime / 60)}m planned
              </p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                {Math.round(sessionProgress)}% done
              </p>
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 mb-4 sm:mb-6 lg:mb-8">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 min-h-[48px] min-w-[48px] touch-manipulation"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ml-0.5 sm:ml-1 lg:ml-2" />
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeTimer}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 min-h-[48px] min-w-[48px] touch-manipulation"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ml-0.5 sm:ml-1 lg:ml-2" />
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 min-h-[48px] min-w-[48px] touch-manipulation"
            >
              <Pause className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full transition-all duration-300 shadow-md hover:shadow-lg min-h-[40px] min-w-[40px] touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Session Progress Bar */}
        <div className="w-full mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <span className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Session Progress</span>
            <span className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">{Math.floor(originalTime / 60)}m</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 lg:h-4">
            <div 
              className="bg-green-500 h-2 sm:h-3 lg:h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${sessionProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg">Today's progress</h4>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 lg:h-4">
          <div 
            className="bg-blue-500 h-2 sm:h-3 lg:h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(dailyProgress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm lg:text-base">
          <span className="text-gray-600 dark:text-gray-400">
            {Math.floor(todayMinutes)}m / {dailyGoal}h
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {Math.round(dailyProgress)}%
          </span>
        </div>
      </div>

      {/* Quick Duration Buttons */}
      <div className="mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 lg:pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center space-x-1 sm:space-x-2 lg:space-x-3">
          {[15, 25, 45, 60].map((minutes) => (
            <button
              key={minutes}
              onClick={() => changeDuration(minutes)}
              disabled={isRunning}
              className={`px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base font-medium rounded-lg transition-all duration-300 hover:scale-105 min-h-[36px] min-w-[36px] touch-manipulation ${
                Math.floor(originalTime / 60) === minutes
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {minutes}m
            </button>
          ))}
        </div>
      </div>

      {/* Session Counter */}
      <div className="mt-3 sm:mt-4 lg:mt-6 text-center">
        <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400">
          Sessions completed today: <span className="font-medium text-green-600 dark:text-green-400">{completedSessions}</span>
        </p>
      </div>
    </div>
  )
}
