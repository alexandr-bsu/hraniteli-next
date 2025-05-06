import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';
import { COLORS } from '@/shared/constants/colors';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variantStyles = {
  primary: `bg-[${COLORS.primary}] text-[${COLORS.white}] hover:bg-[${COLORS.primaryHover}]`,
  secondary: `bg-[${COLORS.background}] text-[${COLORS.text.primary}] hover:bg-[${COLORS.backgroundHover}]`,
  outline: `border border-[${COLORS.border}] text-[${COLORS.primary}] hover:bg-[${COLORS.background}]`,
};

const sizeStyles = {
  sm: 'px-[15px] py-[8px] text-[14px]',
  md: 'px-[20px] py-[12px] text-[16px]',
  lg: 'px-[30px] py-[15px] text-[18px]',
};

export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'rounded-[10px] font-normal leading-[22px] transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}; 