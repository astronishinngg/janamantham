import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap';
    
    const variants = {
      primary: 'bg-[#0B2E59] text-white hover:bg-[#0B2E59]/90 shadow-sm focus-visible:ring-[#0B2E59]',
      secondary: 'bg-[#2F6BFF] text-white hover:bg-[#2F6BFF]/90 shadow-sm focus-visible:ring-[#2F6BFF]',
      accent: 'bg-[#00A8A8] text-white hover:bg-[#00A8A8]/90 shadow-sm focus-visible:ring-[#00A8A8]',
      outline: 'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] focus-visible:ring-[#E2E8F0]',
      ghost: 'bg-transparent text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]',
      danger: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';