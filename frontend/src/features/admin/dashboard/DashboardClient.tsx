'use client';

import * as React from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatsGrid } from './components/StatsGrid';
import { RecentOrders } from './components/RecentOrders';
import { InventoryAlerts } from './components/InventoryAlerts';
import { BestSellerList } from './components/BestSellerList';
import { RevenueChart } from './components/RevenueChart';
import { useSocket } from '../../../providers/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';

export function DashboardClient() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboardOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] }); // if overlapping
    };

    const handleInventoryAlert = () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryAlerts'] });
    };

    socket.on('ORDER_CREATED', handleOrderUpdate);
    socket.on('ORDER_STATUS_UPDATED', handleOrderUpdate);
    socket.on('LOW_STOCK', handleInventoryAlert);

    return () => {
      socket.off('ORDER_CREATED', handleOrderUpdate);
      socket.off('ORDER_STATUS_UPDATED', handleOrderUpdate);
      socket.off('LOW_STOCK', handleInventoryAlert);
    };
  }, [socket, queryClient]);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Overview" 
        description="Here's what's happening in your restaurant today." 
      />

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart className="lg:col-span-2" />
        <BestSellerList />
        <RecentOrders className="lg:col-span-2" />
        <InventoryAlerts />
      </div>
    </div>
  );
}
