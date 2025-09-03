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
        <div className="fixed top-0 left-0 right-0 p-6 flex items-center justify-between z-[9999] bg-gradient-to-r from-black/40 to-transparent backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={exitFullScreen}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 shadow-2xl hover:scale-105 cursor-pointer font-semibold text-base relative"
              style={{ zIndex: 10000, position: 'relative' }}
            >
              <Minimize2 className="w-5 h-5" />
              <span>Exit Full Screen</span>
            </button>
            <div className="h-6 w-px bg-white/30"></div>
            <span className="text-white/90 text-sm font-medium">Focus Mode Active</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-white/60">Daily Goal</div>
              <div className="text-lg font-bold text-white">{Math.floor(todayMinutes)}m / {dailyGoal}h</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/60">Sessions</div>
              <div className="text-lg font-bold text-white">{completedSessions}</div>
            </div>
          </div>
        </div>

        {/* Main Timer */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">

            
            {/* Large Circular Timer */}
            <div className="relative mb-8">
              <svg className="w-96 h-96 transform -rotate-90" viewBox="0 0 100 100">
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
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <span className="text-8xl font-bold text-white drop-shadow-2xl">
                      {formatTime(timeLeft)}
                    </span>
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xl text-white/80 mb-2">
                    / {Math.floor(originalTime / 60)}m planned
                  </p>
                  <p className="text-lg text-white/60">
                    {Math.round(sessionProgress)}% complete
                  </p>
                </div>
              </div>
            </div>

            {/* Large Timer Controls */}
            <div className="flex items-center justify-center space-x-6 mb-8">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="flex items-center justify-center w-24 h-24 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 shadow-2xl hover:scale-105"
                >
                  <Play className="w-10 h-10 ml-2" />
                </button>
              ) : isPaused ? (
                <button
                  onClick={resumeTimer}
                  className="flex items-center justify-center w-24 h-24 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 shadow-2xl hover:scale-105"
                >
                  <Play className="w-10 h-10 ml-2" />
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex items-center justify-center w-24 h-24 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-all duration-300 shadow-2xl hover:scale-105"
                >
                  <Pause className="w-10 h-10" />
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full transition-all duration-300 shadow-xl"
              >
                <RotateCcw className="w-8 h-8" />
              </button>
            </div>

            {/* Session Progress Bar */}
            <div className="w-96 mx-auto mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/80 text-lg">Session Progress</span>
                <span className="text-white/80 text-lg">{Math.floor(originalTime / 60)}m</span>
              </div>
              <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${sessionProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Duration Buttons */}
            <div className="flex justify-center space-x-4">
              {[15, 25, 45, 60].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => changeDuration(minutes)}
                  disabled={isRunning}
                  className={`px-6 py-3 text-lg font-medium rounded-xl transition-all duration-300 ${
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
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-sm text-white/60">Current Session</div>
              <div className="text-lg font-bold text-white">{Math.floor(originalTime / 60)} minutes</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-sm text-white/60">Daily Progress</div>
              <div className="text-lg font-bold text-white">{Math.round(dailyProgress)}%</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-sm text-white/60">Status</div>
              <div className="text-lg font-bold text-white">
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Focus Timer</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleFullScreen}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Full Screen</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <Clock className="w-4 h-4" />
            <span>History</span>
        </button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center mb-6">
        {/* Circular Timer */}
        <div className="relative mb-4">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
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
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {formatTime(timeLeft)}
                </span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                / {Math.floor(originalTime / 60)}m planned
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {Math.round(sessionProgress)}% done
              </p>
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center space-x-4 mb-6">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-lg"
            >
              <Play className="w-6 h-6 ml-1" />
            </button>
          ) : isPaused ? (
          <button
              onClick={resumeTimer}
              className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-lg"
            >
              <Play className="w-6 h-6 ml-1" />
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center justify-center w-16 h-16 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors shadow-lg"
            >
              <Pause className="w-6 h-6" />
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Session Progress Bar */}
        <div className="w-full mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Session Progress</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{Math.floor(originalTime / 60)}m</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${sessionProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Today's progress</h4>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(dailyProgress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {Math.floor(todayMinutes)}m / {dailyGoal}h
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {Math.round(dailyProgress)}%
          </span>
        </div>
      </div>

      {/* Quick Duration Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center space-x-2">
          {[15, 25, 45, 60].map((minutes) => (
            <button
              key={minutes}
              onClick={() => changeDuration(minutes)}
              disabled={isRunning}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                Math.floor(originalTime / 60) === minutes
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {minutes}m
            </button>
          ))}
        </div>
      </div>

      {/* Session Counter */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sessions completed today: <span className="font-medium text-green-600 dark:text-green-400">{completedSessions}</span>
        </p>
      </div>
    </div>
  )
}
