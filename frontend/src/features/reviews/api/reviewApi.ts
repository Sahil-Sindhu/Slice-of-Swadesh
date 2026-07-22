import apiClient from '@/lib/api/interceptors';
import type { ApiReview, CreateReviewPayload } from '../types/review.types';
import type { ApiSuccess } from '@/features/auth/types/auth.types';

export const getReviews = async (): Promise<ApiReview[]> => {
  const { data } = await apiClient.get<ApiSuccess<{ reviews: ApiReview[] }>>('/api/v1/reviews');
  return data.data.reviews;
};

export const createReview = async (payload: CreateReviewPayload): Promise<ApiReview> => {
  const { data } = await apiClient.post<ApiSuccess<{ review: ApiReview }>>('/api/v1/reviews', payload);
  return data.data.review;
};
