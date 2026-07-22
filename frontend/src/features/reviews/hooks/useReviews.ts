import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getReviews, createReview } from '../api/reviewApi';
import type { CreateReviewPayload } from '../types/review.types';

export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
