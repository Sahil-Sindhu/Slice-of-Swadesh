import * as React from 'react';

/**
 * Design System — StatCard Component
 *
 * Used in: Admin Dashboard, Kitchen Dashboard, Analytics.
 * Accepts lucide-react icons as ReactNode (not emoji strings).
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBg?: string;
}

export function StatCard({ title, value, icon, trend, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0E6D8] p-5 shadow-[0_4px_20px_-4px_rgba(26,18,8,0.06)] hover:shadow-[0_12px_32px_-8px_rgba(26,18,8,0.10)] transition-shadow duration-[250ms]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-[#8C6E5A] uppercase tracking-wider">{title}</h3>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#E8441A]"
          style={{ background: iconBg ?? '#FFF0EB' }}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-end gap-3">
        <span className="text-2xl font-black text-[#1A1208] font-mono tracking-tight">{value}</span>

        {trend && (
          <span
            className={`text-xs font-bold mb-1 flex items-center gap-0.5 ${
              trend.isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}

