import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

// Define button variants using plain CSS classes
const getButtonVariantClasses = (
  variant: ButtonProps['variant'] = 'default',
  size: ButtonProps['size'] = 'default',
  className?: string
) => {
  // Base classes
  let classes = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  // Variant classes
  switch (variant) {
    case 'default':
      classes += " bg-blue-600 text-white hover:bg-blue-700";
      break;
    case 'destructive':
      classes += " bg-red-600 text-white hover:bg-red-700";
      break;
    case 'outline':
      classes += " border border-blue-600 text-blue-600 hover:bg-blue-600/10";
      break;
    case 'secondary':
      classes += " bg-blue-100 text-blue-900 hover:bg-blue-200";
      break;
    case 'ghost':
      classes += " text-white hover:bg-gray-800/50";
      break;
    case 'link':
      classes += " text-blue-600 underline-offset-4 hover:underline";
      break;
  }
  
  // Size classes
  switch (size) {
    case 'default':
      classes += " h-10 px-4 py-2";
      break;
    case 'sm':
      classes += " h-9 rounded-md px-3";
      break;
    case 'lg':
      classes += " h-11 rounded-md px-8";
      break;
    case 'icon':
      classes += " h-10 w-10";
      break;
  }
  
  // Add custom classes
  if (className) {
    classes += ` ${className}`;
  }
  
  return classes;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    // If asChild is true, render as a div
    if (asChild) {
      return (
        <div 
          className={cn(getButtonVariantClasses(variant, size, className))}
          {...props as any}
        />
      );
    }
    
    // Otherwise render as a button
    return (
      <button
        ref={ref}
        className={cn(getButtonVariantClasses(variant, size, className))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button"; 