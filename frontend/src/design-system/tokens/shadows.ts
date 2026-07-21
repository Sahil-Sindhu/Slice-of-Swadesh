/**
 * Design System shadow tokens.
 */

export const shadows = {
  card: '0 4px 20px -4px rgba(26, 18, 8, 0.06)',
  dropdown: '0 8px 30px -4px rgba(26, 18, 8, 0.10)',
  modal: '0 20px 60px -8px rgba(26, 18, 8, 0.18)',
  floating: '0 12px 40px -4px rgba(232, 68, 26, 0.22)',
  cardHover: '0 12px 32px -8px rgba(26, 18, 8, 0.10)',
} as const;

export type ShadowToken = keyof typeof shadows;
