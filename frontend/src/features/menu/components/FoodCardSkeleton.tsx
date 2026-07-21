import * as React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';

/**
 * FoodCardSkeleton — composed from the Skeleton design system primitive.
 * Do NOT use manual animate-pulse or custom bg colors here.
 */
export function FoodCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#F0E6D8] flex flex-col">
      {/* Image placeholder */}
      <Skeleton className="h-52 w-full rounded-none" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" shape="text" />
        <Skeleton className="h-3 w-full" shape="text" />
        <Skeleton className="h-3 w-5/6" shape="text" />
        <Skeleton className="h-3 w-1/3 mt-1" shape="text" />

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#F0E6D8]">
          <Skeleton className="h-6 w-16" shape="text" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

export function FoodGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <FoodCardSkeleton key={i} />
      ))}
    </div>
  );
}

