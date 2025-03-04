import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

const SkillChip: React.FC<SkillChipProps> = ({ label, onRemove, className }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full bg-secondary/80 text-sm font-medium text-foreground transition-all hover:bg-secondary animate-scale-in",
        className
      )}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors hover:bg-muted"
        >
          <X size={14} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
};

export default SkillChip;