'use client';

import * as React from 'react';
import { DashboardCard } from '../../components/DashboardCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useRecentOrders } from '../hooks/useDashboard';

export function RecentOrders({ className = '' }: { className?: string }) {
  const { data: orders, isLoading, isError, refetch } = useRecentOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'yellow';
      case 'Preparing': return 'blue';
      case 'Ready': return 'green';
      case 'Completed': return 'gray';
      case 'Cancelled': return 'red';
      default: return 'gray';
    }
  };

  return (
    <DashboardCard title="Recent Orders" className={className}>
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-50 rounded"></div>
          <div className="h-10 bg-gray-50 rounded"></div>
          <div className="h-10 bg-gray-50 rounded"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-6">
          <p className="text-red-500 font-semibold text-sm mb-3">Failed to load recent orders.</p>
          <button onClick={() => refetch()} className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50">Retry</button>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-10">
          <span className="text-3xl mb-2 block">🍽️</span>
          <p className="text-gray-500 font-medium">Today's restaurant is quiet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 -my-5">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-5 py-3 font-semibold">Order No</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono font-medium text-gray-900">{order.id}</td>
                  <td className="px-5 py-3 text-gray-600">{order.customerName}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">₹{order.total}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardCard>
  );
}
