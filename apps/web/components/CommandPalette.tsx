'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Command,
  X,
  Stethoscope,
  User,
  Calendar,
  FileText,
  Clock,
  ShieldCheck,
  Building2,
  Tv,
  QrCode,
  Pill,
  CreditCard,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { DOCTORS_DIRECTORY } from '../lib/doctors-data';
import { logout, getSession, DocNestUser } from '../lib/auth';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Pages' | 'Doctors' | 'Actions';
  icon: any;
  href?: string;
  action?: () => void;
  shortcut?: string;
}

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [session, setSession] = useState<DocNestUser | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery('');
        setSelectedIndex(0);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (item: CommandItem) => {
    setIsOpen(false);
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const navItems: CommandItem[] = [
    {
      id: 'nav-home',
      title: 'DocNest Home',
      subtitle: 'Landing page & feature overview',
      category: 'Pages',
      icon: Building2,
      href: '/',
    },
    {
      id: 'nav-patient-home',
      title: 'Patient Portal',
      subtitle: 'Bookings, token status & medical timeline',
      category: 'Pages',
      icon: User,
      href: '/patient',
    },
    {
      id: 'nav-find-doctors',
      title: 'Find Doctors',
      subtitle: 'Directory of all district doctors & OPD slots',
      category: 'Pages',
      icon: Stethoscope,
      href: '/patient/doctors',
    },
    {
      id: 'nav-doctor-dashboard',
      title: 'Doctor OPD Queue',
      subtitle: 'Live token caller, walk-in slips & consultations',
      category: 'Pages',
      icon: Clock,
      href: '/doctor/dashboard',
    },
    {
      id: 'nav-prescription',
      title: 'Digital Prescription Pad (Rx)',
      subtitle: 'Create verified computer-generated Rx with WhatsApp',
      category: 'Pages',
      icon: FileText,
      href: '/doctor/prescription',
    },
    {
      id: 'nav-doctor-tv',
      title: 'Waiting Room TV Display',
      subtitle: 'Full-screen digital OPD token display board',
      category: 'Pages',
      icon: Tv,
      href: '/doctor/tv',
    },
    {
      id: 'nav-qr-flyer',
      title: 'Printable Clinic QR Poster',
      subtitle: 'Printable reception counter poster',
      category: 'Pages',
      icon: QrCode,
      href: '/doctor/qr-flyer',
    },
    {
      id: 'nav-compounder',
      title: 'Pharmacy Dispense Counter',
      subtitle: 'Fulfill digital prescriptions & dispense medicines',
      category: 'Pages',
      icon: Pill,
      href: '/compounder/dashboard',
    },
    {
      id: 'nav-admin',
      title: 'Admin Master Control',
      subtitle: 'District analytics, doctor verification & settlements',
      category: 'Pages',
      icon: ShieldCheck,
      href: '/admin/dashboard',
    },
  ];

  // Map Doctors from Directory
  const doctorItems: CommandItem[] = DOCTORS_DIRECTORY.map((doc) => ({
    id: `doc-${doc.id}`,
    title: doc.name,
    subtitle: `${doc.specialty} • ${doc.clinicName} (Fee: ₹${doc.consultationFee})`,
    category: 'Doctors',
    icon: Stethoscope,
    href: `/patient/book?doctor=${doc.id}`,
  }));

  // Actions
  const actionItems: CommandItem[] = [
    {
      id: 'action-logout',
      title: 'Logout of Portal',
      subtitle: 'End active session safely',
      category: 'Actions',
      icon: LogOut,
      action: async () => {
        await logout();
        router.push('/login');
      },
    },
  ];

  const allItems = [...navItems, ...doctorItems, ...actionItems];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Floating Global Quick-Trigger Pill */}
      <button
        onClick={() => {
          setIsOpen(true);
          setQuery('');
        }}
        className="fixed bottom-5 right-5 z-40 bg-[#0c1219]/90 hover:bg-[#141e28] text-[#c4e1e6] hover:text-white border border-[rgba(196,225,230,0.22)] shadow-2xl backdrop-blur-xl px-3.5 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold transition active:scale-95 group cursor-pointer"
        title="Quick Search & Navigation (Ctrl + K)"
      >
        <Command className="w-3.5 h-3.5 text-[#8dbcc7] group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="bg-[#141e28] text-[10px] text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
          Ctrl K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#0c1219] border border-[rgba(196,225,230,0.22)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-[rgba(196,225,230,0.14)] flex items-center space-x-3 bg-[#141e28]/60">
              <Search className="w-5 h-5 text-[#8dbcc7] flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search pages, doctors, clinics, drugs or actions..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none font-medium"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 divide-y divide-slate-800/40">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No matching destination or doctor found for &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition cursor-pointer ${
                        idx === selectedIndex
                          ? 'bg-[#141e28] text-white border border-[rgba(196,225,230,0.18)]'
                          : 'text-slate-300 hover:bg-[#141e28]/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#0c1219] border border-[rgba(196,225,230,0.14)] flex items-center justify-center text-[#8dbcc7] flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-white truncate flex items-center space-x-2">
                            <span>{item.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                        </div>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 ml-2" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Guidance */}
            <div className="p-3 bg-[#080d12] border-t border-[rgba(196,225,230,0.1)] flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="flex items-center space-x-3">
                <span>Navigate & Select</span>
                <span>•</span>
                <span>ESC to close</span>
              </div>
              <span className="text-[#8dbcc7]">DocNest Command Palette</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
