import apiClient from './client';
import type { InternalAxiosRequestConfig } from 'axios';

// ─── Token Getter ─────────────────────────────────────────────────────────────
// We read the token from localStorage (where Zustand persist saves it)
// rather than importing the store directly, to avoid circular deps.
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('swadesh-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
};

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attaches Authorization header on every outgoing request.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On 401, clear auth state and redirect to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear persisted auth state
      localStorage.removeItem('swadesh-auth');
      // Remove token cookie so Next.js middleware also clears the session
      document.cookie = 'swadesh-token=; Max-Age=0; path=/';
      // Redirect only if not already on auth pages
      const isAuthPage = ['/login', '/register'].some((p) =>
        window.location.pathname.startsWith(p)
      );
      if (!isAuthPage) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
