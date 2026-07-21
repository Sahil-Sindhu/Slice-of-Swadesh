import * as React from 'react';
import { Badge } from '../../../components/ui/Badge';
import type { BadgeProps } from '../../../components/ui/Badge';

/**
 * StatusBadge — Order/Inventory Status
 *
 * Wrapper around the design system Badge component.
 * Maps domain-specific status strings to semantic Badge variants.
 *
 * @deprecated - prefer importing Badge directly from '@/components/ui'
 */

type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled' | 'Out for Delivery';

const STATUS_VARIANT: Record<string, BadgeProps['variant']> = {
  Pending:          'warning',
  Preparing:        'info',
  Ready:            'success',
  Completed:        'neutral',
  Cancelled:        'danger',
  'Out for Delivery': 'info',
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANT[status] ?? 'neutral';
  return (
    <Badge variant={variant} dot>
      {status}
    </Badge>
  );
}

