import * as React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl border border-[#F0E6D8]">
      <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" shape="text" />
        <Skeleton className="h-3 w-1/4" shape="text" />
        <Skeleton className="h-3 w-1/3" shape="text" />
      </div>
      <Skeleton className="h-8 w-24 rounded-xl shrink-0" />
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 flex flex-col gap-4">
        {[1, 2, 3].map(i => <CartItemSkeleton key={i} />)}
      </div>
      <Skeleton className="h-80 rounded-3xl" />
    </div>
  );
}

