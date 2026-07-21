import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Cart Item (mirrors backend ICartItem) ────────────────────────────────────
export interface CartItem {
  _id: string;        // subdocument _id from backend
  variant: string;    // variantId
  food: string;       // foodId
  foodName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

// ─── Cart State ────────────────────────────────────────────────────────────────
interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  itemCount: number;

  // Actions
  setCart: (cart: Omit<CartState, 'itemCount' | 'setCart' | 'clearLocalCart'>) => void;
  clearLocalCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      grandTotal: 0,
      itemCount: 0,

      setCart: (cart) =>
        set({
          ...cart,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        }),

      clearLocalCart: () =>
        set({ items: [], subtotal: 0, discount: 0, tax: 0, grandTotal: 0, itemCount: 0 }),
    }),
    {
      name: 'swadesh-cart',
      partialize: (state: CartState) => ({
        items: state.items,
        subtotal: state.subtotal,
        discount: state.discount,
        tax: state.tax,
        grandTotal: state.grandTotal,
        itemCount: state.itemCount,
      }) as CartState,
    }
  )
);
