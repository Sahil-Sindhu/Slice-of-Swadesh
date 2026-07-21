import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { loginUser } from '../api/authApi';
import type { LoginPayload } from '../types/auth.types';
import axios from 'axios';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (data, _variables, _context) => {
      // Persist token + user into Zustand store (also written to localStorage)
      setAuth(data.token, data.user);
      // Write token to cookie so Next.js middleware can read it at the edge
      document.cookie = `swadesh-token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
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
