import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cartStore';
import { getCart } from '../api/cartApi';
import { useAuthStore } from '@/store/authStore';

export function useCart() {
  const { isLoggedIn } = useAuthStore();
  const { setCart } = useCartStore();

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cart = await getCart();
      // Keep Zustand store in sync so the navbar badge is always accurate
      setCart(cart);
      return cart;
    },
    enabled: isLoggedIn,           // Only fetch if logged in
    staleTime: 1000 * 30,          // 30s — cart changes frequently
    refetchOnWindowFocus: true,    // Refetch on tab switch (other tab may have updated cart)
  });
}
