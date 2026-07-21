import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCartItem, removeCartItem, clearCart } from '../api/cartApi';
import { useCartStore } from '@/store/cartStore';
import axios from 'axios';

// ─── Shared helper ────────────────────────────────────────────────────────────
export function extractCartError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
}

// ─── Update cart item quantity ────────────────────────────────────────────────
export function useUpdateCartItem() {
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: (cart) => {
      setCart(cart);
      queryClient.setQueryData(['cart'], cart);
    },
  });
}

// ─── Remove single cart item ──────────────────────────────────────────────────
export function useRemoveCartItem() {
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: (cart) => {
      setCart(cart);
      queryClient.setQueryData(['cart'], cart);
    },
  });
}

// ─── Clear entire cart ────────────────────────────────────────────────────────
export function useClearCart() {
  const { setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: (cart) => {
      setCart(cart);
      queryClient.setQueryData(['cart'], cart);
    },
  });
}
