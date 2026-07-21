import * as React from 'react';
import { cn } from '../../utils/cn';
import { colors, radius, shadows } from '@/design-system';

/**
 * Design System — Card Component
 *
 * All cards share: border-radius lg (16px), padding, shadow, hover effect.
 * Whether it's Food Card, Dashboard Card, or Order Card — they feel related.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'glass' | 'interactive';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyle = 'rounded-2xl transition-all duration-[250ms] font-sans overflow-hidden border';

    const variants: Record<string, { backgroundColor: string; borderColor: string; boxShadow?: string; cursor?: string; backdropFilter?: string }> = {
      default: { backgroundColor: colors.surface, borderColor: colors.border, boxShadow: shadows.card },
      flat: { backgroundColor: colors.surface, borderColor: colors.border, boxShadow: 'none' },
      glass: { backgroundColor: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.6)', boxShadow: shadows.card, backdropFilter: 'blur(16px)' },
      interactive: { backgroundColor: colors.surface, borderColor: colors.border, boxShadow: shadows.card, cursor: 'pointer' },
    };

    const resolvedVariant = variants[variant] ?? variants.default;

    return (
      <div
        ref={ref}
        className={cn(baseStyle, className)}
        style={{
          backgroundColor: resolvedVariant.backgroundColor,
          borderColor: resolvedVariant.borderColor,
          boxShadow: resolvedVariant.boxShadow,
          borderRadius: radius.lg,
          cursor: resolvedVariant.cursor,
          backdropFilter: resolvedVariant.backdropFilter,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

