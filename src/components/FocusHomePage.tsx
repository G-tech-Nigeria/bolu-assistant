import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Play, 
  Maximize2,
  Minimize2
} from 'lucide-react'

interface FocusHomePageProps {}

export default function FocusHomePage({}: FocusHomePageProps) {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Day-specific quotes
  const dayQuotes = {
    monday: "Monday motivation: Start the week with purpose and determination! 💪",
    tuesday: "Tuesday energy: Keep pushing forward, you're building momentum! 🚀",
    wednesday: "Wednesday wisdom: You're halfway there - stay focused! ⚡",
    thursday: "Thursday drive: Almost there, finish strong! 🔥",
    friday: "Friday finish: That's Friday done, Flocus User. Time for the weekend! 🎉",
    saturday: "Saturday serenity: Rest, recharge, and enjoy your well-deserved break! 🌟",
    sunday: "Sunday preparation: Reflect, plan, and get ready for a great week ahead! ✨"
  }

  // Motivational quotes for top right
  const motivationalQuotes = [
    "Surround yourself with positivity",
    "Focus on progress, not perfection",
    "Every expert was once a beginner",
    "Success is the sum of small efforts",
    "The future belongs to the focused",
    "Consistency is the key to mastery",
    "Your only limit is your mind",
    "Great things never come from comfort zones",
    "Focus on the journey, not the destination",
    "Excellence is not a skill, it's an attitude"
  ]

  // Get current day and time info
  const dayOfWeek = currentTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const timeString = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' })

  // Get random motivational quote
  const [motivationalQuote, setMotivationalQuote] = useState('')
  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setMotivationalQuote(randomQuote)
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Navigation handlers
  const handleGoToFocusTimer = () => {
    navigate('/focus-timer')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        {/* Additional gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/30 via-transparent to-pink-800/30"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-800/20 via-transparent to-blue-600/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        
        {/* Top Right Quote */}
        <div className="absolute top-20 right-6 max-w-xs text-right">
          <p className="text-white/90 text-lg font-medium leading-relaxed">
            "{motivationalQuote}"
          </p>
        </div>


        {/* Main Time Display */}
        <div className="text-center mb-8">
          <div className="text-8xl md:text-9xl font-bold text-white mb-4 drop-shadow-2xl">
            {timeString}
          </div>
        </div>

        {/* Day and Quote */}
        <div className="text-center max-w-2xl">
          <div className="text-white/90 text-xl md:text-2xl font-medium mb-4">
            {dayQuotes[dayOfWeek as keyof typeof dayQuotes]}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12">
          <button
            onClick={handleGoToFocusTimer}
            className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
          >
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6" />
              Start Focus Session
            </div>
          </button>
        </div>

      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-500"></div>
    </div>
  )
}
