import * as React from 'react';
import { Card } from '@/components/ui/Card';

export interface AnalyticsCardProps {
  title: string;
  value: string;
  change?: number;
  timeframe?: string;
}

export function AnalyticsCard({ title, value, change, timeframe }: AnalyticsCardProps) {
  const changeText = typeof change === 'number' ? `${change > 0 ? '+' : ''}${change}%` : undefined;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-[#8C6E5A] font-semibold">{title}</div>
          <div className="text-xl font-bold text-[#1A1208] mt-1">{value}</div>
        </div>

        {changeText && (
          <div className="text-sm font-medium text-[#4A3728] text-right">
            <div>{changeText}</div>
            {timeframe && <div className="text-xs text-[#8C6E5A]">{timeframe}</div>}
          </div>
        )}
      </div>
    </Card>
  );
}
