import * as React from 'react';
import { ToastContext, type ToastVariant } from '../components/ui/Toast';

/**
 * useToast - Design System Hook
 *
 * Provides a simple API for triggering toasts from any component.
 *
 * @example
 * const { toast } = useToast();
 * toast.success('Order placed!', 'Your food is being prepared.');
 * toast.error('Payment failed', 'Please try again.');
 * toast.warning('Low stock', '2 items left.');
 * toast.info('New feature', 'Check out what is new.');
 */
export function useToast() {
  const ctx = React.useContext(ToastContext);

  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>. Wrap your app in AppProviders.');
  }

  const toast = React.useMemo(
    () => ({
      success: (title: string, description?: string, duration?: number) =>
        ctx.addToast({ variant: 'success', title, description, duration }),

      error: (title: string, description?: string, duration?: number) =>
        ctx.addToast({ variant: 'error', title, description, duration }),

      warning: (title: string, description?: string, duration?: number) =>
        ctx.addToast({ variant: 'warning', title, description, duration }),

      info: (title: string, description?: string, duration?: number) =>
        ctx.addToast({ variant: 'info', title, description, duration }),

      custom: (variant: ToastVariant, title: string, description?: string, duration?: number) =>
        ctx.addToast({ variant, title, description, duration }),

      dismiss: (id: string) => ctx.removeToast(id),
    }),
    [ctx]
  );

  return { toast, toasts: ctx.toasts };
}
