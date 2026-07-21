import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApiUser } from '@/features/auth/types/auth.types';

// ─── State Shape ─────────────────────────────────────────────────────────────
interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: ApiUser | null;

  // Actions
  setAuth: (token: string, user: ApiUser) => void;
  setUser: (user: ApiUser) => void;
  logout: () => void;

  // Legacy alias — kept for any existing code that calls login()
  login: (user: ApiUser) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      token: null,
      user: null,

      setAuth: (token: string, user: ApiUser) =>
        set({ isLoggedIn: true, token, user }),

      setUser: (user: ApiUser) =>
        set({ user }),

      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'swadesh-token=; Max-Age=0; path=/';
        }
        set({ isLoggedIn: false, token: null, user: null });
      },

      // Legacy alias — kept for backwards compatibility
      login: (user: ApiUser) =>
        set({ isLoggedIn: true, user }),
    }),
    {
      name: 'swadesh-auth',
      // Only persist data fields, not action functions
      partialize: (state: AuthState) => ({
        isLoggedIn: state.isLoggedIn,
        token: state.token,
        user: state.user,
      }) as AuthState,
    }
  )
);
