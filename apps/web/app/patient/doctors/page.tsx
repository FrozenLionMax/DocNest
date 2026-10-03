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
  Activity
} from 'lucide-react';
import { LanguageTogglePill } from '../../../components/LanguageContext';
import { ThemeTogglePill } from '../../../components/ThemeContext';

const SPECIALTY_CHIPS = [
  { id: 'all', label: 'All Specialties' },
  { id: 'orthopedic', label: 'Orthopedic 🦴' },
  { id: 'general', label: 'General Medicine 🌡️' },
  { id: 'pediatrics', label: 'Pediatrics 👶' },
  { id: 'gynecology', label: 'Gynecology 🤰' },
  { id: 'ent', label: 'ENT 👂' },
  { id: 'cardiology', label: 'Cardiology ❤️' },
];

export default function DoctorDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const filteredDoctors = DOCTORS_DIRECTORY.filter((doc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      doc.clinicName.toLowerCase().includes(query) ||
      doc.clinicAddress.toLowerCase().includes(query) ||
      doc.block.toLowerCase().includes(query);

    const matchesSpecialty =
      selectedSpecialty === 'all' ||
      (selectedSpecialty === 'orthopedic' && doc.specialty.toLowerCase().includes('ortho')) ||
      (selectedSpecialty === 'general' && doc.specialty.toLowerCase().includes('general')) ||
      (selectedSpecialty === 'pediatrics' && doc.specialty.toLowerCase().includes('pediatric')) ||
      (selectedSpecialty === 'gynecology' && doc.specialty.toLowerCase().includes('gynec')) ||
      (selectedSpecialty === 'ent' && doc.specialty.toLowerCase().includes('ent')) ||
      (selectedSpecialty === 'cardiology' && doc.specialty.toLowerCase().includes('cardio'));

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <Link
            href="/patient"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-black text-white tracking-tight flex items-center space-x-2">
              <span>Find Verified Doctors</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h1>
            <p className="text-[11px] text-slate-400">Deoria District Registered OPD Clinics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <ThemeTogglePill />
          <LanguageTogglePill />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Search Bar with Sticky Position */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors by name, specialty (e.g. Ortho, Cardio) or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 text-white rounded-2xl pl-12 pr-10 py-3 text-sm focus:outline-none focus:border-emerald-500 transition shadow-inner placeholder:text-slate-500"
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

          {/* Specialty Filter Chips Row (Horizontal Scroll) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {SPECIALTY_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedSpecialty(chip.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 flex items-center space-x-1.5 ${
                  selectedSpecialty === chip.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
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
            Showing <span className="text-emerald-400 font-bold">{filteredDoctors.length}</span> verified doctors in Deoria District
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-5 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Doctor Avatar + Details */}
                <div className="flex items-start space-x-3.5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doc.bgGradient} flex items-center justify-center text-white text-2xl font-black shadow-lg flex-shrink-0`}>
                    {doc.photoInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-400 truncate">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">{doc.qualifications}</p>

                    <div className="flex items-center space-x-2 mt-1.5 text-xs text-slate-400 font-medium">
                      <span className="flex items-center space-x-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating}</span>
                      </span>
                      <span>•</span>
                      <span>{doc.totalPatients.toLocaleString()} patients</span>
                    </div>
                  </div>
                </div>

                {/* Clinic Info */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-start space-x-2 text-slate-300">
                    <Stethoscope className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold line-clamp-1">{doc.clinicName}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{doc.clinicAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>{doc.morningSlot} | {doc.eveningSlot}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Consultation Fee + Book Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 gap-3 relative z-10">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Consultation</span>
                  <div className="text-lg font-black text-white font-mono flex items-baseline space-x-1">
                    <span>₹{doc.consultationFee}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">+₹{(doc.consultationFee * doc.platformCommission / 100).toFixed(0)} fee</span>
                  </div>
                </div>

                <Link
                  href={`/patient/book?doctor=${doc.id}`}
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black px-5 py-3 rounded-2xl text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-950 transition"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile Fixed Bottom Nav */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <Link href="/patient" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link href="/patient/doctors" className="flex flex-col items-center text-emerald-400 py-1">
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Doctors</span>
        </Link>
        <Link href="/patient/appointments" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Bookings</span>
        </Link>
        <Link href="/patient/history" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </Link>
        <Link href="/patient/settings" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
