import { ORDER_STATUS, USER_ROLES, DINING_TYPES } from '../constants';

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type DiningType = typeof DINING_TYPES[keyof typeof DINING_TYPES];

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
}

export interface MenuItemInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  vegBadge: 'veg' | 'non-veg';
  spiceLevel: number;
  preparationTime: number;
  calories: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
  isAvailable: boolean;
}
