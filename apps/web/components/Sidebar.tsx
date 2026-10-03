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
  X,
  CreditCard,
  UserCheck,
  Building2,
  Landmark,
  UserPlus
} from 'lucide-react';
import { DocNestUser, UserRole } from '../lib/auth';
import { LanguageTogglePill } from './LanguageContext';
import { ThemeTogglePill } from './ThemeContext';

interface SidebarProps {
  user: DocNestUser;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const doctorLinks = [
  { href: '/doctor/dashboard', icon: LayoutDashboard, label: 'OPD Queue' },
  { href: '/doctor/prescription', icon: FileText, label: 'Digital Rx' },
  { href: '/doctor/patients', icon: Users, label: 'Patient Records' },
  { href: '/doctor/earnings', icon: CreditCard, label: 'Earnings' },
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

const fieldAgentLinks = [
  { href: '/agent/dashboard', icon: UserPlus, label: 'Quick Booking' },
  { href: '/agent/bookings', icon: FileText, label: 'My Bookings' },
];

const blockCoordinatorLinks = [
  { href: '/block/dashboard', icon: Building2, label: 'Block Overview' },
  { href: '/block/agents', icon: UserCheck, label: 'Village Agents' },
];

const districtAdminLinks = [
  { href: '/district/dashboard', icon: Landmark, label: 'District Overview' },
  { href: '/district/payments', icon: CreditCard, label: 'Payments & Revenue' },
  { href: '/district/doctors', icon: Stethoscope, label: 'All Doctors' },
  { href: '/district/agents', icon: Users, label: 'Agent Hierarchy' },
];

const patientLinks = [
  { href: '/patient', icon: LayoutDashboard, label: 'Patient Home' },
  { href: '/patient/doctors', icon: Stethoscope, label: 'Find Doctors' },
  { href: '/patient/appointments', icon: Calendar, label: 'My Appointments' },
  { href: '/patient/history', icon: FileText, label: 'Medical History' },
  { href: '/patient/settings', icon: Settings, label: 'Preferences' },
];

export default function Sidebar({ user, onLogout, isOpenMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const getLinks = (role: UserRole) => {
    switch (role) {
      case 'doctor': return doctorLinks;
      case 'compounder': return compounderLinks;
      case 'admin': return adminLinks;
      case 'field_agent': return fieldAgentLinks;
      case 'block_coordinator': return blockCoordinatorLinks;
      case 'district_admin': return districtAdminLinks;
      case 'patient': return patientLinks;
      default: return doctorLinks;
    }
  };

  const links = getLinks(user.role);

  const roleColors: Record<UserRole, string> = {
    doctor: 'from-emerald-600 to-teal-700',
    compounder: 'from-blue-600 to-indigo-700',
    admin: 'from-purple-600 to-violet-700',
    field_agent: 'from-amber-600 to-orange-700',
    block_coordinator: 'from-cyan-600 to-blue-700',
    district_admin: 'from-rose-600 to-pink-700',
    patient: 'from-emerald-500 to-teal-600',
  };

  const roleIcons: Record<UserRole, string> = {
    doctor: '🩺',
    compounder: '💊',
    admin: '🛡️',
    field_agent: '👤',
    block_coordinator: '🏢',
    district_admin: '🏛️',
    patient: '📱',
  };

  const roleLabels: Record<UserRole, string> = {
    doctor: 'Doctor Portal',
    compounder: 'Compounder Portal',
    admin: 'Admin Panel',
    field_agent: 'Field Agent',
    block_coordinator: 'Block Coordinator',
    district_admin: 'District HQ / DC',
    patient: 'Patient Portal',
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
        <div className={`p-5 bg-gradient-to-br ${roleColors[user.role] || 'from-emerald-600 to-teal-700'} flex items-center justify-between shadow-lg`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-2xl shadow-inner">
              {roleIcons[user.role] || '🏥'}
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight">DocNest</h1>
              <p className="text-xs text-white/80 font-medium">{roleLabels[user.role] || 'Portal'}</p>
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
        <div className="px-4 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-black text-sm border border-slate-700 shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {user.village ? `${user.village}, ` : ''}
                {user.block ? `${user.block}, ` : ''}
                {user.district || user.specialty || user.email || user.phone}
              </p>
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
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <link.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-900/40">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <LanguageTogglePill />
            </div>
            <ThemeTogglePill />
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
