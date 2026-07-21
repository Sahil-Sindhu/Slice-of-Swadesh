'use client';

import * as React from 'react';
import { DashboardCard } from '../../components/DashboardCard';
import { useLowStock } from '../hooks/useDashboard';

export function InventoryAlerts({ className = '' }: { className?: string }) {
  const { data: alerts, isLoading, isError, refetch } = useLowStock();

  return (
    <DashboardCard title="Inventory Alerts" className={className}>
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-red-50 rounded-lg"></div>
          <div className="h-16 bg-red-50 rounded-lg"></div>
          <div className="h-16 bg-gray-50 rounded-lg"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-6">
          <p className="text-red-500 font-semibold text-sm mb-3">Unable to fetch inventory.</p>
          <button onClick={() => refetch()} className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50">Retry</button>
        </div>
      ) : !alerts || alerts.length === 0 ? (
        <div className="text-center py-10">
          <span className="text-3xl mb-2 block">🥬</span>
          <p className="text-gray-500 font-medium">Inventory looks healthy.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.ingredientId} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/50">
              <div>
                <h4 className="font-semibold text-red-900 text-sm">{alert.name}</h4>
                <p className="text-xs text-red-700 mt-0.5">{alert.currentStock} {alert.unit} left (Min: {alert.minStockLevel})</p>
              </div>
              <button className="text-xs font-bold text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-md shadow-sm hover:bg-red-50 transition-colors">
                Reorder
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
