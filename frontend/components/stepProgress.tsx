import React from 'react';
import { cn } from '@/lib/utils';

interface StepProgressProps {
  steps: number;
  currentStep: number;
  className?: string;
}

const StepProgress: React.FC<StepProgressProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("step-indicator", className)}>
      {Array.from({ length: steps }).map((_, index) => (
        <div 
          key={index}
          className={cn(
            "step-indicator-item",
            index <= currentStep ? "step-indicator-item-active" : ""
          )}
        />
      ))}
    </div>
  );
};

export default StepProgress;