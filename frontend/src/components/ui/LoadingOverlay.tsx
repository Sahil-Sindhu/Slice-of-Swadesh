import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * Design System - LoadingOverlay Component
 *
 * Full-screen loading state used for page transitions and auth loading.
 * Shows brand logo + spinner + optional message.
 */
export interface LoadingOverlayProps {
  message?: string;
  className?: string;
  /** If true, renders inline (not full-screen fixed) */
  inline?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
  className,
  inline = false,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-5',
        inline
          ? 'w-full py-20'
          : 'fixed inset-0 z-[9999] bg-[#FFFBF5]/90 backdrop-blur-sm',
        className
      )}
      role="status"
      aria-label={message}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E8441A] to-[#F59E0B] flex items-center justify-center shadow-[0_12px_40px_-4px_rgba(232,68,26,0.22)]">
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>

      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-4 border-[#F0E6D8]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E8441A] animate-spin" />
      </div>

      <p className="text-sm font-semibold text-[#8C6E5A]">{message}</p>
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';
