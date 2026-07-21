import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApiUser } from '@/features/auth/types/auth.types';
import { logoutUser } from '@/features/auth/api/authApi';

// ─── State Shape ─────────────────────────────────────────────────────────────
interface AuthState {
  isLoggedIn: boolean;
  user: ApiUser | null;

  // Actions
  setAuth: (user: ApiUser) => void;
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
      user: null,

      setAuth: (user: ApiUser) =>
        set({ isLoggedIn: true, user }),

      setUser: (user: ApiUser) =>
        set({ user }),

      logout: () => {
        // Destroy session on the backend and clear the secure cookie
        logoutUser().catch((err) => console.error('Logout API error:', err));
        // Immediately clear auth state in the frontend
        set({ isLoggedIn: false, user: null });
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
        user: state.user,
      }) as AuthState,
    }
  )
);
