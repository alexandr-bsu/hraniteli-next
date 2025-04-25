import { FC, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { COLORS } from '@/shared/constants/colors';

interface ChipProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export const Chip: FC<ChipProps> = ({ children, color = COLORS.primary, className }) => {
  return (
    <div
      className={cn(
        'px-3 py-1 rounded-full text-sm font-medium',
        className
      )}
      style={{ backgroundColor: color, color: COLORS.white }}
    >
      {children}
    </div>
  );
}; 