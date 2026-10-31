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
  Sparkles,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { LanguageTogglePill } from '../../../components/LanguageContext';
import { ThemeTogglePill } from '../../../components/ThemeContext';
import NavControls from '../../../components/NavControls';

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
  const [isListening, setIsListening] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  const startVoiceSearch = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceToast('Voice search not supported in this browser. Please type.');
      setTimeout(() => setVoiceToast(null), 3500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Highly tuned for Hindi, Hinglish and Indian English
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setVoiceToast('Listening... बोलिए (e.g. हड्डी के डॉक्टर या Dr. Amit)...');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setVoiceToast(`Recognized: "${transcript}"`);
        setIsListening(false);
        setTimeout(() => setVoiceToast(null), 2500);

        // Smart voice specialty mapper
        const lower = transcript.toLowerCase();
        if (lower.includes('हड्डी') || lower.includes('ortho') || lower.includes('joint')) {
          setSelectedSpecialty('orthopedic');
        } else if (lower.includes('बच्चा') || lower.includes('बाल') || lower.includes('child') || lower.includes('pediatric')) {
          setSelectedSpecialty('pediatrics');
        } else if (lower.includes('महिला') || lower.includes('स्त्री') || lower.includes('gynec')) {
          setSelectedSpecialty('gynecology');
        } else if (lower.includes('दिल') || lower.includes('हार्ट') || lower.includes('cardio')) {
          setSelectedSpecialty('cardio');
        } else if (lower.includes('कान') || lower.includes('नाक') || lower.includes('गला') || lower.includes('ent')) {
          setSelectedSpecialty('ent');
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceToast('Could not hear voice clearly. Please try again.');
        setTimeout(() => setVoiceToast(null), 2500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setVoiceToast('Microphone access denied or busy.');
      setTimeout(() => setVoiceToast(null), 2500);
    }
  };

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
      <header className="sticky top-0 z-40 bg-[#0c1219]/85 backdrop-blur-2xl border-b border-[rgba(196,225,230,0.14)] px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between shadow-xl gap-3">
        <div className="flex items-center space-x-3">
          <NavControls fallbackBackUrl="/patient" showHome={true} showLogout={false} />
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
          <NavControls showHome={false} showLogout={true} />
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
              className="w-full bg-white dark:bg-[#0c1219] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl pl-12 pr-28 py-3.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition shadow-sm placeholder:text-slate-400 font-medium"
            />
            <div className="absolute right-2.5 top-2.5 flex items-center space-x-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={startVoiceSearch}
                className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center space-x-1.5 text-xs font-bold ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-950'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 shadow-sm'
                }`}
                title="Bilingual Voice Search (हिंदी / English में बोलकर खोजें)"
              >
                <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-bounce' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span className="text-[11px] hidden sm:inline">
                  {isListening ? 'बोलिए...' : 'बोलकर खोजें'}
                </span>
              </button>
            </div>
          </div>

          {/* Voice Search Status Toast */}
          {voiceToast && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold">{voiceToast}</span>
            </div>
          )}

          {/* Specialty Filter Glass Morphic Capsules (Item #5) */}
          <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            {SPECIALTY_CHIPS.map((chip) => {
              const isSelected = selectedSpecialty === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedSpecialty(chip.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 active:scale-95 flex items-center space-x-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#8dbcc7] to-[#ebffd8] text-[#0c1219] shadow-lg shadow-[#8dbcc7]/20 border-white/30 ring-2 ring-[#8dbcc7]/40 font-black'
                      : 'bg-[#141e28]/80 hover:bg-[#1f2f3f] text-[#c4e1e6] hover:text-white border-[rgba(196,225,230,0.16)] hover:border-[#8dbcc7]/40'
                  }`}
                >
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Showing <span className="text-teal-700 dark:text-teal-400 font-black tabular-numbers">{filteredDoctors.length}</span> verified specialists in Deoria District
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-[#141e28] rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-5 group relative overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md"
            >
              <div className="space-y-4 relative z-10">
                {/* Doctor Avatar + Details */}
                <div className="flex items-start space-x-3.5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doc.bgGradient} flex items-center justify-center text-white text-2xl font-black shadow-md flex-shrink-0 group-hover:scale-105 transition`}>
                    {doc.photoInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-bold text-teal-700 dark:text-teal-400 truncate">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{doc.qualifications}</p>

                    <div className="flex items-center space-x-2 mt-1.5 text-xs text-slate-500 font-medium">
                      <span className="flex items-center space-x-1 text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="tabular-numbers">{doc.rating}</span>
                      </span>
                      <span>•</span>
                      <span className="tabular-numbers">{doc.totalPatients.toLocaleString()} patients</span>
                    </div>
                  </div>
                </div>

                {/* Clinic Info Inset Box */}
                <div className="bg-slate-50 dark:bg-[#0c1219] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-start space-x-2 text-slate-800 dark:text-slate-200">
                    <Stethoscope className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="font-bold line-clamp-1">{doc.clinicName}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-500 dark:text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{doc.clinicAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{doc.morningSlot} | {doc.eveningSlot}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Consultation Fee + Book Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 gap-3 relative z-10">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">OPD Fee</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white tabular-numbers flex items-baseline space-x-1">
                    <span>₹{doc.consultationFee}</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">+₹{(doc.consultationFee * doc.platformCommission / 100).toFixed(0)} fee</span>
                  </div>
                </div>

                <Link
                  href={`/patient/book?doctor=${doc.id}`}
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black px-5 py-3 rounded-2xl text-xs flex items-center space-x-1.5 transition shadow-sm hover:shadow-md"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
