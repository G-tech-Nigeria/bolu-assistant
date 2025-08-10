import React from 'react'
import BMLogo from './BMLogo'

interface LoaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

const Loader: React.FC<LoaderProps> = ({ 
  message = "Loading your data...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="relative">
        {/* Spinning logo */}
        <div className={`${sizeClasses[size]} animate-spin`}>
          <BMLogo size={size} className="text-blue-500" />
        </div>
        
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-pulse"></div>
      </div>
      
      {/* Loading message */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">
          {message}
        </p>
        <div className="mt-3 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Loader
