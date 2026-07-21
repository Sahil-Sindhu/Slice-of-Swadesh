import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/menuApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 15, // categories change rarely — 15 min cache
  });
}
