import React, { useState, useEffect } from 'react'

const encouragingWords = [
  "You are capable of amazing things!",
  "Every step forward is progress.",
  "Your potential is limitless.",
  "Today is your day to shine!",
  "You have the power to create change.",
  "Believe in yourself and your abilities.",
  "Small actions lead to big results.",
  "You are stronger than you think.",
  "Success is within your reach.",
  "Keep pushing forward, you've got this!",
  "Your dedication will pay off.",
  "You are making a difference.",
  "Every challenge makes you stronger.",
  "Your future is bright and promising.",
  "You have what it takes to succeed.",
  "Stay focused on your goals.",
  "You are building something amazing.",
  "Your hard work is not in vain.",
  "You inspire others with your journey.",
  "Trust the process, trust yourself.",
  "You are on the right path.",
  "Your dreams are worth fighting for.",
  "You have overcome so much already.",
  "Your resilience is admirable.",
  "You are creating your own success story.",
  "Every day is a new opportunity.",
  "You have the courage to keep going.",
  "Your efforts are building your future.",
  "You are becoming the person you want to be.",
  "Your determination is unstoppable.",
  "You have the strength to persevere.",
  "Your journey is uniquely yours.",
  "You are making progress every day.",
  "Your potential is waiting to be unleashed.",
  "You have the wisdom to make good choices.",
  "Your passion drives you forward.",
  "You are capable of great achievements.",
  "Your commitment to growth is inspiring.",
  "You have the power to transform your life.",
  "Your positive attitude attracts success.",
  "You are building lasting habits.",
  "Your focus will lead to breakthroughs.",
  "You have the discipline to succeed.",
  "Your vision is becoming reality.",
  "You are taking control of your destiny.",
  "Your actions align with your goals.",
  "You have the energy to accomplish anything.",
  "Your mindset is your greatest asset.",
  "You are creating positive change.",
  "Your journey inspires others.",
  "You have the clarity to make decisions.",
  "Your progress is measurable and real.",
  "You are developing valuable skills.",
  "Your confidence grows with each step.",
  "You have the creativity to solve problems.",
  "Your determination sets you apart.",
  "You are building a legacy of success.",
  "Your efforts compound over time.",
  "You have the resilience to bounce back.",
  "Your growth mindset opens doors.",
  "You are becoming unstoppable.",
  "Your habits shape your future.",
  "You have the courage to take risks.",
  "Your persistence pays dividends.",
  "You are creating opportunities.",
  "Your positive energy is contagious.",
  "You have the wisdom to learn from setbacks.",
  "Your focus creates momentum.",
  "You are developing mental strength.",
  "Your actions speak louder than words.",
  "You have the power to influence others.",
  "Your journey is worth every step.",
  "You are building confidence daily.",
  "Your potential is exponential.",
  "You have the drive to keep improving.",
  "Your success is inevitable.",
  "You are becoming your best self.",
  "Your determination is unshakeable.",
  "You have the vision to see possibilities.",
  "Your hard work creates opportunities.",
  "You are developing leadership qualities.",
  "Your positive mindset attracts success.",
  "You have the strength to overcome obstacles.",
  "Your progress inspires others.",
  "You are creating lasting impact.",
  "Your dedication is admirable.",
  "You have the power to change lives.",
  "Your journey is uniquely powerful.",
  "You are building something extraordinary.",
  "Your efforts are creating ripples.",
  "You have the courage to dream big.",
  "Your persistence is your superpower.",
  "You are becoming a force for good.",
  "Your growth is unstoppable.",
  "You have the wisdom to choose wisely.",
  "Your potential is beyond measure.",
  "You are creating your own path.",
  "Your determination lights the way.",
  "You have the power to inspire change.",
  "Your journey is transforming lives.",
  "You are becoming a role model.",
  "Your success story is being written.",
  "You have the strength to carry others.",
  "Your vision is becoming reality.",
  "You are building a brighter future.",
  "Your impact reaches far and wide.",
  "You have the power to make history.",
  "Your legacy is being created now.",
  "You are becoming legendary.",
  "Your potential knows no bounds.",
  "You have the power to change the world.",
  "Your journey is just beginning.",
  "You are unstoppable, unbreakable, and unlimited."
]

const EncouragingWords: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === encouragingWords.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Main encouraging word */}
          <div className="min-h-[80px] md:min-h-[100px] flex items-center justify-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed transition-all duration-1000 ease-in-out">
              {encouragingWords[currentIndex]}
            </h2>
          </div>
          
          {/* Progress dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {encouragingWords.slice(0, 20).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex % 20 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentIndex(prev => 
              prev === 0 ? encouragingWords.length - 1 : prev - 1
            )}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Previous message"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentIndex(prev => 
              prev === encouragingWords.length - 1 ? 0 : prev + 1
            )}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Next message"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Counter */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {currentIndex + 1} of {encouragingWords.length} encouraging messages
        </div>
      </div>
    </div>
  )
}

export default EncouragingWords
