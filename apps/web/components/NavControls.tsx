'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight, LogOut, Home } from 'lucide-react';
import { logout, getSession, DocNestUser } from '../lib/auth';

interface NavControlsProps {
  /** Optional fallback URL if browser history has nowhere to go */
  fallbackBackUrl?: string;
  fallbackForwardUrl?: string;
  /** Whether to show the Home button (defaults to true) */
  showHome?: boolean;
  /** Whether to show the Logout button (defaults to true) */
  showLogout?: boolean;
  /** Custom title or breadcrumb segment next to controls */
  title?: string;
  /** Optional extra classes */
  className?: string;
  /** Compact mode for smaller headers or toolbars */
  compact?: boolean;
}

export default function NavControls({
  fallbackBackUrl,
  fallbackForwardUrl,
  showHome = true,
  showLogout = true,
  title,
  className = '',
  compact = false,
}: NavControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUser, setCurrentUser] = useState<DocNestUser | null>(null);

  useEffect(() => {
    // Check session
    const session = getSession();
    setCurrentUser(session);

    // Browser navigation detection
    if (typeof window !== 'undefined') {
      // In modern browsers, window.history.length reflects entries in this session tab
      setCanGoBack(window.history.length > 1);
      // Navigation API support in modern Chrome/Edge:
      const nav = (window as any).navigation;
      if (nav) {
        if (typeof nav.canGoBack === 'boolean') setCanGoBack(nav.canGoBack);
        if (typeof nav.canGoForward === 'boolean') setCanGoForward(nav.canGoForward);

        const updateNav = () => {
          if (typeof nav.canGoBack === 'boolean') setCanGoBack(nav.canGoBack);
          if (typeof nav.canGoForward === 'boolean') setCanGoForward(nav.canGoForward);
        };
        nav.addEventListener?.('navigate', updateNav);
        return () => nav.removeEventListener?.('navigate', updateNav);
      } else {
        // Fallback heuristic: canGoForward is assumed true if user has traversed backwards
        setCanGoForward(true);
      }
    }
  }, [pathname]);

  // Handle Smart Back
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (fallbackBackUrl) {
      router.push(fallbackBackUrl);
    } else {
      // Intelligent fallback by route segment
      if (pathname.startsWith('/doctor/')) router.push('/doctor/dashboard');
      else if (pathname.startsWith('/patient/')) router.push('/patient');
      else if (pathname.startsWith('/admin/')) router.push('/admin/dashboard');
      else if (pathname.startsWith('/compounder/')) router.push('/compounder/dashboard');
      else if (pathname.startsWith('/agent/')) router.push('/agent/dashboard');
      else if (pathname.startsWith('/block/')) router.push('/block/dashboard');
      else if (pathname.startsWith('/district/')) router.push('/district/dashboard');
      else router.push('/');
    }
  };

  // Handle Smart Forward
  const handleForward = () => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    } else if (fallbackForwardUrl) {
      router.push(fallbackForwardUrl);
    }
  };

  // Handle Smart Home Navigation
  const handleHome = () => {
    if (currentUser) {
      const homeRoutes: Record<string, string> = {
        doctor: '/doctor/dashboard',
        compounder: '/compounder/dashboard',
        admin: '/admin/dashboard',
        patient: '/patient',
        field_agent: '/agent/dashboard',
        block_coordinator: '/block/dashboard',
        district_admin: '/district/dashboard',
      };
      router.push(homeRoutes[currentUser.role] || '/');
    } else {
      router.push('/');
    }
  };

  // Handle Smart Logout with cleanup and redirection
  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const btnBase = compact
    ? 'p-1.5 rounded-xl transition duration-150 active:scale-95 text-xs font-semibold flex items-center justify-center'
    : 'px-2.5 py-1.5 rounded-xl transition duration-150 active:scale-95 text-xs font-semibold flex items-center space-x-1.5';

  return (
    <div className={`flex items-center space-x-2 select-none ${className}`}>
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        disabled={!canGoBack && !fallbackBackUrl && pathname === '/'}
        className={`${btnBase} ${
          canGoBack || fallbackBackUrl || pathname !== '/'
            ? 'bg-[#141e28] hover:bg-[#1f2f3f] text-[#a4ccd9] hover:text-white border border-[rgba(196,225,230,0.18)] hover:border-[#8dbcc7]/40 shadow-sm'
            : 'bg-[#141e28]/40 text-slate-600 border border-transparent cursor-not-allowed'
        }`}
        title="Go Back (Alt + Left Arrow)"
        aria-label="Go Back"
      >
        <ArrowLeft className={compact ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        {!compact && <span className="hidden sm:inline">Back</span>}
      </button>

      {/* Forward Button */}
      <button
        type="button"
        onClick={handleForward}
        className={`${btnBase} bg-[#141e28] hover:bg-[#1f2f3f] text-[#a4ccd9] hover:text-white border border-[rgba(196,225,230,0.18)] hover:border-[#8dbcc7]/40 shadow-sm`}
        title="Go Forward (Alt + Right Arrow)"
        aria-label="Go Forward"
      >
        {!compact && <span className="hidden sm:inline">Forward</span>}
        <ArrowRight className={compact ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      </button>

      {/* Role Home shortcut */}
      {showHome && pathname !== '/' && (
        <button
          type="button"
          onClick={handleHome}
          className={`${btnBase} bg-[#141e28] hover:bg-[#1f2f3f] text-[#c4e1e6] hover:text-white border border-[rgba(196,225,230,0.18)] hover:border-[#8dbcc7]/40 shadow-sm`}
          title="Return to Portal Home"
          aria-label="Portal Home"
        >
          <Home className={compact ? 'w-4 h-4 text-[#8dbcc7]' : 'w-3.5 h-3.5 text-[#8dbcc7]'} />
          {!compact && <span className="hidden sm:inline">Home</span>}
        </button>
      )}

      {/* Optional Title Label / Path */}
      {title && (
        <span className="hidden md:inline-block text-xs font-bold text-slate-400 pl-1 border-l border-slate-700/60 truncate max-w-[200px]">
          {title}
        </span>
      )}

      {/* Dedicated Logout Button (if enabled & authenticated) */}
      {showLogout && (currentUser || pathname !== '/login') && (
        <button
          type="button"
          onClick={handleLogout}
          className={`${btnBase} bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 hover:border-rose-700/60 shadow-sm ml-auto`}
          title="Sign Out of Portal"
          aria-label="Logout"
        >
          <LogOut className={compact ? 'w-4 h-4 text-rose-400' : 'w-3.5 h-3.5 text-rose-400'} />
          {!compact && <span>Logout</span>}
        </button>
      )}
    </div>
  );
}
