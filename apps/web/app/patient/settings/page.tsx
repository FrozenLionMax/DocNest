'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Settings,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Save,
  Bell,
  Activity,
  Stethoscope,
  Calendar,
  FileText
} from 'lucide-react';
import { LanguageTogglePill } from '../../../components/LanguageContext';
import { ThemeTogglePill } from '../../../components/ThemeContext';
import NavControls from '../../../components/NavControls';

export default function PatientSettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailAddress, setEmailAddress] = useState('rahul@gmail.com');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('docnest_patient_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.emailEnabled !== undefined) setEmailEnabled(parsed.emailEnabled);
        if (parsed.smsEnabled !== undefined) setSmsEnabled(parsed.smsEnabled);
        if (parsed.emailAddress) setEmailAddress(parsed.emailAddress);
      }
    } catch (e) {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = { emailEnabled, smsEnabled, emailAddress };
    localStorage.setItem('docnest_patient_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between shadow-xl gap-3">
        <div className="flex items-center space-x-3">
          <NavControls fallbackBackUrl="/patient" showHome={true} showLogout={false} />
          <div>
            <h1 className="text-base font-black text-white tracking-tight">Patient Preferences & Notifications</h1>
            <p className="text-[11px] text-slate-400">Configure email reassurance & SMS alerts</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <ThemeTogglePill />
          <LanguageTogglePill />
          <NavControls showHome={false} showLogout={true} />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl mx-auto w-full p-4 md:p-8 space-y-6">
        {savedSuccess && (
          <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preferences saved successfully! / प्राथमिकताएं सहेजी गईं</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Notification Channels Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <Bell className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-sm font-black text-white">Booking Reassurance Alerts</h2>
                <p className="text-xs text-slate-400">How would you like to receive appointment updates?</p>
              </div>
            </div>

            {/* SMS Toggle (Default ON) */}
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-black text-white flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SMS Booking Confirmation (एसएमएस अलर्ट)</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Receive immediate SMS with token number & clinic address after booking.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            {/* Email Toggle (Opt-in) */}
            <div className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-black text-white flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Email Reassurance Notification (ईमेल रसीद)</span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Receive full booking receipt & doctor advice via email (only when enabled).
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {emailEnabled && (
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">Recipient Email Address</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="yourname@gmail.com"
                    required={emailEnabled}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences (सेटिंग्स सुरक्षित करें)</span>
          </button>
        </form>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <Link href="/patient" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link href="/patient/doctors" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Doctors</span>
        </Link>
        <Link href="/patient/appointments" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Bookings</span>
        </Link>
        <Link href="/patient/history" className="flex flex-col items-center text-slate-400 hover:text-white py-1">
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </Link>
        <Link href="/patient/settings" className="flex flex-col items-center text-emerald-400 py-1">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
