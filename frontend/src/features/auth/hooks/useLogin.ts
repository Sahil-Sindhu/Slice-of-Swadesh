import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { loginUser } from '../api/authApi';
import type { LoginPayload } from '../types/auth.types';
import axios from 'axios';

export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (data, _variables, _context) => {
      // Persist user into Zustand store (cookie is set automatically by backend via HttpOnly)
      setAuth(data.user);
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
