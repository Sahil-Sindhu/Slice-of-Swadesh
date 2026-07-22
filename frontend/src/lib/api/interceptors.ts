import apiClient from './client';
import { useAuthStore } from '@/store/authStore';

// Keep track of the active refresh promise to avoid duplicate refreshes if multiple requests fail at the same time
let refreshPromise: Promise<any> | null = null;

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = useAuthStore.getState().token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On 401, attempt to silently refresh session. If that fails, redirect to login.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401, is not a retry, and we are in the browser
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;

      // Don't try to refresh if the request was to the refresh endpoint itself
      if (originalRequest.url?.includes('/api/v1/auth/refresh')) {
        return Promise.reject(error);
      }

      try {
        if (!refreshPromise) {
          refreshPromise = apiClient.post('/api/v1/auth/refresh')
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
        // Retry the original request with the new active session
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear persisted auth state (Zustand UI state)
        localStorage.removeItem('swadesh-auth');
        // Redirect only if not already on auth pages
        const isAuthPage = ['/login', '/register'].some((p) =>
          window.location.pathname.startsWith(p)
        );
        if (!isAuthPage) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
