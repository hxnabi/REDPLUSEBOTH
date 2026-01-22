import { useEffect, useState } from "react";

interface BodyHealthAnimationProps {
  percentage: number;
}

const BodyHealthAnimation = ({ percentage }: BodyHealthAnimationProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Calculate which body parts should be filled based on percentage
  const fillHeight = (100 - animatedPercentage) / 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
      {/* Percentage Display */}
      <div className="text-center">
        <div className="text-5xl font-bold text-blue-600 mb-2">
          {animatedPercentage.toFixed(1)}%
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Health Percentage
        </div>
      </div>

      {/* Body SVG Animation */}
      <div className="relative w-48 h-80">
        <svg
          viewBox="0 0 200 350"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Define gradient for fill effect */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset={`${fillHeight * 100}%`} stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset={`${fillHeight * 100}%`} stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.9" />
            </linearGradient>
            
            <clipPath id="bodyClip">
              {/* Head */}
              <circle cx="100" cy="30" r="20" />
              
              {/* Neck */}
              <rect x="95" y="48" width="10" height="15" />
              
              {/* Torso */}
              <ellipse cx="100" cy="110" rx="35" ry="50" />
              
              {/* Arms */}
              <rect x="65" y="75" width="12" height="70" rx="6" />
              <rect x="123" y="75" width="12" height="70" rx="6" />
              
              {/* Legs */}
              <rect x="80" y="155" width="15" height="90" rx="7" />
              <rect x="105" y="155" width="15" height="90" rx="7" />
              
              {/* Feet */}
              <ellipse cx="87.5" cy="250" rx="12" ry="8" />
              <ellipse cx="112.5" cy="250" rx="12" ry="8" />
            </clipPath>
          </defs>

          {/* Body outline (gray) */}
          <g opacity="0.3">
            {/* Head */}
            <circle cx="100" cy="30" r="20" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
            
            {/* Neck */}
            <rect x="95" y="48" width="10" height="15" fill="#d1d5db" />
            
            {/* Torso */}
            <ellipse cx="100" cy="110" rx="35" ry="50" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
            
            {/* Arms */}
            <rect x="65" y="75" width="12" height="70" rx="6" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
            <rect x="123" y="75" width="12" height="70" rx="6" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
            
            {/* Legs */}
            <rect x="80" y="155" width="15" height="90" rx="7" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
            <rect x="105" y="155" width="15" height="90" rx="7" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
            
            {/* Feet */}
            <ellipse cx="87.5" cy="250" rx="12" ry="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
            <ellipse cx="112.5" cy="250" rx="12" ry="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
          </g>

          {/* Filled body parts with gradient */}
          <g clipPath="url(#bodyClip)">
            <rect
              x="0"
              y="0"
              width="200"
              height="350"
              fill="url(#bodyGradient)"
              style={{
                transition: "all 0.8s ease-in-out"
              }}
            />
          </g>

          {/* Body outline (dark border) */}
          <g fill="none" stroke="#374151" strokeWidth="2.5">
            {/* Head */}
            <circle cx="100" cy="30" r="20" />
            
            {/* Torso */}
            <ellipse cx="100" cy="110" rx="35" ry="50" />
            
            {/* Arms */}
            <rect x="65" y="75" width="12" height="70" rx="6" />
            <rect x="123" y="75" width="12" height="70" rx="6" />
            
            {/* Legs */}
            <rect x="80" y="155" width="15" height="90" rx="7" />
            <rect x="105" y="155" width="15" height="90" rx="7" />
            
            {/* Feet */}
            <ellipse cx="87.5" cy="250" rx="12" ry="8" />
            <ellipse cx="112.5" cy="250" rx="12" ry="8" />
          </g>
        </svg>

        {/* Health indicator badges */}
        {animatedPercentage >= 75 && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 animate-bounce">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {animatedPercentage < 50 && animatedPercentage > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 animate-pulse">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Status message */}
      <div className="text-center">
        {animatedPercentage >= 80 && (
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Excellent Health Status
          </div>
        )}
        {animatedPercentage >= 50 && animatedPercentage < 80 && (
          <div className="flex items-center gap-2 text-yellow-600 font-semibold">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            Good Health Status
          </div>
        )}
        {animatedPercentage < 50 && animatedPercentage > 0 && (
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Needs Attention
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyHealthAnimation;

