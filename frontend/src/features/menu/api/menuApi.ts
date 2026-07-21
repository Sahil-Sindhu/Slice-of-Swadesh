import apiClient from '@/lib/api/interceptors';
import type {
  ApiFood,
  ApiCategory,
  FoodsQueryParams,
  FoodsResponse,
} from '../types/menu.types';
import type { ApiSuccess } from '@/features/auth/types/auth.types';

// ─── Get all foods (with optional filters) ───────────────────────────────────
export const getFoods = async (params: FoodsQueryParams = {}): Promise<FoodsResponse> => {
  const { data } = await apiClient.get<ApiSuccess<FoodsResponse>>('/api/v1/foods', { params });
  return data.data;
};

// ─── Get a single food by ID ─────────────────────────────────────────────────
export const getFoodById = async (id: string): Promise<ApiFood> => {
  const { data } = await apiClient.get<ApiSuccess<{ food: ApiFood }>>(`/api/v1/foods/${id}`);
  return data.data.food;
};

// ─── Get all categories ───────────────────────────────────────────────────────
export const getCategories = async (): Promise<ApiCategory[]> => {
  const { data } = await apiClient.get<ApiSuccess<{ categories: ApiCategory[] }>>('/api/v1/categories');
  return data.data.categories;
};

// ─── Search foods ─────────────────────────────────────────────────────────────
export const searchFoods = async (search: string, params: Omit<FoodsQueryParams, 'search'> = {}): Promise<FoodsResponse> => {
  return getFoods({ search, ...params });
};
