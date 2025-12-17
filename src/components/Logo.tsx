import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
};

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/computra-logo.svg" 
        alt="Computra Logo" 
        className={sizeClasses[size]}
      />
      {showText && (
        <span className={`font-extrabold tracking-tight text-white ${textSizeClasses[size]}`}>
          Computra
        </span>
      )}
    </div>
  );
};

