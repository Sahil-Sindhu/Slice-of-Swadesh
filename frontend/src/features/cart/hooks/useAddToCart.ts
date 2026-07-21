import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart } from '../api/cartApi';
import { useCartStore } from '@/store/cartStore';
import type { AddToCartPayload } from '../types/cart.types';
import axios from 'axios';

export function useAddToCart() {
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: (cart) => {
      // Sync backend cart into Zustand store (drives navbar badge)
      setCart(cart);
      // Invalidate cart query so /cart page refetches
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// ─── Extract user-friendly error message ──────────────────────────────────────
export function extractCartError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Failed to add to cart';
  }
  return 'Failed to add to cart';
}
