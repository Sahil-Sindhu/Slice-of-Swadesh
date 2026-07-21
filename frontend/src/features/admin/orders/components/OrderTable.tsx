'use client';

import * as React from 'react';
import { IOrder } from '../types/order.types';
import { StatusBadge } from '../../components/StatusBadge';
import { Table, type TableColumn } from '../../../../components/ui/Table';
import { Badge } from '../../../../components/ui/Badge';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { FileText, AlertTriangle } from 'lucide-react';

interface OrderTableProps {
  orders: IOrder[];
  isLoading: boolean;
  isError: boolean;
  onSelectOrder: (order: IOrder) => void;
  selectedOrderId?: string;
}

export function OrderTable({ orders, isLoading, isError, onSelectOrder, selectedOrderId }: OrderTableProps) {
  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm">
        <EmptyState
          icon={<AlertTriangle size={24} />}
          title="Failed to load orders"
          description="Please try refreshing the page."
        />
      </div>
    );
  }

  const columns: TableColumn<IOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order No',
      className: 'font-mono font-bold text-[#1A1208]',
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (row) => (row as any).customerDoc?.name || 'Guest',
    },
    {
      key: 'grandTotal',
      header: 'Amount',
      className: 'font-semibold text-[#1A1208]',
      render: (row) => `₹${row.grandTotal.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (row) => {
        const variantMap: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
          Pending: 'warning',
          Paid: 'success',
          Failed: 'danger',
          Refunded: 'neutral',
        };
        const variant = variantMap[row.paymentStatus] ?? 'neutral';
        return <Badge variant={variant}>{row.paymentStatus}</Badge>;
      },
    },
    {
      key: 'createdAt',
      header: 'Time',
      className: 'text-xs text-[#8C6E5A]',
      render: (row) => new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  return (
    <Table<IOrder>
      columns={columns}
      data={orders}
      keyField="_id"
      isLoading={isLoading}
      onRowClick={onSelectOrder}
      selectedKey={selectedOrderId}
      emptyTitle="No orders found"
      emptyDescription="Try adjusting your search or filters to find what you're looking for."
      emptyIcon={<FileText size={24} />}
    />
  );
}

