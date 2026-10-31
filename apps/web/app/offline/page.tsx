'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Stethoscope, Home, Activity } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
          <WifiOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Offline Mode Active</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            You appear to be offline or experiencing connectivity issues. DocNest has preserved your local tokens and cached clinical records on your device.
          </p>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-left text-xs space-y-1.5 text-slate-300">
          <p className="font-bold text-white flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Local Clinical Resilience</span>
          </p>
          <p className="text-[11px] text-slate-400">
            • OPD queue state is stored locally on this machine.
          </p>
          <p className="text-[11px] text-slate-400">
            • Actions will automatically synchronize once your connection is restored.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleReload}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-950"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Connection & Reload</span>
          </button>

          <Link
            href="/patient"
            className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-xs transition border border-slate-700"
          >
            Go to Cached Patient Home
          </Link>
        </div>

        <p className="text-[10px] text-slate-600">
          DocNest Healthcare Platform • drugs.systems
        </p>
      </div>
    </div>
  );
}
