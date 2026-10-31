'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  PlusCircle,
  FileText,
  User,
  LayoutDashboard,
  Stethoscope,
  Pill,
  Tv,
  QrCode
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  // Hide on public landing or presentation pages if desired, or show relevant role tabs
  if (!pathname || pathname === '/' || pathname === '/login' || pathname.startsWith('/doctor/tv') || pathname.startsWith('/consultation/video')) {
    return null;
  }

  // Determine user role based on pathname
  const isDoctor = pathname.startsWith('/doctor');
  const isCompounder = pathname.startsWith('/compounder');
  const isPatient = pathname.startsWith('/patient');

  // Define tabs per role
  const patientTabs = [
    {
      href: '/patient',
      icon: Home,
      label: 'Home',
      labelHi: 'होम',
      exact: true,
    },
    {
      href: '/patient/book',
      icon: PlusCircle,
      label: 'Book Token',
      labelHi: 'टोकन बुक',
      highlight: true,
    },
    {
      href: '/patient/appointments',
      icon: Calendar,
      label: 'Bookings',
      labelHi: 'अपॉइंटमेंट',
    },
    {
      href: '/patient/history',
      icon: FileText,
      label: 'Rx Records',
      labelHi: 'पर्चा',
    },
    {
      href: '/patient/settings',
      icon: User,
      label: 'Profile',
      labelHi: 'प्रोफ़ाइल',
    },
  ];

  const doctorTabs = [
    {
      href: '/doctor/dashboard',
      icon: LayoutDashboard,
      label: 'OPD Queue',
      labelHi: 'OPD कतार',
      exact: true,
    },
    {
      href: '/doctor/prescription',
      icon: Stethoscope,
      label: 'Digital Rx',
      labelHi: 'डिजिटल पर्चा',
      highlight: true,
    },
    {
      href: '/doctor/schedule',
      icon: Calendar,
      label: 'Schedule',
      labelHi: 'समय',
    },
    {
      href: '/doctor/qr-flyer',
      icon: QrCode,
      label: 'Poster',
      labelHi: 'पोस्टर',
    },
  ];

  const compounderTabs = [
    {
      href: '/compounder/dashboard',
      icon: LayoutDashboard,
      label: 'Queue',
      labelHi: 'कतार',
      exact: true,
    },
    {
      href: '/compounder/dispense',
      icon: Pill,
      label: 'Dispense',
      labelHi: 'दवा वितरण',
      highlight: true,
    },
  ];

  const tabs = isDoctor ? doctorTabs : isCompounder ? compounderTabs : patientTabs;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl bg-slate-950/95 border-t border-slate-800/80 shadow-[0_-10px_30px_rgba(0,0,0,0.7)] px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),12px)] select-none transition-all duration-200"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(tab.href + '/');

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl min-h-[50px] transition-all duration-200 active:scale-95 group relative ${
                isActive
                  ? 'text-teal-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {tab.highlight ? (
                <div
                  className={`w-10 h-10 -mt-3.5 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 ${
                    isActive
                      ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-teal-500/30 scale-105'
                      : 'bg-teal-600 text-white shadow-teal-900/40 group-hover:scale-105'
                  }`}
                >
                  <tab.icon className="w-5 h-5 stroke-[2.5]" />
                </div>
              ) : (
                <div className="relative">
                  <tab.icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'text-teal-400 scale-110 stroke-[2.5]' : 'group-hover:scale-105'
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                  )}
                </div>
              )}

              <span
                className={`text-[10px] tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-teal-300 font-extrabold' : 'text-slate-400'
                }`}
              >
                {lang === 'hi' ? tab.labelHi : tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
