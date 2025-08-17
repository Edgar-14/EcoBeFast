'use client';

import React from 'react';
import { cn } from '@/lib/utils/helpers';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'befast';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    header,
    footer,
    children,
    padding = 'lg',
    shadow = 'md',
    hover = false,
    ...props
  }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    };

    const shadows = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      befast: 'shadow-befast'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-lg border border-gray-200',
          shadows[shadow],
          hover && 'transition-shadow duration-300 hover:shadow-lg',
          className
        )}
        {...props}
      >
        {header && (
          <div className="px-6 py-4 border-b border-gray-200 rounded-t-lg bg-gray-50">
            {header}
          </div>
        )}

        <div className={paddings[padding]}>
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 rounded-b-lg bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
