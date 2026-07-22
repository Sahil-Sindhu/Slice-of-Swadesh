import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { loginUser } from '../api/authApi';
import type { LoginPayload } from '../types/auth.types';
import axios from 'axios';

export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

// ─── Extract a user-friendly error message from an axios error ────────────────
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
