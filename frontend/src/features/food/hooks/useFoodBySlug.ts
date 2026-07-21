import { useQuery } from '@tanstack/react-query';
import { getFoodBySlug } from '../api/foodApi';

export function useFoodBySlug(slug: string | null) {
  return useQuery({
    queryKey: ['food', 'slug', slug],
    queryFn: () => getFoodBySlug(slug!),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
