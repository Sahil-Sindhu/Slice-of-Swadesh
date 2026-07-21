'use client';

import * as React from 'react';
import Link from 'next/link';
import { AuthGuard } from '../../../components/shared/AuthGuard';
import { Card } from '../../../components/ui/Card';
import { Container, Section, Stack } from '../../../components/layout/LayoutComponents';
import { useOrderDetail, useOrderTimeline } from '../../../features/profile/hooks/useProfile';
import { useSocket } from '../../../providers/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';

interface TrackPageProps {
  params: Promise<{ orderId: string }>;
}

function TrackPageContent({ orderId }: { orderId: string }) {
  const { data: order, isLoading, isError, refetch: refetchOrder } = useOrderDetail(orderId);
  const { data: timeline = [], refetch: refetchTimeline } = useOrderTimeline(orderId);
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!socket) return;
    
    const handleStatusUpdate = (payload: any) => {
      if (payload.order?.orderNumber === orderId || payload.order?._id === orderId) {
        queryClient.invalidateQueries({ queryKey: ['orderDetail', orderId] });
        queryClient.invalidateQueries({ queryKey: ['orderTimeline', orderId] });
      }
    };

    socket.on('ORDER_STATUS_UPDATED', handleStatusUpdate);

    return () => {
      socket.off('ORDER_STATUS_UPDATED', handleStatusUpdate);
    };
  }, [socket, orderId, queryClient]);

  const statusSteps = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
  const currentIndex = statusSteps.indexOf(order?.status || 'Pending');
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1A1208]">
      <Section py="md" className="border-b border-[#F0E6D8]">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#E8441A] font-semibold">Live kitchen progress</p>
              <h1 className="text-3xl font-bold">Track order #{order?.orderNumber || orderId}</h1>
            </div>
            <Link href="/profile" className="rounded-full border border-[#F0E6D8] bg-white px-4 py-2 text-sm font-semibold text-[#4A3728]">Back to profile</Link>
          </div>
        </Container>
      </Section>

      <Section py="md">
        <Container className="max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="border border-[#F0E6D8] bg-white p-8 shadow-sm">
              {isLoading ? (
                <div className="text-sm text-[#8C6E5A]">Loading your live order…</div>
              ) : isError || !order ? (
                <div className="text-sm text-[#C93B15]">We could not fetch this order right now.</div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#E8441A]">Current status</p>
                      <h2 className="text-2xl font-bold">{order.status}</h2>
                    </div>
                    <button onClick={() => { refetchOrder(); refetchTimeline(); }} className="rounded-full border border-[#F0E6D8] px-4 py-2 text-sm font-semibold text-[#4A3728]">Refresh</button>
                  </div>

                  <div className="mt-6 rounded-3xl bg-[#FFF3EC] p-5">
                    <div className="flex items-center justify-between text-sm text-[#8C6E5A]">
                      <span>Order value</span>
                      <span className="font-semibold text-[#1A1208]">₹{order.grandTotal?.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-[#8C6E5A]">
                      <span>Payment</span>
                      <span className="font-semibold text-[#1A1208]">{order.paymentStatus}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-[#8C6E5A]">
                      <span>Placed on</span>
                      <span className="font-semibold text-[#1A1208]">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <Stack gap="lg" className="relative mt-8 border-l border-[#F0E6D8] pl-8">
                    {statusSteps.map((step, idx) => {
                      const completed = idx <= activeIndex;
                      const current = idx === activeIndex;
                      return (
                        <div key={step} className="relative">
                          <div className={`absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-4 ${completed ? 'border-[#E8441A] bg-[#E8441A] text-white' : 'border-[#F0E6D8] bg-white text-[#B5957D]'}`}>
                            {completed ? '✓' : ''}
                          </div>
                          <p className={`font-semibold ${current ? 'text-[#E8441A]' : completed ? 'text-[#1A1208]' : 'text-[#B5957D]'}`}>{step}</p>
                          <p className="text-sm text-[#8C6E5A]">{timeline[idx]?.remarks || (idx === 0 ? 'Placed successfully' : 'In progress')}</p>
                        </div>
                      );
                    })}
                  </Stack>
                </>
              )}
            </Card>

            <Card className="border border-[#F0E6D8] bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold">Order summary</h3>
              {order?.items?.map((item) => (
                <div key={`${item.foodName}-${item.variantName}`} className="mt-4 rounded-2xl border border-[#F0E6D8] bg-[#FFFBF5] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#1A1208]">{item.foodName}</p>
                      <p className="text-sm text-[#8C6E5A]">{item.variantName}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#E8441A]">x{item.quantity}</span>
                  </div>
                  <div className="mt-3 text-sm text-[#8C6E5A]">₹{item.totalPrice?.toLocaleString()}</div>
                </div>
              ))}
              {order?.notes && <div className="mt-4 rounded-2xl border border-[#F0E6D8] bg-[#FFF3EC] p-4 text-sm text-[#8C6E5A]">{order.notes}</div>}
              
              <div className="mt-6 pt-6 border-t border-[#F0E6D8]">
                <button
                  onClick={() => window.open(`http://localhost:5000/api/v1/invoices/${orderId}/download`, '_blank')}
                  className="w-full rounded-2xl bg-[#1A1208] text-white px-4 py-3 font-semibold hover:bg-[#4A3728] transition-colors flex items-center justify-center gap-2"
                >
                  📄 Download Invoice
                </button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}

export default function TrackPage({ params }: TrackPageProps) {
  const resolvedParams = React.use(params);
  return (
    <AuthGuard>
      <TrackPageContent orderId={resolvedParams.orderId} />
    </AuthGuard>
  );
}
