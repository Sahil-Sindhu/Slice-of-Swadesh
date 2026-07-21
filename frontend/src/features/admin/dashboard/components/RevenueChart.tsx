'use client';

import * as React from 'react';
import { DashboardCard } from '../../components/DashboardCard';
import { useRevenueAnalytics } from '../hooks/useDashboard';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { BarChart3, AlertTriangle } from 'lucide-react';

export function RevenueChart({ className = '' }: { className?: string }) {
  const { data: chartData, isLoading, isError, refetch } = useRevenueAnalytics();

  return (
    <DashboardCard title="Revenue (Last 7 Days)" className={className}>
      {isLoading ? (
        <div className="h-64 w-full flex items-end gap-2 animate-pulse pb-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-1 bg-[#F0E6D8] rounded-t-md" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
          ))}
        </div>
      ) : isError ? (
        <div className="h-64 flex items-center justify-center">
          <EmptyState
            icon={<AlertTriangle size={24} />}
            title="Failed to load chart"
            description="We couldn't retrieve the revenue analytics."
            action={{ label: 'Retry', onClick: () => refetch() }}
          />
        </div>
      ) : !chartData || chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <EmptyState
            icon={<BarChart3 size={24} />}
            title="No data available"
            description="Not enough data to display revenue trends."
          />
        </div>
      ) : (
        <div className="h-64 flex items-end gap-2 pb-4">
          {/* Extremely simple CSS bar chart for the MVP without heavy libraries */}
          {chartData.map((point) => {
            const maxRevenue = Math.max(...chartData.map(d => d.revenue));
            const height = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={point.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-[#1A1208] text-white text-[10px] py-1 px-2 rounded-lg font-bold transition-opacity whitespace-nowrap pointer-events-none shadow-[0_4px_12px_rgba(26,18,8,0.2)]">
                  ₹{point.revenue.toLocaleString()}
                </div>

                <div
                  className="w-full bg-gradient-to-t from-[#E8441A] to-[#FF8C69] rounded-t-md transition-all duration-300 group-hover:opacity-80 cursor-crosshair shadow-[0_4px_12px_-4px_rgba(232,68,26,0.2)]"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-[10px] text-[#8C6E5A] mt-3 font-bold uppercase tracking-wider">
                  {new Date(point.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}

