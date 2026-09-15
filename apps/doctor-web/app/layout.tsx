import React from 'react';
import './globals.css';
import { LanguageProvider } from '../components/LanguageContext';

export const metadata = {
  title: 'DocNest Doctor Portal — Deoria',
  description: 'Manage clinic OPD live queue, tokens, and patient appointments in Deoria.',
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
      <body className="bg-slate-50 text-slate-900 antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
