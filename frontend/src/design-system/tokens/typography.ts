/**
 * Design System typography tokens.
 */

export const typography = {
  fontSans: 'var(--font-inter), system-ui, sans-serif',
  fontDisplay: 'var(--font-outfit), system-ui, sans-serif',
  fontHeading: 'var(--font-poppins), system-ui, sans-serif',
  size: {
    display: '48px',
    h1: '36px',
    h2: '30px',
    h3: '24px',
    body: '16px',
    small: '14px',
    caption: '12px',
    micro: '11px',
  },
  class: {
    display: 'text-5xl',
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl',
    body: 'text-base',
    small: 'text-sm',
    caption: 'text-xs',
  },
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  leading: {
    tight: '1.2',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
  },
} as const;
