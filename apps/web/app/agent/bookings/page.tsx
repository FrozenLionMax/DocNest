'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Users
} from 'lucide-react';

export default function AgentBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'cash' | 'online'>('all');

  const allBookings = [
    { id: 'b-101', date: '01 Oct 2026', time: '10:45 AM', token: 15, patient: 'Ramadhar Yadav', phone: '9876123456', doctor: 'Dr. Amit Kumar (Ortho)', fee: 375, mode: 'Cash', status: 'confirmed' },
    { id: 'b-102', date: '01 Oct 2026', time: '11:15 AM', token: 16, patient: 'Kanti Devi', phone: '9812349876', doctor: 'Dr. Rajesh Pandey (Peds)', fee: 240, mode: 'Cash', status: 'confirmed' },
    { id: 'b-103', date: '01 Oct 2026', time: '11:30 AM', token: 17, patient: 'Shyam Sunder', phone: '9789012345', doctor: 'Dr. Priya Verma (Med)', fee: 312, mode: 'Online UPI', status: 'confirmed' },
    { id: 'b-104', date: '30 Sep 2026', time: '04:15 PM', token: 9, patient: 'Sunita Devi', phone: '9876543210', doctor: 'Dr. Amit Kumar (Ortho)', fee: 375, mode: 'Cash', status: 'completed' },
    { id: 'b-105', date: '30 Sep 2026', time: '05:30 PM', token: 12, patient: 'Babban Ali', phone: '9123456780', doctor: 'Dr. Mohammad Irfan (Cardio)', fee: 625, mode: 'Cash', status: 'completed' },
    { id: 'b-106', date: '29 Sep 2026', time: '10:00 AM', token: 4, patient: 'Geeta Kumari', phone: '9234567891', doctor: 'Dr. Sunita Mishra (Gynec)', fee: 437, mode: 'Cash', status: 'completed' },
  ];

  const filtered = allBookings.filter((b) => {
    const matchesSearch = b.patient.toLowerCase().includes(searchQuery.toLowerCase()) || b.phone.includes(searchQuery) || b.token.toString().includes(searchQuery);
    const matchesMode = filterMode === 'all' || (filterMode === 'cash' && b.mode === 'Cash') || (filterMode === 'online' && b.mode.includes('Online'));
    return matchesSearch && matchesMode;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <FileText className="w-7 h-7 text-amber-400" />
            <span>Agent Booking Log & Cash Register</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Historical ledger of all offline and village registrations</p>
        </div>

        <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 border border-slate-700 transition">
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger PDF</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, phone or token #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${filterMode === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}
          >
            All ({allBookings.length})
          </button>
          <button
            onClick={() => setFilterMode('cash')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${filterMode === 'cash' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}
          >
            Cash Only
          </button>
          <button
            onClick={() => setFilterMode('online')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${filterMode === 'online' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}
          >
            Online Link
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Token</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Doctor</th>
                <th className="py-3 px-3">Total Fee</th>
                <th className="py-3 px-3">Payment Channel</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-mono text-slate-400">{b.date} • {b.time}</td>
                  <td className="py-3.5 px-3 font-mono font-black text-amber-400 text-sm">#{b.token}</td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-white">{b.patient}</p>
                    <p className="font-mono text-[11px] text-slate-400">{b.phone}</p>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">{b.doctor}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-white">₹{b.fee}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${b.mode === 'Cash' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-blue-500/15 text-blue-300'}`}>
                      {b.mode}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Confirmed ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
