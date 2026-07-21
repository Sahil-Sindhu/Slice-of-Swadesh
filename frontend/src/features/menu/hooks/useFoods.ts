import { useQuery } from '@tanstack/react-query';
import { getFoods } from '../api/menuApi';
import type { FoodsQueryParams } from '../types/menu.types';

export function useFoods(params: FoodsQueryParams = {}) {
  return useQuery({
    queryKey: ['foods', params],
    queryFn: () => getFoods(params),
    staleTime: 1000 * 60 * 2, // 2 minute cache
    placeholderData: (prev) => prev, // keep previous data while loading new page
  });
}
