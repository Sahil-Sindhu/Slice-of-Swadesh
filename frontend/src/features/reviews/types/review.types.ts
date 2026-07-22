export interface ApiReview {
  _id: string;
  userName: string;
  avatar?: string;
  rating: number;
  comment: string;
  language?: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  rating: number;
  comment: string;
  language?: string;
}
