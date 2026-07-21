'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPaymentById, verifyPayment, cancelPayment, retryPayment } from '@/features/payment/api/paymentApi';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ShieldCheck, XCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PaymentStatusPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const { data: payment, isLoading, refetch } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => getPaymentById(paymentId)
  });

  const { mutate: doVerify, isPending: isVerifying } = useMutation({
    mutationFn: (simulateFailure: boolean) => verifyPayment(paymentId, simulateFailure),
    onSuccess: () => refetch()
  });

  const { mutate: doCancel, isPending: isCancelling } = useMutation({
    mutationFn: () => cancelPayment(paymentId),
    onSuccess: () => refetch()
  });

  const { mutate: doRetry, isPending: isRetrying } = useMutation({
    mutationFn: () => retryPayment(paymentId),
    onSuccess: () => refetch()
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">Loading Payment Details...</div>;
  }

  if (!payment) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">Payment not found.</div>;
  }

  const isPending = payment.status === 'CREATED' || payment.status === 'PENDING';
  const isFailed = payment.status === 'FAILED';
  const isSuccess = payment.status === 'CAPTURED';
  const isCancelled = payment.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-[#F0E6D8] p-8 shadow-sm">
        
        <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-[#F0E6D8]">
          <h1 className="text-2xl font-black text-[#1A1208] font-[family-name:var(--font-outfit)]">Payment Status</h1>
          <span className="text-[#8C6E5A] font-bold text-sm">#{payment.orderId}</span>
        </div>

        <div className="flex flex-col items-center mb-8 text-center">
          {isSuccess && <ShieldCheck size={64} className="text-green-500 mb-4" />}
          {isFailed && <XCircle size={64} className="text-red-500 mb-4" />}
          {isPending && <Clock size={64} className="text-[#F59E0B] mb-4" />}
          {isCancelled && <AlertTriangle size={64} className="text-[#8C6E5A] mb-4" />}
          
          <h2 className="text-xl font-bold text-[#1A1208] uppercase tracking-wider mb-2">
            {payment.status}
          </h2>
          <div className="text-3xl font-black text-[#E8441A] font-[family-name:var(--font-outfit)]">
            ₹{payment.amount.toFixed(2)}
          </div>
          {isFailed && <p className="text-red-500 text-sm mt-2 font-medium">{payment.failureReason}</p>}
        </div>

        <div className="space-y-4 mb-8 text-sm">
          <div className="flex justify-between border-b border-[#F0E6D8] pb-2">
            <span className="text-[#8C6E5A] font-bold">Payment ID</span>
            <span className="text-[#1A1208] font-mono">{payment.paymentId}</span>
          </div>
          <div className="flex justify-between border-b border-[#F0E6D8] pb-2">
            <span className="text-[#8C6E5A] font-bold">Gateway</span>
            <span className="text-[#1A1208] font-bold uppercase">{payment.gateway}</span>
          </div>
          <div className="flex justify-between border-b border-[#F0E6D8] pb-2">
            <span className="text-[#8C6E5A] font-bold">Date</span>
            <span className="text-[#1A1208] font-bold">{new Date(payment.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Mock Gateway Simulation Actions */}
        {isPending && payment.gateway === 'MOCK' && (
          <div className="space-y-3 bg-[#FFF0EB] p-4 rounded-xl border border-[#F0E6D8] mb-6">
            <p className="text-xs text-[#E8441A] font-bold text-center mb-2 uppercase tracking-wide">Mock Gateway Simulation</p>
            <Button variant="primary" className="w-full" onClick={() => doVerify(false)} disabled={isVerifying}>
              Simulate Success
            </Button>
            <Button variant="outline" className="w-full" onClick={() => doVerify(true)} disabled={isVerifying}>
              Simulate Failure
            </Button>
            <Button variant="ghost" className="w-full text-[#8C6E5A]" onClick={() => doCancel()} disabled={isCancelling}>
              Cancel Payment
            </Button>
          </div>
        )}

        {isFailed && (
          <Button variant="primary" className="w-full mb-3" onClick={() => doRetry()} disabled={isRetrying}>
            Retry Payment
          </Button>
        )}

        {isSuccess && (
          <Button variant="primary" className="w-full mb-3" onClick={() => router.push('/track/' + payment.orderId)}>
            Track Order
          </Button>
        )}

        <Link href="/" className="flex items-center justify-center gap-2 text-sm font-bold text-[#B5957D] hover:text-[#E8441A] transition-colors mt-6">
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
