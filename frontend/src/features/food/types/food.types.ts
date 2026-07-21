// ─── Reuse shared types from menu feature ─────────────────────────────────────
// These are identical to menu.types.ts — re-exported here so food/ feature
// is self-contained and doesn't import from menu/.
export type { ApiFood, ApiVariant, ApiCategory, FoodType } from '@/features/menu/types/menu.types';
