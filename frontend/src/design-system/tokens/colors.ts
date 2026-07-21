/**
 * Design System color tokens.
 */

export const colors = {
  primary: '#E8441A',
  primaryDark: '#C93B15',
  primaryLight: '#FF6B3D',
  primaryBg: '#FFF0EB',
  secondary: '#F59E0B',
  secondaryDark: '#D97706',
  success: '#16A34A',
  successBg: '#DCFCE7',
  successBorder: '#BBF7D0',
  successText: '#15803D',
  warning: '#F59E0B',
  warningBg: '#FEF9C3',
  warningBorder: '#FDE68A',
  warningText: '#B45309',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  dangerBorder: '#FECACA',
  dangerText: '#B91C1C',
  info: '#2563EB',
  infoBg: '#DBEAFE',
  infoBorder: '#BFDBFE',
  infoText: '#1D4ED8',
  background: '#FFFBF5',
  background2: '#FFF5E9',
  background3: '#FFECD6',
  surface: '#FFFFFF',
  surface2: '#FDF8F2',
  text: '#1A1208',
  text2: '#4A3728',
  text3: '#8C6E5A',
  muted: '#B5957D',
  border: '#F0E6D8',
  border2: '#E5D5C0',
  shadowPrimary: 'rgba(232, 68, 26, 0.08)',
  shadowDark: 'rgba(26, 18, 8, 0.12)',
} as const;

export type ColorToken = keyof typeof colors;
