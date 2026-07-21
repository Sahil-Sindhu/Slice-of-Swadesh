import apiClient from './client';

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On 401, clear auth state and redirect to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear persisted auth state (Zustand UI state)
      localStorage.removeItem('swadesh-auth');
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
