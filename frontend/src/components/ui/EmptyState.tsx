import * as React from 'react';
import { Button } from './Button';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onReset?: () => void; // for backwards compatibility with some components
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  onReset,
  className = '',
}: EmptyStateProps) {
  const finalAction = action || (onReset ? { label: 'Reset', onClick: onReset } : undefined);

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border-2 border-[#F0E6D8] ${className}`}>
      <div className="w-16 h-16 bg-[#FFFBF5] rounded-2xl border border-[#F0E6D8] flex items-center justify-center text-[#B5957D] mb-6 shadow-sm">
        {icon || <PackageOpen size={32} strokeWidth={1.5} />}
      </div>
      <h3 className="text-xl font-black text-[#1A1208] mb-2 font-[family-name:var(--font-outfit)]">{title}</h3>
      {description && <p className="text-sm font-medium text-[#8C6E5A] mb-8 max-w-sm">{description}</p>}
      {finalAction && (
        <Button variant="outline" onClick={finalAction.onClick} className="mt-6">
          {finalAction.label}
        </Button>
      )}
    </div>
  );
}
