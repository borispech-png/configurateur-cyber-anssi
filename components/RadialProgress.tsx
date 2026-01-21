import React from 'react';

interface RadialProgressProps {
  score: number;
  size: number;
  strokeWidth: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ score, size, strokeWidth }) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  const clampedScore = Math.max(0, Math.min(score, 100));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 40) return { main: '#ef4444', text: 'text-red-600 dark:text-red-400 font-bold' };
    if (s < 70) return { main: '#f59e0b', text: 'text-yellow-600 dark:text-yellow-400 font-bold' };
    return { main: '#22c55e', text: 'text-green-600 dark:text-green-400 font-bold' };
  };

  const { main, text } = getColor(clampedScore);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          stroke={main}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.5s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={text} style={{ fontSize: `${size / 4.5}px` }}>
          {Math.round(clampedScore)}%
        </span>
      </div>
    </div>
  );
};

export default RadialProgress;
