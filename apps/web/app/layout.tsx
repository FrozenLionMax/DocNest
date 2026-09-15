import React from 'react';
import './globals.css';
import { LanguageProvider } from '../components/LanguageContext';

export const metadata = {
  title: 'DocNest — Unified Healthcare Portal',
  description: 'Unified portal for Doctors, Compounders, and Admins. Deoria Healthcare Platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
