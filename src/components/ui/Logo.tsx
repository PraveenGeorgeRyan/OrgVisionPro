import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 60 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        {/* Main circular frame */}
        <circle cx="30" cy="30" r="28" fill="#2DD4BF" stroke="white" strokeWidth="2" />
        
        {/* Organization tree visualization */}
        <circle cx="30" cy="15" r="6" fill="white" />
        <circle cx="20" cy="35" r="5" fill="white" />
        <circle cx="40" cy="35" r="5" fill="white" />
        <circle cx="30" cy="45" r="4" fill="white" />
        
        {/* Connecting lines */}
        <line x1="30" y1="21" x2="30" y2="25" stroke="white" strokeWidth="2" />
        <line x1="30" y1="25" x2="20" y2="30" stroke="white" strokeWidth="2" />
        <line x1="30" y1="25" x2="40" y2="30" stroke="white" strokeWidth="2" />
        <line x1="30" y1="25" x2="30" y2="41" stroke="white" strokeWidth="2" />
      </svg>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight">OrgVision</span>
        <span className="text-xs font-semibold leading-none">PRO</span>
      </div>
    </div>
  );
};

export default Logo;
