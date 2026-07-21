'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.replace(redirectTo);
    } else {
      setChecked(true);
    }
  }, [isLoggedIn, redirectTo, router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-foreground/50 font-sans">Checking authentication…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
