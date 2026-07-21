'use client';

import * as React from 'react';
import { PageHeader } from '../components/PageHeader';
import { OrderFilters } from './components/OrderFilters';
import { OrderTable } from './components/OrderTable';
import { OrderDrawer } from './components/OrderDrawer';
import { useAdminOrders } from './hooks/useOrders';
import { IOrder } from './types/order.types';
import { useSocket } from '../../../providers/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';

export function OrdersClient() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [paymentStatus, setPaymentStatus] = React.useState('');

  const [selectedOrder, setSelectedOrder] = React.useState<IOrder | null>(null);

  const { data, isLoading, isError } = useAdminOrders({
    page,
    limit: 15,
    search,
    status,
    paymentStatus
  });

  const { socket } = useSocket();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    };

    socket.on('ORDER_CREATED', handleOrderUpdate);
    socket.on('ORDER_STATUS_UPDATED', handleOrderUpdate);

    return () => {
      socket.off('ORDER_CREATED', handleOrderUpdate);
      socket.off('ORDER_STATUS_UPDATED', handleOrderUpdate);
    };
  }, [socket, queryClient]);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [search, status, paymentStatus]);

  // When selectedOrder is updated in the background, we might want to update it if data changes,
  // but for now relying on the Drawer's own query for timeline is enough. The drawer takes the order obj.
  // To keep it perfectly fresh, we could update selectedOrder if `data.orders` contains a newer version.
  React.useEffect(() => {
    if (selectedOrder && data?.orders) {
      const updated = data.orders.find(o => o._id === selectedOrder._id);
      if (updated && updated.status !== selectedOrder.status) {
        setSelectedOrder(updated);
      }
    }
  }, [data?.orders, selectedOrder]);

  return (
    <div className="space-y-6 pb-12 h-full flex flex-col">
      <PageHeader 
        title="Orders" 
        description="Manage all incoming restaurant orders."
      />

      <OrderFilters 
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
      />

      <div className="flex-1">
        <OrderTable 
          orders={data?.orders || []}
          isLoading={isLoading}
          isError={isError}
          onSelectOrder={setSelectedOrder}
          selectedOrderId={selectedOrder?._id as string}
        />
        
        {/* Pagination Controls */}
        {data && data.pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <span className="text-sm text-gray-500">
              Showing page <span className="font-bold text-gray-900">{data.pagination.page}</span> of {data.pagination.pages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-semibold text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-semibold text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderDrawer 
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
