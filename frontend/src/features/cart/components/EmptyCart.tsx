import * as React from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';

export function EmptyCart() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={<ShoppingBag size={28} />}
        title="Your cart is hungry."
        description="Let's fix that. Explore our hand-crafted fusion menu and add something delicious!"
        action={{
          label: 'Browse Menu',
          onClick: () => router.push('/#menu'),
        }}
        className="scale-110"
      />
    </div>
  );
}

