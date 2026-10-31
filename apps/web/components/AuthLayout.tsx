'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout, DocNestUser, UserRole } from '../lib/auth';
import Sidebar from './Sidebar';
import { Loader2, Menu, LogOut } from 'lucide-react';

import { LanguageTogglePill } from './LanguageContext';
import DocNestLogo from './DocNestLogo';
import NavControls from './NavControls';

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
      <div className="min-h-screen bg-[#0c1219] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-mesh-dark text-slate-100">
      {/* Mobile Top Header - Single row, sleek and compact */}
      <header className="md:hidden bg-[#0c1219]/95 border-b border-[rgba(196,225,230,0.14)] px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-md backdrop-blur-md">
        <DocNestLogo size="sm" subtitle="Clinical Portal" />
        <div className="flex items-center space-x-2">
          <LanguageTogglePill />
          <button
            onClick={handleLogout}
            className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-xl border border-rose-800/40 text-xs flex items-center"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-[#141e28] text-slate-300 hover:text-white rounded-xl border border-[rgba(196,225,230,0.14)]"
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
        <header className="hidden md:flex bg-[#0c1219]/90 border-b border-[rgba(196,225,230,0.14)] px-6 py-2.5 justify-between items-center sticky top-0 z-20 backdrop-blur-md shadow-sm">
          <div className="flex items-center space-x-4">
            <NavControls showHome={true} showLogout={false} />
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#a4ccd9]/70 font-extrabold uppercase tracking-wider">DocNest Portal</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-[#ebffd8] font-black">{user.clinic || user.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageTogglePill />
            <NavControls compact={false} showHome={false} showLogout={true} />
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
