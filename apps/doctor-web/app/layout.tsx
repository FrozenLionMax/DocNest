import React from 'react';

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
    <html lang="hi">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] antialiased">
        {children}
      </body>
    </html>
  );
}
