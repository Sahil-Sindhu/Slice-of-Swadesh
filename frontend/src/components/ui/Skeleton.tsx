import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * Design System — Skeleton Component
 *
 * Composable skeleton for all loading states.
 * Don't create FoodSkeleton, OrderSkeleton, MenuSkeleton separately —
 * compose them using this single primitive.
 *
 * @example
 * <Skeleton className="h-4 w-3/4" />           // text line
 * <Skeleton shape="circle" className="w-10 h-10" />  // avatar
 * <Skeleton className="h-48 w-full" />          // image
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, shape = 'rect', ...props }) => {
  const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'text' ? 'rounded-md' : 'rounded-xl';

  return (
    <div
      className={cn(
        // bg-[#FFECD6] = var(--bg-3) — the lightest brand surface, not undefined 'foreground'
        'animate-pulse bg-[#FFECD6]',
        shapeClass,
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
};

Skeleton.displayName = 'Skeleton';

