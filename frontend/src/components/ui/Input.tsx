import * as React from 'react';
import { cn } from '../../utils/cn';
import { colors, radius } from '@/design-system';

/**
 * Design System — Input Component
 *
 * The ONLY input in the application. All forms use this.
 * Supports: label, error, helperText, required indicator, leftIcon, rightIcon,
 *           password toggle, disabled, loading states.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  loading?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName,
      disabled,
      required,
      id,
      loading,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const isDisabled = disabled || loading;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-semibold select-none flex items-center gap-1"
            style={{ color: colors.text2 }}
          >
            {label}
            {required && (
              <span className="text-sm leading-none" style={{ color: colors.danger }} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 pointer-events-none z-10" style={{ color: colors.muted }}>
              {leftIcon}
            </span>
          )}

          <input
            id={id}
            ref={ref}
            type={computedType}
            disabled={isDisabled}
            required={required}
            className={cn(
              'w-full border px-4 py-3 rounded-xl font-sans text-base transition-all duration-200',
              'focus:outline-none focus:ring-4 focus:ring-[#E8441A]/10',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#FFF5E9]',
              'placeholder:text-[#B5957D]',
              leftIcon && 'pl-11',
              (rightIcon || isPassword || loading) && 'pr-11',
              className
            )}
            style={{
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
              color: colors.text,
              borderRadius: radius.md,
            }}
            {...props}
          />

          {loading && (
            <span className="absolute right-3.5 pointer-events-none" style={{ color: colors.muted }}>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
          )}

          {isPassword && !isDisabled && !loading && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 cursor-pointer focus:outline-none select-none transition-colors duration-150"
              style={{ color: colors.text3 }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}

          {!isPassword && !loading && rightIcon && (
            <span className="absolute right-3.5 pointer-events-none" style={{ color: colors.muted }}>
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <span className="text-sm font-medium mt-0.5 flex items-center gap-1" style={{ color: colors.danger }}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </span>
        )}

        {helperText && !error && (
          <span className="text-xs mt-0.5" style={{ color: colors.text3 }}>{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
