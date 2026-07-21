'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { CheckoutResult } from '../api/cartApi';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Navigation } from 'lucide-react';

export function OrderSuccess({ result }: { result: CheckoutResult }) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center px-6 text-center gap-8">
      <div className="relative">
        <div className="absolute inset-0 w-32 h-32 rounded-full bg-green-500/15 blur-2xl animate-pulse" />
        <div className="relative w-32 h-32 rounded-full border-4 border-green-500/30 bg-green-50 flex items-center justify-center text-green-600">
          <CheckCircle size={56} strokeWidth={2.5} />
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-black text-[#1A1208] mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
          Order Confirmed!
        </h1>
        <p className="text-[#8C6E5A] text-sm mb-4 max-w-sm">
          Your order is in the kitchen. Fresh, hot, and on its way.
        </p>
        <div className="inline-block px-6 py-3 rounded-2xl bg-white border-2 border-[#F0E6D8]">
          <p className="text-xs text-[#B5957D] font-bold uppercase tracking-widest mb-1">Order Number</p>
          <p className="text-xl font-black text-[#E8441A] font-mono">{result.orderNumber}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          variant="primary"
          onClick={() => router.push('/track')}
          className="flex-1 py-3.5 w-full"
        >
          <Navigation size={18} className="mr-2" />
          Track Order
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex-1 py-3.5 w-full"
        >
          Back to Menu
        </Button>
      </div>
    </div>
  );
}

