import apiClient from '@/lib/api/interceptors';
import type { ApiFood } from '../types/food.types';
import type { ApiSuccess } from '@/features/auth/types/auth.types';

// ─── Get food by slug ─────────────────────────────────────────────────────────
// Uses the new /api/v1/foods/slug/:slug route added in Sprint F3.
// Returns ALL variants (including unavailable) so the UI can show disabled states.
export const getFoodBySlug = async (slug: string): Promise<ApiFood> => {
  const { data } = await apiClient.get<ApiSuccess<{ food: ApiFood }>>(`/api/v1/foods/slug/${slug}`);
  return data.data.food;
};
