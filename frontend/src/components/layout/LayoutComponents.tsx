import * as React from 'react';
import { cn } from '../../utils/cn';

// Container
export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)} {...props}>
    {children}
  </div>
);

// Section
export const Section: React.FC<React.HTMLAttributes<HTMLDivElement> & { py?: 'sm' | 'md' | 'lg' | 'none' }> = ({
  className,
  py = 'md',
  children,
  ...props
}) => {
  const paddings = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-20',
    lg: 'py-16 md:py-28',
  };
  return (
    <section className={cn(paddings[py], className)} {...props}>
      {children}
    </section>
  );
};

// Grid
export const Grid: React.FC<React.HTMLAttributes<HTMLDivElement> & { cols?: 1 | 2 | 3 | 4 | 5 | 6 | 'responsive' }> = ({
  className,
  cols = 'responsive',
  children,
  ...props
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
    responsive: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };
  const colKey = cols as keyof typeof gridCols;
  return (
    <div className={cn('grid gap-6', gridCols[colKey] || gridCols.responsive, className)} {...props}>
      {children}
    </div>
  );
};

// Flex
export const Flex: React.FC<React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'center' | 'end' | 'stretch'; justify?: 'start' | 'center' | 'end' | 'between' | 'around'; gap?: 'sm' | 'md' | 'lg' | 'none' }> = ({
  className,
  align = 'center',
  justify = 'start',
  gap = 'md',
  children,
  ...props
}) => {
  const alignments = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' };
  const justifications = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between', around: 'justify-around' };
  const gaps = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
  return (
    <div className={cn('flex flex-row', alignments[align], justifications[justify], gaps[gap], className)} {...props}>
      {children}
    </div>
  );
};

// Stack
export const Stack: React.FC<React.HTMLAttributes<HTMLDivElement> & { gap?: 'sm' | 'md' | 'lg' | 'none' }> = ({
  className,
  gap = 'md',
  children,
  ...props
}) => {
  const gaps = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
  return (
    <div className={cn('flex flex-col', gaps[gap], className)} {...props}>
      {children}
    </div>
  );
};

// PageWrapper
export const PageWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('flex-grow flex flex-col w-full min-h-screen bg-background text-foreground transition-colors duration-300', className)} {...props}>
    {children}
  </div>
);
