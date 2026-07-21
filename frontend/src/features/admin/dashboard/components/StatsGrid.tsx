'use client';

import * as React from 'react';
import { StatCard } from '../../components/StatCard';
import { useDashboardStats } from '../hooks/useDashboard';
import { Skeleton } from '../../../../components/ui/Skeleton';
import {
  ClipboardList,
  IndianRupee,
  Clock,
  AlertTriangle,
  Users,
  ChefHat,
} from 'lucide-react';

export function StatsGrid() {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#F0E6D8] p-5 h-[116px]">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-3 w-1/3" shape="text" />
              <Skeleton className="w-10 h-10" shape="circle" />
            </div>
            <Skeleton className="h-7 w-1/4" shape="text" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-2xl p-6 text-center">
        <p className="text-[#B91C1C] font-semibold mb-3">Failed to load dashboard statistics.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-white border border-[#FECACA] rounded-xl text-sm font-bold text-[#DC2626] shadow-sm hover:bg-[#FEE2E2] transition-colors duration-150"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <StatCard title="Today's Orders"   value={stats.todaysOrders.value}                              icon={<ClipboardList size={18} />} trend={stats.todaysOrders} />
      <StatCard title="Today's Revenue"  value={`₹${stats.todaysRevenue.value.toLocaleString()}`}     icon={<IndianRupee size={18} />}   trend={stats.todaysRevenue} />
      <StatCard title="Pending Orders"   value={stats.pendingOrders.value}                             icon={<Clock size={18} />} />
      <StatCard title="Low Stock Items"  value={stats.lowStockItems.value}                             icon={<AlertTriangle size={18} />} trend={stats.lowStockItems} iconBg="#FEF9C3" />
      <StatCard title="Active Customers" value={stats.activeCustomers.value}                           icon={<Users size={18} />} />
      <StatCard title="Kitchen Status"   value={stats.kitchenStatus}                                   icon={<ChefHat size={18} />} />
    </div>
  );
}



