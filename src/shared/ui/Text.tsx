import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface TextProps {
  children: ReactNode;
  color?: string;
  weight?: number;
  className?: string;
}

export const Text: FC<TextProps> = ({ children, color, weight = 400, className }) => {
  return (
    <span
      className={clsx(className)}
      style={{
        color,
        fontWeight: weight,
      }}
    >
      {children}
    </span>
  );
}; 