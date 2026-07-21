'use client';

import * as React from 'react';
import { PageHeader } from '../components/PageHeader';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllPayments, cancelPayment, refundPayment } from '@/features/payment/api/paymentApi';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function PaymentsClient() {
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminPayments', page, status],
    queryFn: () => getAllPayments({ page, status, limit: 15 })
  });

  const { mutate: doRefund } = useMutation({
    mutationFn: (paymentId: string) => refundPayment(paymentId),
    onSuccess: () => refetch()
  });

  const { mutate: doCancel } = useMutation({
    mutationFn: (paymentId: string) => cancelPayment(paymentId),
    onSuccess: () => refetch()
  });

  return (
    <div className="space-y-6 pb-12 h-full flex flex-col">
      <PageHeader 
        title="Payments" 
        description="Manage all incoming payments and refunds."
      />

      <div className="flex gap-2">
        {['', 'CAPTURED', 'FAILED', 'PENDING', 'REFUNDED'].map(opt => (
          <button
            key={opt}
            onClick={() => { setStatus(opt); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${status === opt ? 'bg-[#E8441A] text-white' : 'bg-white border-2 border-[#F0E6D8] text-[#8C6E5A] hover:border-[#E8441A]'}`}
          >
            {opt || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#F0E6D8] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#8C6E5A]">Loading payments...</div>
        ) : data?.payments.length === 0 ? (
          <div className="p-8 text-center text-[#8C6E5A]">No payments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFBF5] border-b-2 border-[#F0E6D8]">
                  <th className="p-4 text-xs font-black text-[#8C6E5A] uppercase tracking-wider">Payment ID</th>
                  <th className="p-4 text-xs font-black text-[#8C6E5A] uppercase tracking-wider">Order</th>
                  <th className="p-4 text-xs font-black text-[#8C6E5A] uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-black text-[#8C6E5A] uppercase tracking-wider">Gateway</th>
                  <th className="p-4 text-xs font-black text-[#8C6E5A] uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-black text-[#8C6E5A] uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-black text-[#8C6E5A] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6D8]">
                {data?.payments.map(payment => (
                  <tr key={payment.paymentId} className="hover:bg-[#FFFBF5] transition-colors">
                    <td className="p-4 font-mono text-sm font-bold text-[#1A1208]">{payment.paymentId.split('_')[1] || payment.paymentId}</td>
                    <td className="p-4 text-sm font-bold text-[#1A1208]">{payment.orderId}</td>
                    <td className="p-4 text-sm font-black text-[#E8441A]">₹{payment.amount.toFixed(2)}</td>
                    <td className="p-4"><Badge variant="neutral" className="text-xs">{payment.gateway}</Badge></td>
                    <td className="p-4">
                      <Badge variant={payment.status === 'CAPTURED' ? 'success' : payment.status === 'FAILED' ? 'danger' : 'warning'} className="text-xs">
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm font-medium text-[#8C6E5A]">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right space-x-2">
                      {payment.status === 'CAPTURED' && (
                        <Button variant="outline" className="h-8 text-xs" onClick={() => doRefund(payment.paymentId)}>
                          Refund
                        </Button>
                      )}
                      {(payment.status === 'CREATED' || payment.status === 'PENDING') && (
                        <Button variant="outline" className="h-8 text-xs text-red-500" onClick={() => doCancel(payment.paymentId)}>
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {data && data.pagination.pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t-2 border-[#F0E6D8] bg-[#FFFBF5]">
            <span className="text-sm font-bold text-[#8C6E5A]">
              Page {data.pagination.page} of {data.pagination.pages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button variant="outline" disabled={page === data.pagination.pages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
