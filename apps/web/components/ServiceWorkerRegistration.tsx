'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('DocNest Service Worker registered with scope:', registration.scope);

            // Check for periodic background sync support
            if ('periodicSync' in registration) {
              const pSync = (registration as any).periodicSync;
              pSync.register('refresh-opd-status', {
                minInterval: 12 * 60 * 60 * 1000 // 12 hours
              }).catch(() => null);
            }
          })
          .catch((error) => {
            console.warn('DocNest Service Worker registration error:', error);
          });
      });
    }
  }, []);

  return null;
}
