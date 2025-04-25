import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { COLORS } from '@/shared/constants/colors';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={cn('mb-2 block text-[14px] font-medium', error && `text-[${COLORS.error}]`)}>
            {label}
          </label>
        )}
        <input
          className={cn(
            'w-full rounded-[10px] border border-[${COLORS.border}] bg-[${COLORS.white}] px-[15px] py-[12px] text-[16px] text-[${COLORS.text.primary}] placeholder:text-[${COLORS.text.secondary}]',
            'focus:border-[${COLORS.primary}] focus:outline-none',
            error && `border-[${COLORS.error}]`,
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className={`mt-1 text-[12px] text-[${COLORS.error}]`}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input'; 