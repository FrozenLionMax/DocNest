'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  ShieldCheck,
  Bell,
  MessageSquare,
  Clock,
  Radio,
  Lock,
  CheckCircle2,
  Database,
  Globe,
  Zap
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [morningStart, setMorningStart] = useState('10:00 AM');
  const [morningEnd, setMorningEnd] = useState('02:00 PM');
  const [eveningStart, setEveningStart] = useState('05:00 PM');
  const [eveningEnd, setEveningEnd] = useState('08:00 PM');
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [smsGatewayEnabled, setSmsGatewayEnabled] = useState(true);
  const [emergencyAlertThreshold, setEmergencyAlertThreshold] = useState('15');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {savedSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>Platform configurations saved & synchronized!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center space-x-2">
            <Settings className="w-7 h-7 text-blue-400" />
            <span>Platform Infrastructure Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Global clinic operating schedules, communication gateways, and security credentials
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Central Cloud Online</span>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* SECTION 1: OPD OPERATING TIMINGS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-base font-extrabold text-white">District Default OPD Shift Hours</h2>
              <p className="text-xs text-slate-400">Baseline working hours applied across outpatient department queues</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider block">🌅 Morning OPD Slot</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={morningStart}
                    onChange={(e) => setMorningStart(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    value={morningEnd}
                    onChange={(e) => setMorningEnd(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider block">🌆 Evening OPD Slot</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={eveningStart}
                    onChange={(e) => setEveningStart(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    value={eveningEnd}
                    onChange={(e) => setEveningEnd(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMMUNICATIONS & NOTIFICATIONS GATEWAY */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-extrabold text-white">Patient Notification & Broadcast Gateways</h2>
              <p className="text-xs text-slate-400">Configure automated digital prescription delivery and SMS tokens</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
              <div>
                <p className="text-sm font-extrabold text-white flex items-center space-x-2">
                  <span>1-Click WhatsApp Digital Prescriptions</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">Recommended</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Allows doctors and pharmacies to dispatch Rx slips directly to patient WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={() => setWhatsappEnabled(!whatsappEnabled)}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
              <div>
                <p className="text-sm font-extrabold text-white">SMS Gateway (Fast2SMS / DLT Approved)</p>
                <p className="text-xs text-slate-400 mt-0.5">Delivers offline SMS verification codes and clinic token slips to feature phones</p>
              </div>
              <input
                type="checkbox"
                checked={smsGatewayEnabled}
                onChange={() => setSmsGatewayEnabled(!smsGatewayEnabled)}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-white">Emergency Delay Broadcast Alert Threshold</p>
                <p className="text-xs text-slate-400 mt-0.5">Automatically prompts doctors to dispatch delay notices when surgeries exceed limit</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={emergencyAlertThreshold}
                  onChange={(e) => setEmergencyAlertThreshold(e.target.value)}
                  className="w-16 bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-mono text-center"
                />
                <span className="text-xs text-slate-400 font-semibold">minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CLOUD & ENCRYPTION READ-ONLY METRICS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Database className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base font-extrabold text-white">Active Cloud & Database Security</h2>
              <p className="text-xs text-slate-400">PostgreSQL instance parameters and data protection standards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Production URL</label>
              <input
                type="text"
                readOnly
                value="https://www.drugs.systems"
                className="w-full bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs rounded-xl px-3.5 py-2.5 shadow-inner"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Compliance Tier</label>
              <input
                type="text"
                readOnly
                value="ABHA & NDHM Compliant (256-Bit SSL)"
                className="w-full bg-slate-950 border border-slate-800 text-purple-300 font-mono text-xs rounded-xl px-3.5 py-2.5 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-8 py-3.5 rounded-2xl text-sm shadow-xl flex items-center justify-center space-x-2 transition active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
