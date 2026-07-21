import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { getOrderById, getOrderHistory, getOrderTimeline, getProfile, updateProfile } from '../api/profileApi';
import type { ProfileUpdatePayload } from '../types/profile.types';

export function useProfile() {
  const { isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => updateProfile(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['profile'], user);
    },
  });
}

export function useOrderHistory() {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ['orders', 'history'],
    queryFn: getOrderHistory,
    enabled: isLoggedIn,
    staleTime: 1000 * 30,
  });
}

export function useOrderDetail(orderId: string | null) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: Boolean(orderId),
    staleTime: 1000 * 30,
  });
}

export function useOrderTimeline(orderId: string | null) {
  return useQuery({
    queryKey: ['orders', orderId, 'timeline'],
    queryFn: () => getOrderTimeline(orderId!),
    enabled: Boolean(orderId),
    staleTime: 1000 * 30,
  });
}
