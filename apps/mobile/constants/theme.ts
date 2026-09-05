/**
 * DocNest Design System — Ultra Professional Healthcare Palette
 * Inspired by One Medical, Apple Health, and Practo Prime.
 * 
 * Primary: Emerald Medical Green (#059669)
 * Accent: Warm Coral (#FF6B35)
 * Surfaces: Pure Crisp White (#FFFFFF) on Soft Slate Tint (#F8FAFC)
 * Text: Deep Rich Slate (#0F172A)
 */

export const COLORS = {
  // Primary brand colors (Emerald Medical Green)
  primary: '#059669',
  primaryDark: '#047857',
  primaryLight: '#ECFDF5',
  primaryMuted: '#A7F3D0',
  tealLight: '#ECFDF5',

  // Secondary / Accent (Warm Coral)
  secondary: '#FF6B35',
  accent: '#FF6B35',
  accentDark: '#E65A2B',
  accentLight: '#FFF7ED',

  // Backgrounds & Surfaces
  white: '#FFFFFF',
  background: '#F8FAFC',
  backgroundSecondary: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text Hierarchy (High Contrast & Clean Readability)
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#059669',

  // Status Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#0284C7',
  infoLight: '#E0F2FE',

  // Queue Status Colors
  queueActive: '#059669',
  queuePaused: '#F59E0B',
  queueClosed: '#64748B',
  queueYourTurn: '#EF4444',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#F1F5F9',

  // Integrations & Features
  whatsappGreen: '#25D366',
  razorpayBlue: '#072654',

  // Rating Stars
  starFilled: '#F59E0B',
  starEmpty: '#E2E8F0',
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  '2xl': 28,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  modal: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 10,
  },
} as const;
