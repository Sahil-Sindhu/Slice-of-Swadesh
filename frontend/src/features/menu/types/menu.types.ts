// ─── Category ────────────────────────────────────────────────────────────────
export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

// ─── Food Variant ────────────────────────────────────────────────────────────
export interface ApiVariant {
  _id: string;
  food: string;
  name: string;
  price: number;
  isAvailable: boolean;
  displayOrder: number;
  preparationTime?: number;
}

// ─── Food ─────────────────────────────────────────────────────────────────────
export type FoodType = 'Veg' | 'NonVeg' | 'Vegan' | 'Jain' | 'Egg';
export type FoodStatus = 'Draft' | 'Published' | 'Archived';

export interface FoodImage {
  url: string;
  alt?: string;
}

export interface ApiFood {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  category: Pick<ApiCategory, '_id' | 'name' | 'slug'>;
  images: FoodImage[];
  foodType: FoodType;
  isAvailable: boolean;
  preparationTime: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  status: FoodStatus;
  tags: string[];
  rating: number;
  ratingCount: number;
  variants: ApiVariant[];
}

// ─── Query Params ─────────────────────────────────────────────────────────────
export interface FoodsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  foodType?: FoodType;
}

// ─── Paginated Response ───────────────────────────────────────────────────────
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FoodsResponse {
  foods: ApiFood[];
  pagination: Pagination;
}
