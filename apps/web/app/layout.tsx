import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '../components/LanguageContext';
import CommandPalette from '../components/CommandPalette';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0c1219',
};

export const metadata: Metadata = {
  title: 'DocNest — Healthcare Appointment & Clinic Operations Platform',
  description: 'District Healthcare Platform connecting Patients, Doctors, Compounders, Field Agents, and Administration.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DocNest',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#0c1219] text-slate-100 antialiased font-['Plus_Jakarta_Sans',sans-serif] selection:bg-teal-500 selection:text-slate-950 overflow-x-hidden min-h-screen"
      >
        <LanguageProvider>
          {children}
          <CommandPalette />
        </LanguageProvider>
      </body>
    </html>
  );
}
