import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { registerUser } from '../api/authApi';
import type { RegisterPayload } from '../types/auth.types';

export function useRegister() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (data) => {
      // Auto-login after successful registration
      setAuth(data.token, data.user);
      // Write token to cookie for Next.js middleware
      document.cookie = `swadesh-token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
    },
  });
}
