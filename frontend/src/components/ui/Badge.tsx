import * as React from 'react';
import { cn } from '../../utils/cn';
import { colors, radius } from '@/design-system';

/**
 * Design System — Badge Component
 *
 * Replaces: features/admin/components/StatusBadge.tsx
 * Use everywhere: order status, food type, inventory alerts, user roles.
 *
 * Variants: success | warning | danger | info | neutral
 * Sizes:    sm | md
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
  children,
  ...props
}) => {
  const variants: Record<string, { backgroundColor: string; color: string; borderColor: string; dotColor: string }> = {
    success: { backgroundColor: colors.successBg, color: colors.successText, borderColor: colors.successBorder, dotColor: colors.success },
    warning: { backgroundColor: colors.warningBg, color: colors.warningText, borderColor: colors.warningBorder, dotColor: colors.warning },
    danger: { backgroundColor: colors.dangerBg, color: colors.dangerText, borderColor: colors.dangerBorder, dotColor: colors.danger },
    info: { backgroundColor: colors.infoBg, color: colors.infoText, borderColor: colors.infoBorder, dotColor: colors.info },
    neutral: { backgroundColor: colors.surface2, color: colors.text2, borderColor: colors.border, dotColor: colors.muted },
  };

  const sizes: Record<string, string> = {
    sm: 'px-2 py-0.5 text-[11px] font-bold',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  const resolvedVariant = variants[variant] ?? variants.neutral;

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full border', sizes[size], className)}
      style={{
        backgroundColor: resolvedVariant.backgroundColor,
        color: resolvedVariant.color,
        borderColor: resolvedVariant.borderColor,
        borderRadius: radius.full,
      }}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: resolvedVariant.dotColor }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
