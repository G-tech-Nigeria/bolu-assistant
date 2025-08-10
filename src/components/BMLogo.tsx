import React from 'react';

interface BMLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BMLogo: React.FC<BMLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-blue-500/20 hover:ring-4 hover:ring-blue-500/30 transition-all duration-300 ${className}`}>
      <div className="text-center">
        <span className={`font-bold text-white ${textSizes[size]} tracking-wider leading-none block`}>
          B
        </span>
        <span className={`font-bold text-white ${textSizes[size]} tracking-wider leading-none block`}>
          M
        </span>
      </div>
    </div>
  );
};

export default BMLogo; 