import React from 'react';

export const metadata = {
  title: 'DocNest Admin Control Panel — Deoria Healthcare Platform',
  description: 'Master management for Deoria doctors, OPD queues, specialties, and Medicave orders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-900 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased">
        {children}
      </body>
    </html>
  );
}
