import * as React from 'react';
import { cn } from '../../utils/cn';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

/**
 * Design System - Table Component
 *
 * One reusable table. Admin, Inventory, Orders, Employees, Analytics - all use this.
 * Features: sticky header, striped rows, loading skeleton, empty state, sortable cols.
 */

export interface TableColumn<T = Record<string, any>> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  width?: string;
}

export interface TableProps<T = Record<string, any>> {
  columns: TableColumn<T>[];
  data: T[];
  keyField?: string;
  isLoading?: boolean;
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (row: T) => void;
  selectedKey?: string;
  className?: string;
  stickyHeader?: boolean;
}

export function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <thead className={cn('bg-[#FFFBF5] border-b border-[#F0E6D8]', className)}>
      {children}
    </thead>
  );
}

export function TableHead({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <th
      scope="col"
      style={style}
      className={cn(
        'px-5 py-3 text-left text-xs font-bold text-[#8C6E5A] uppercase tracking-wider whitespace-nowrap',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tbody className={cn('divide-y divide-[#F0E6D8]', className)}>{children}</tbody>;
}

export function TableRow({
  children,
  onClick,
  isSelected,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors duration-150',
        onClick && 'cursor-pointer',
        isSelected
          ? 'bg-[#FFF0EB]'
          : onClick
          ? 'hover:bg-[#FFFBF5]'
          : '',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn('px-5 py-3.5 text-sm text-[#4A3728] align-middle', className)}>
      {children}
    </td>
  );
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  isLoading = false,
  skeletonRows = 5,
  emptyTitle = 'No data found',
  emptyDescription,
  emptyIcon,
  onRowClick,
  selectedKey,
  className,
  stickyHeader = false,
}: TableProps<T>) {
  return (
    <div className={cn('w-full bg-white rounded-2xl border border-[#F0E6D8] overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <TableHeader className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(col.headerClassName)}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </TableHead>
              ))}
            </tr>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="border-t border-[#F0E6D8]">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const key = String(row[keyField] ?? index);
                return (
                  <TableRow
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    isSelected={selectedKey === key}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.render ? col.render(row, index) : String(row[col.key] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
