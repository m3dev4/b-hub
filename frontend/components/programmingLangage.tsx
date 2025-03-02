import React, { useEffect, useState } from 'react';

interface IconProps {
  name: string;
  position: { x: string; y: string };
  delay: number;
  duration: number;
  size: string;
}

const icons = [
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'Python', color: '#3776AB' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Rust', color: '#DEA584' },
  { name: 'Go', color: '#00ADD8' },
  { name: 'C++', color: '#00599C' },
  { name: 'Java', color: '#007396' },
  { name: 'Ruby', color: '#CC342D' },
  { name: 'PHP', color: '#777BB4' },
  { name: 'Swift', color: '#FA7343' },
  { name: 'Kotlin', color: '#7F52FF' },
  { name: 'AI', color: '#9580FF' },
];

const ProgrammingLanguageIcons: React.FC = () => {
  const [floatingIcons, setFloatingIcons] = useState<IconProps[]>([]);
  
  useEffect(() => {
    // Generate random positions for the icons
    const generateIcons = () => {
      return icons.map((icon, index) => {
        const randomX = `${10 + Math.random() * 80}%`;
        const randomY = `${10 + Math.random() * 80}%`;
        const randomDelay = Math.random() * 5;
        const randomDuration = 5 + Math.random() * 7;
        const randomSize = `${1 + Math.random() * 0.5}rem`;
        
        return {
          name: icon.name,
          position: { x: randomX, y: randomY },
          delay: randomDelay,
          duration: randomDuration,
          size: randomSize,
        };
      });
    };
    
    setFloatingIcons(generateIcons());
  }, []);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingIcons.map((icon, index) => {
        const iconColor = icons.find(i => i.name === icon.name)?.color || '#ffffff';
        
        return (
          <div
            key={index}
            className="absolute animate-float animate-pulse-glow"
            style={{
              left: icon.position.x,
              top: icon.position.y,
              animationDelay: `${icon.delay}s`,
              animationDuration: `${icon.duration}s`,
              fontSize: icon.size,
              zIndex: 1,
            }}
          >
            <div 
              className="cyber-glass rounded-full px-3 py-1 text-xs md:text-sm font-mono flex items-center justify-center"
              style={{
                border: `1px solid ${iconColor}40`,
                boxShadow: `0 0 10px ${iconColor}30`,
              }}
            >
              <span 
                className="mr-1"
                style={{ color: iconColor }}
              >
                •
              </span>
              {icon.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgrammingLanguageIcons;