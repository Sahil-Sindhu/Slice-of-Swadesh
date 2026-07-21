'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';
import { colors, radius, shadows } from '@/design-system';

/**
 * Design System — Modal Component
 *
 * One modal for everything: Delete / Edit / Confirmation / Food Details / Order Details.
 * Sizes: sm | md | lg | xl | full
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

const sizes: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  className,
  footer,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm animate-fade-in"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn('relative w-full bg-white rounded-[20px] shadow-[0_20px_60px_-8px_rgba(26,18,8,0.18)] animate-slide-up flex flex-col max-h-[90vh]', sizes[size], className)}
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          boxShadow: shadows.modal,
          border: `1px solid ${colors.border}`,
        }}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b flex-shrink-0" style={{ borderColor: colors.border }}>
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-bold leading-tight" style={{ color: colors.text }}>
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm mt-1" style={{ color: colors.text3 }}>{description}</p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#E8441A]/20"
                style={{ color: colors.text3 }}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex-shrink-0 px-6 py-4 border-t rounded-b-[20px]" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
