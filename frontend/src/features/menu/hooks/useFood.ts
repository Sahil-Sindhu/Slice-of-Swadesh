import { useQuery } from '@tanstack/react-query';
import { getFoodById } from '../api/menuApi';

export function useFood(id: string | null) {
  return useQuery({
    queryKey: ['food', id],
    queryFn: () => getFoodById(id!),
    enabled: Boolean(id), // only fetch when id is provided
    staleTime: 1000 * 60 * 5,
  });
}
