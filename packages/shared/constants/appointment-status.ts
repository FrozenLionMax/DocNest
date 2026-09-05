export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PAY_AT_CLINIC: 'pay_at_clinic',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const;

export const QUEUE_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CLOSED: 'closed',
} as const;

export const QUEUE_ENTRY_STATUS = {
  WAITING: 'waiting',
  IN_CONSULTATION: 'in_consultation',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
  CANCELLED: 'cancelled',
} as const;

export const DAYS_OF_WEEK = [
  { value: 0, label_en: 'Sunday', label_hi: 'रविवार' },
  { value: 1, label_en: 'Monday', label_hi: 'सोमवार' },
  { value: 2, label_en: 'Tuesday', label_hi: 'मंगलवार' },
  { value: 3, label_en: 'Wednesday', label_hi: 'बुधवार' },
  { value: 4, label_en: 'Thursday', label_hi: 'गुरुवार' },
  { value: 5, label_en: 'Friday', label_hi: 'शुक्रवार' },
  { value: 6, label_en: 'Saturday', label_hi: 'शनिवार' },
] as const;
