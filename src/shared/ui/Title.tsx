import { FC, ReactNode, createElement } from 'react';
import { cn } from '@/shared/lib/utils';

interface TitleProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  onClick?: () => void;
}

export const Title: FC<TitleProps> = ({ 
  children, 
  level = 1, 
  className,
  onClick 
}) => {
  return createElement(
    `h${level}`,
    { 
      className: cn(
        'font-bold',
        {
          'text-4xl': level === 1,
          'text-3xl': level === 2,
          'text-2xl': level === 3,
          'text-xl': level === 4,
          'text-lg': level === 5,
          'text-base': level === 6,
        },
        className
      ),
      onClick
    },
    children
  );
}; 