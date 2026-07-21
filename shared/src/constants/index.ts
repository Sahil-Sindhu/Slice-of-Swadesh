export const ORDER_STATUS = {
  PLACED: 'placed',
  PAID: 'paid',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  CHEF: 'chef',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  DELIVERY: 'delivery',
} as const;

export const DINING_TYPES = {
  DELIVERY: 'delivery',
  TAKEAWAY: 'takeaway',
  DINE_IN: 'dine-in',
} as const;

export const SPICE_LEVELS = {
  NONE: 0,
  MILD: 1,
  MEDIUM: 2,
  HOT: 3,
} as const;
