'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Tv,
  QrCode,
  Pill,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  Stethoscope,
  X
} from 'lucide-react';
import { DocNestUser } from '../lib/auth';
import { LanguageTogglePill } from './LanguageContext';

interface SidebarProps {
  user: DocNestUser;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const doctorLinks = [
  { href: '/doctor/dashboard', icon: LayoutDashboard, label: 'OPD Queue' },
  { href: '/doctor/prescription', icon: FileText, label: 'Digital Rx' },
  { href: '/doctor/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/doctor/tv', icon: Tv, label: 'TV Display' },
  { href: '/doctor/qr-flyer', icon: QrCode, label: 'QR Flyer' },
];

const compounderLinks = [
  { href: '/compounder/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/compounder/dispense', icon: Pill, label: 'Dispense Rx' },
];

const adminLinks = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ user, onLogout, isOpenMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const links = user.role === 'doctor' ? doctorLinks : user.role === 'compounder' ? compounderLinks : adminLinks;

  const roleColors: Record<string, string> = {
    doctor: 'from-emerald-600 to-teal-700',
    compounder: 'from-blue-600 to-indigo-700',
    admin: 'from-purple-600 to-violet-700',
  };

  const roleIcons: Record<string, string> = {
    doctor: '🩺',
    compounder: '💊',
    admin: '🛡️',
  };

  const roleLabels: Record<string, string> = {
    doctor: 'Doctor Portal',
    compounder: 'Compounder Portal',
    admin: 'Admin Panel',
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transform transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className={`p-5 bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-2xl">
              {roleIcons[user.role]}
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight">DocNest</h1>
              <p className="text-xs text-white/70 font-medium">{roleLabels[user.role]}</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-white/80 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold text-sm border border-slate-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.specialty || user.email || user.phone}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <link.icon className={`w-4.5 h-4.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <LanguageTogglePill />
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
