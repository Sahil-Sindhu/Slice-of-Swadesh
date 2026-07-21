import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkout, CheckoutResult } from '../api/cartApi';
import { useCartStore } from '@/store/cartStore';

export function useCheckout() {
  const { clearLocalCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation<CheckoutResult, Error, string | undefined>({
    mutationFn: (notes) => checkout(notes),
    onSuccess: () => {
      // Clear Zustand store immediately — badge goes to 0
      clearLocalCart();
      // Invalidate cart query — the cart page will show empty state
      queryClient.setQueryData(['cart'], null);
    },
  });
}
