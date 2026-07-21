import * as React from 'react';
import { cn } from '../../utils/cn';
import { colors, radius, shadows } from '@/design-system';

/**
 * Design System — Button Component
 *
 * The ONLY button in the application. No duplicate buttons allowed.
 * Variants: primary | secondary | outline | ghost | danger | success | gradient
 * Sizes:    sm | md | lg | icon
 * States:   isLoading (built-in spinner) | disabled (via HTML attr)
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  floating?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      floating = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer border';

    const variants: Record<string, { backgroundColor: string; color: string; borderColor: string; boxShadow?: string }> = {
      primary: { backgroundColor: colors.primary, color: colors.surface, borderColor: colors.primary, boxShadow: shadows.card },
      secondary: { backgroundColor: 'transparent', color: colors.secondary, borderColor: colors.secondary, boxShadow: 'none' },
      outline: { backgroundColor: 'transparent', color: colors.text, borderColor: colors.border, boxShadow: 'none' },
      ghost: { backgroundColor: 'transparent', color: colors.text2, borderColor: 'transparent', boxShadow: 'none' },
      danger: { backgroundColor: colors.danger, color: colors.surface, borderColor: colors.danger, boxShadow: shadows.card },
      success: { backgroundColor: colors.success, color: colors.surface, borderColor: colors.success, boxShadow: shadows.card },
      gradient: { backgroundColor: colors.primary, color: colors.surface, borderColor: colors.primary, boxShadow: shadows.floating },
    };

    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-base gap-2',
      lg: 'px-7 py-3 text-lg gap-2.5',
      icon: 'p-2.5',
    };

    const resolvedVariant = variants[variant] ?? variants.primary;
    const floatingStyles = floating
      ? 'fixed bottom-6 right-6 z-50 rounded-full active:scale-95'
      : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizes[size], floatingStyles, className)}
        style={{
          backgroundColor: resolvedVariant.backgroundColor,
          color: resolvedVariant.color,
          borderColor: resolvedVariant.borderColor,
          borderRadius: radius.md,
          boxShadow: resolvedVariant.boxShadow,
        }}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {size !== 'icon' && children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
