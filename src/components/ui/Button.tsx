'use client';

import React from 'react';
import { cn } from '@/lib/utils/helpers';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    children,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-gradient-to-r from-befast-primary to-amber-600 text-white hover:from-amber-600 hover:to-befast-primary focus:ring-befast-primary shadow-md hover:shadow-lg transform hover:scale-105',
      secondary: 'bg-befast-secondary text-white hover:bg-blue-600 focus:ring-befast-secondary shadow-md hover:shadow-lg',
      success: 'bg-befast-success text-white hover:bg-emerald-600 focus:ring-befast-success shadow-md hover:shadow-lg',
      danger: 'bg-befast-error text-white hover:bg-red-600 focus:ring-befast-error shadow-md hover:shadow-lg',
      outline: 'border-2 border-befast-primary text-befast-primary hover:bg-befast-primary hover:text-white focus:ring-befast-primary',
      ghost: 'text-befast-primary hover:bg-befast-primary hover:bg-opacity-10 focus:ring-befast-primary',
      link: 'text-befast-primary hover:text-amber-600 underline-offset-4 hover:underline focus:ring-befast-primary'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7'
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className={cn('animate-spin rounded-full border-2 border-white border-t-transparent', iconSizes[size], 'mr-2')} />
            Cargando...
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className={cn(iconSizes[size], children ? 'mr-2' : '')}>
                {icon}
              </span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className={cn(iconSizes[size], children ? 'ml-2' : '')}>
                {icon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
