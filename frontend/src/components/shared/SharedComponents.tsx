import * as React from 'react';
import { cn } from '../../utils/cn';

// ─── Alert ────────────────────────────────────────────────────────────────────
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  type = 'info',
  title,
  children,
  ...props
}) => {
  // All values use design system semantic colors (no undefined Tailwind tokens)
  const styles: Record<string, string> = {
    info:    'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]',
    success: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
    warning: 'bg-[#FEF9C3] text-[#B45309] border-[#FDE68A]',
    error:   'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]',
  };

  const icons: Record<string, React.ReactNode> = {
    info: (
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-3.5 border rounded-xl font-sans text-sm items-start',
        styles[type],
        className
      )}
      role="alert"
      {...props}
    >
      {icons[type]}
      <div className="flex flex-col gap-0.5">
        {title && <span className="font-bold tracking-wide">{title}</span>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
};


// CookieBanner
export const CookieBanner: React.FC = () => {
  const [accepted, setAccepted] = React.useState(true); // default true for mock/demo inside component so it doesn't block screen unless initialized

  React.useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md bg-card border border-border p-5 rounded-2xl shadow-xl z-50 animate-slide-up flex flex-col gap-3 font-sans">
      <h4 className="font-bold text-base text-foreground">🍪 Cookie Consent</h4>
      <p className="text-xs text-foreground/75 leading-relaxed">
        We use cookies to optimize your pizza ordering experience and personalize AI suggestions. By browsing, you agree to our policies.
      </p>
      <div className="flex justify-end gap-2 text-xs">
        <button
          onClick={accept}
          className="px-4 py-2 bg-primary text-white font-bold rounded-lg cursor-pointer hover:bg-opacity-95"
        >
          Accept All
        </button>
      </div>
    </div>
  );
};
