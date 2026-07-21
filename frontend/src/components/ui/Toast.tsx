'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Design System - Toast Component + ToastProvider
 *
 * One toast style for: Success | Error | Warning | Info
 * Auto-dismisses after 4s with progress bar.
 * Position: bottom-right
 *
 * Usage:
 *   import { useToast } from '@/hooks/useToast';
 *   const { toast } = useToast();
 *   toast.success('Order placed!');
 */

// -- Types ---------------------------------------------------------------------
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

// -- Context -------------------------------------------------------------------
interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (item: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextValue | null>(null);

// -- Single Toast --------------------------------------------------------------
const TOAST_VARIANTS: Record<ToastVariant, { icon: React.ElementType; bg: string; border: string; iconColor: string; progressColor: string }> = {
  success: { icon: CheckCircle,     bg: 'bg-white',  border: 'border-[#BBF7D0]', iconColor: 'text-[#16A34A]', progressColor: 'bg-[#16A34A]' },
  error:   { icon: XCircle,         bg: 'bg-white',  border: 'border-[#FECACA]', iconColor: 'text-[#DC2626]', progressColor: 'bg-[#DC2626]' },
  warning: { icon: AlertTriangle,   bg: 'bg-white',  border: 'border-[#FDE68A]', iconColor: 'text-[#F59E0B]', progressColor: 'bg-[#F59E0B]' },
  info:    { icon: Info,            bg: 'bg-white',  border: 'border-[#BFDBFE]', iconColor: 'text-[#2563EB]', progressColor: 'bg-[#2563EB]' },
};

function Toast({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const duration = item.duration ?? 4000;
  const config = TOAST_VARIANTS[item.variant];
  const Icon = config.icon;
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const dismiss = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(item.id), 300);
    }, duration);
    return () => clearTimeout(dismiss);
  }, [duration, item.id, onRemove]);

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-2xl border shadow-[0_8px_30px_-4px_rgba(26,18,8,0.10)]',
        'w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden',
        'transition-all duration-300',
        config.bg, config.border,
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1A1208]">{item.title}</p>
        {item.description && (
          <p className="text-xs text-[#8C6E5A] mt-0.5 leading-relaxed">{item.description}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(item.id), 300); }}
        className="flex-shrink-0 text-[#B5957D] hover:text-[#4A3728] transition-colors duration-150 focus:outline-none"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <div
        className={cn('absolute bottom-0 left-0 h-0.5', config.progressColor)}
        style={{
          animation: `toast-progress ${duration}ms linear forwards`,
          width: '100%',
        }}
      />
    </div>
  );
}

// -- Toast Provider ------------------------------------------------------------
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...item, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Portal-like fixed container */}
      <div
        className="fixed bottom-6 right-6 z-[9000] flex flex-col gap-3 pointer-events-none"
        aria-label="Notifications"
      >
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <Toast item={item} onRemove={removeToast} />
          </div>
        ))}
      </div>

      {/* Progress bar animation */}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
