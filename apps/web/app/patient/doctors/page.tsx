'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DOCTORS_DIRECTORY, DoctorProfile } from '../../../lib/doctors-data';
import {
  Search,
  X,
  Stethoscope,
  MapPin,
  Clock,
  Star,
  Users,
  ChevronLeft,
  ArrowRight,
  Filter,
  ShieldCheck,
  Calendar,
  FileText,
  Settings,
  Activity,
  Sparkles
} from 'lucide-react';
import { LanguageTogglePill } from '../../../components/LanguageContext';
import { ThemeTogglePill } from '../../../components/ThemeContext';

const SPECIALTY_CHIPS = [
  { id: 'all', label: 'All Specialties' },
  { id: 'orthopedic', label: 'Orthopedic 🦴' },
  { id: 'general', label: 'General Medicine 🌡️' },
  { id: 'pediatrics', label: 'Pediatrics 👶' },
  { id: 'gynecology', label: 'Gynecology 🤰' },
  { id: 'ent', label: 'ENT Care 👂' },
  { id: 'cardio', label: 'Cardiology ❤️' },
];

export default function FindDoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const filteredDoctors = DOCTORS_DIRECTORY.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinicAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'all' ||
      (selectedSpecialty === 'orthopedic' && doc.specialty.toLowerCase().includes('ortho')) ||
      (selectedSpecialty === 'general' && doc.specialty.toLowerCase().includes('medicine')) ||
      (selectedSpecialty === 'pediatrics' && doc.specialty.toLowerCase().includes('pediatric')) ||
      (selectedSpecialty === 'gynecology' && doc.specialty.toLowerCase().includes('gynec')) ||
      (selectedSpecialty === 'ent' && doc.specialty.toLowerCase().includes('ent')) ||
      (selectedSpecialty === 'cardio' && doc.specialty.toLowerCase().includes('cardio'));

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-mesh-dark text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0c1219]/85 backdrop-blur-2xl border-b border-[rgba(196,225,230,0.14)] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <Link
            href="/patient"
            className="p-2 text-slate-400 hover:text-white bg-[#141e28] hover:bg-[#1c2a38] rounded-xl transition border border-[rgba(196,225,230,0.12)] active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-black text-white tracking-tight flex items-center space-x-2">
              <span>Find Verified Doctors</span>
              <ShieldCheck className="w-4 h-4 text-[#8dbcc7]" />
            </h1>
            <p className="text-[11px] text-[#a4ccd9]/70">Deoria District Registered OPD Clinics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <ThemeTogglePill />
          <LanguageTogglePill />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Search & Filter Hero Glass Card */}
        <div className="glass-panel-elevated rounded-3xl p-5 md:p-7 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors by name, specialty (e.g. Ortho, Cardio) or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c1219]/80 border border-[rgba(196,225,230,0.18)] text-white rounded-2xl pl-12 pr-10 py-3.5 text-sm focus:outline-none focus:border-[#8dbcc7] transition shadow-inner placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Specialty Filter Chips Row */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {SPECIALTY_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedSpecialty(chip.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 flex items-center space-x-1.5 ${
                  selectedSpecialty === chip.id
                    ? 'btn-primary-tactile text-[#0c1219] font-black'
                    : 'glass-panel text-slate-300 hover:text-[#ebffd8] hover:border-[#8dbcc7]/40'
                }`}
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-slate-400 font-semibold">
            Showing <span className="text-[#8dbcc7] font-bold tabular-numbers">{filteredDoctors.length}</span> verified specialists in Deoria District
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="glass-panel rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-5 group relative overflow-hidden"
            >
              <div className="space-y-4 relative z-10">
                {/* Doctor Avatar + Details */}
                <div className="flex items-start space-x-3.5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doc.bgGradient} flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-black/40 border border-white/20 flex-shrink-0 group-hover:scale-105 transition`}>
                    {doc.photoInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-white group-hover:text-[#8dbcc7] transition truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-bold text-[#8dbcc7] truncate">{doc.specialty}</p>
                    <p className="text-[11px] text-[#a4ccd9]/70 font-medium truncate">{doc.qualifications}</p>

                    <div className="flex items-center space-x-2 mt-1.5 text-xs text-slate-400 font-medium">
                      <span className="flex items-center space-x-1 text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="tabular-numbers">{doc.rating}</span>
                      </span>
                      <span>•</span>
                      <span className="tabular-numbers">{doc.totalPatients.toLocaleString()} patients</span>
                    </div>
                  </div>
                </div>

                {/* Clinic Info Inset Box */}
                <div className="bg-[#0c1219]/70 border border-[rgba(196,225,230,0.12)] rounded-2xl p-3.5 space-y-2 text-xs shadow-inner">
                  <div className="flex items-start space-x-2 text-slate-300">
                    <Stethoscope className="w-4 h-4 text-[#8dbcc7] flex-shrink-0 mt-0.5" />
                    <span className="font-semibold line-clamp-1">{doc.clinicName}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-[#a4ccd9]/70 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{doc.clinicAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#a4ccd9]/70 text-[11px] pt-1 border-t border-[rgba(196,225,230,0.08)]">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{doc.morningSlot} | {doc.eveningSlot}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Consultation Fee + Book Button */}
              <div className="pt-2 flex items-center justify-between border-t border-[rgba(196,225,230,0.1)] gap-3 relative z-10">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">OPD Fee</span>
                  <div className="text-lg font-black text-white tabular-numbers flex items-baseline space-x-1">
                    <span>₹{doc.consultationFee}</span>
                    <span className="text-[10px] text-[#ebffd8] font-semibold">+₹{(doc.consultationFee * doc.platformCommission / 100).toFixed(0)} fee</span>
                  </div>
                </div>

                <Link
                  href={`/patient/book?doctor=${doc.id}`}
                  className="btn-primary-tactile text-[#0c1219] font-black px-5 py-3 rounded-2xl text-xs flex items-center space-x-1.5 transition"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating App-like Mobile Bottom Nav */}
      <nav className="fixed md:hidden bottom-3 left-3 right-3 z-50 bg-[#0c1219]/90 backdrop-blur-2xl border border-[rgba(196,225,230,0.14)] rounded-2xl px-3 py-2 flex items-center justify-around shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
        <Link href="/patient" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link href="/patient/doctors" className="flex flex-col items-center text-[#8dbcc7] py-1 transition active:scale-90">
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Doctors</span>
        </Link>
        <Link href="/patient/appointments" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Bookings</span>
        </Link>
        <Link href="/patient/history" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </Link>
        <Link href="/patient/settings" className="flex flex-col items-center text-slate-400 hover:text-white py-1 transition active:scale-90">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
