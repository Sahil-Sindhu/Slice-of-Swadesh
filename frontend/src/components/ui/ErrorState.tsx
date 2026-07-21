import * as React from 'react';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error loading the data.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border-2 border-[#F0E6D8] ${className}`}>
      <div className="w-16 h-16 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center text-red-500 mb-6">
        <AlertCircle size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-black text-[#1A1208] mb-2 font-[family-name:var(--font-outfit)]">{title}</h3>
      <p className="text-sm text-[#8C6E5A] mb-8 max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
