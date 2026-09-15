'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout, DocNestUser, UserRole } from '../lib/auth';
import Sidebar from './Sidebar';
import { Loader2, Menu } from 'lucide-react';

import { LanguageTogglePill } from './LanguageContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function AuthLayout({ children, allowedRoles }: AuthLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<DocNestUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/');
      return;
    }
    if (!allowedRoles.includes(session.role)) {
      router.replace(`/${session.role}/dashboard`);
      return;
    }
    setUser(session);
    setChecking(false);
  }, [router, allowedRoles]);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (checking || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🏥</span>
          <span className="font-extrabold text-white">DocNest</span>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageTogglePill />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sidebar with Mobile Drawer Props */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Global Top Task Bar */}
        <header className="hidden md:flex bg-slate-900/90 border-b border-slate-800/90 px-6 py-3 justify-between items-center sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">DocNest Healthcare Portal</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-emerald-400 font-extrabold">{user.clinic || user.name}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Global Language Switcher Pill */}
            <LanguageTogglePill />
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
