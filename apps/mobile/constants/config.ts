/**
 * App configuration — Supabase credentials, Razorpay keys, etc.
 * These read from environment variables (set in .env file).
 */

export const CONFIG = {
  // Supabase
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY',

  // Razorpay
  RAZORPAY_KEY_ID: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '',

  // Medicave WhatsApp
  MEDICAVE_WHATSAPP: process.env.EXPO_PUBLIC_MEDICAVE_WHATSAPP || '919XXXXXXXXX',
  MEDICAVE_PHONE: process.env.EXPO_PUBLIC_MEDICAVE_PHONE || '9XXXXXXXXX',

  // App
  APP_NAME: 'DocNest',
  APP_TAGLINE_EN: "Deoria's Own Health App",
  APP_TAGLINE_HI: 'देवरिया का अपना हेल्थ ऐप',
  APP_VERSION: '1.0.0',
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.medicave.docnest',

  // Defaults
  DEFAULT_LANGUAGE: 'hi' as const,
  DEFAULT_CITY: 'Deoria',
  DEFAULT_SLOT_DURATION: 15, // minutes
  DEFAULT_CONSULTATION_FEE: 300,

  // Queue
  QUEUE_REFRESH_INTERVAL: 5000, // 5 seconds (real-time via Supabase, this is fallback)
  QUEUE_NOTIFICATION_BEFORE: 3, // Notify when 3 patients ahead
} as const;
