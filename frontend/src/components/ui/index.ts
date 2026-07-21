/**
 * Design System — UI Components Barrel Export
 *
 * Import all design system primitives from here:
 * import { Button, Card, Input, Badge, Table, Modal, Toast, EmptyState, Skeleton, LoadingOverlay } from '@/components/ui';
 */

// -- Existing (upgraded) primitives ---------------------------------------------
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { LoadingSpinner } from './LoadingSpinner';
export type { LoadingSpinnerProps } from './LoadingSpinner';

// -- New primitives -------------------------------------------------------------
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from './Table';
export type { TableProps, TableColumn } from './Table';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { ToastProvider, ToastContext } from './Toast';
export type { ToastItem, ToastVariant } from './Toast';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { LoadingOverlay } from './LoadingOverlay';
export type { LoadingOverlayProps } from './LoadingOverlay';
