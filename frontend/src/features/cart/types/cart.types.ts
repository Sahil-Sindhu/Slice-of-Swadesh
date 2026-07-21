// ─── Cart Item ────────────────────────────────────────────────────────────────
export interface ApiCartItem {
  _id: string;
  variant: string;
  food: string;
  foodName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface ApiCart {
  _id: string;
  customer: string;
  items: ApiCartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
}

// ─── Add To Cart Request ──────────────────────────────────────────────────────
export interface AddToCartPayload {
  variant: string;
  quantity: number;
}
