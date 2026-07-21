import * as React from 'react';

export interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-[#E8441A] ${className}`} />
  );
}
