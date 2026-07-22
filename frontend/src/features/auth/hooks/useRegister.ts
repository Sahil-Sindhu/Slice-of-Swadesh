import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { registerUser } from '../api/authApi';
import type { RegisterPayload } from '../types/auth.types';

export function useRegister() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (data) => {
      // Auto-login after successful registration (cookie is set automatically by backend via HttpOnly)
      setAuth(data.user, data.token);
    },
  });
}
