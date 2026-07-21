import * as React from 'react';

/**
 * Design System — DashboardCard Component
 *
 * A titled panel used across Admin and Kitchen dashboards.
 * Consistent with the Card design system token (border-radius lg, border-[#F0E6D8]).
 */
export function DashboardCard({
  title,
  children,
  className = '',
  action,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#F0E6D8] shadow-[0_4px_20px_-4px_rgba(26,18,8,0.06)] overflow-hidden flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#F0E6D8] flex items-center justify-between bg-[#FFFBF5] flex-shrink-0">
        <h3 className="font-semibold text-[#1A1208] text-sm">{title}</h3>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Body */}
      <div className="p-5 flex-1">{children}</div>
    </div>
  );
}

