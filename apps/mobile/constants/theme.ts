/**
 * DocNest Design System
 * Colors, typography, spacing, shadows — used everywhere in the app.
 * 
 * Primary: Medical Teal Green (#0A8F6C)
 * Accent: Medicave Orange (#FF6B35)
 */

export const COLORS = {
  // Primary brand colors
  primary: '#0A8F6C',
  primaryDark: '#067A5B',
  primaryLight: '#E6F7F2',
  primaryMuted: '#B2DFD0',
  tealLight: '#E6F7F2',

  // Secondary / Accent (Medicave orange)
  secondary: '#FF6B35',
  accent: '#FF6B35',
  accentDark: '#E65A2B',
  accentLight: '#FFF0EB',

  // Backgrounds & Neutrals
  white: '#FFFFFF',
  background: '#F8FFFE',
  backgroundSecondary: '#F8FFFE',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#0A8F6C',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Queue status colors
  queueActive: '#10B981',
  queuePaused: '#F59E0B',
  queueClosed: '#6B7280',
  queueYourTurn: '#EF4444',

  // Borders & dividers
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#F3F4F6',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.5)',
  skeleton: '#E5E7EB',
  skeletonHighlight: '#F3F4F6',
  whatsappGreen: '#25D366',
  razorpayBlue: '#072654',

  // Rating stars
  starFilled: '#F59E0B',
  starEmpty: '#D1D5DB',
} as const;

export const FONTS = {
  regular: 'NotoSans-Regular',
  medium: 'NotoSans-Medium',
  semiBold: 'NotoSans-SemiBold',
  bold: 'NotoSans-Bold',
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  xxl: 32,
} as const;

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  xxl: 24,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const ICON_SIZES = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
  '2xl': 48,
} as const;

export const QUEUE_THEME = {
  tokenBadge: {
    backgroundColor: COLORS.primary,
    textColor: COLORS.textInverse,
    size: 64,
    fontSize: 28,
  },
  currentServing: {
    backgroundColor: COLORS.queueActive,
    textColor: COLORS.textInverse,
    pulseColor: 'rgba(16, 185, 129, 0.3)',
  },
  yourTurn: {
    backgroundColor: COLORS.queueYourTurn,
    textColor: COLORS.textInverse,
    pulseColor: 'rgba(239, 68, 68, 0.3)',
  },
} as const;
