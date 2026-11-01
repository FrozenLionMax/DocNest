import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPharmacies } from '../../lib/pharmacy-data';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Search,
  ExternalLink,
  Pill,
  Sparkles,
  ArrowRight,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verified Pharmacies & Retail Chemists Registry — Uttar Pradesh | DocNest',
  description:
    'Directory of UPPC registered, Form 20/21 licensed retail medical stores, chemists, and 24x7 pharmacies across Deoria, Kanpur, and Lucknow. View live medicine stock and drug licenses.',
  keywords: [
    'Deoria Drug House',
    'Akhil Medical Store',
    'UPPC Registered Pharmacist',
    'Chemist in Deoria',
    'Medical store near Subhash Chowk',
    '24x7 Pharmacy Deoria',
    'Form 20 21 Drug License UP',
  ],
  alternates: {
    canonical: 'https://www.drugs.systems/pharmacy',
  },
  openGraph: {
    title: 'Verified Pharmacies & Chemists Registry — Uttar Pradesh | DocNest',
    description:
      'Official statutory directory of licensed retail pharmacies and chemists across UP districts. Browse real-time inventory and UPPC registration details.',
    url: 'https://www.drugs.systems/pharmacy',
    type: 'website',
  },
};

export default function PharmacyDirectoryPage() {
  const pharmacies = getAllPharmacies();

  // JSON-LD structured data for the directory
  const directorySchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'Uttar Pradesh Verified Retail Pharmacies Directory',
    description: 'Registry of licensed retail medical stores and 24x7 pharmacies in Uttar Pradesh.',
    url: 'https://www.drugs.systems/pharmacy',
    about: {
      '@type': 'ItemList',
      itemListElement: pharmacies.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Pharmacy',
          name: p.name,
          url: `https://www.drugs.systems/pharmacy/${p.slug}`,
          telephone: p.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: p.address,
            addressLocality: p.city,
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />
      <div className="min-h-screen bg-[#080d14] text-slate-100 flex flex-col">
        {/* Navigation Bar */}
        <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-teal-500/20">
                DN
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">DocNest</span>
                <span className="hidden sm:inline-block ml-2 text-xs text-teal-400 font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                  Pharmacy Network
                </span>
              </div>
            </Link>

            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/80 hover:bg-slate-800 transition"
              >
                Sign In
              </Link>
              <Link
                href="/patient/book"
                className="text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 px-3.5 py-1.5 rounded-lg shadow-md hover:from-teal-400 hover:to-emerald-400 transition"
              >
                Book Doctor OPD
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full">
          <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
            <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>UPPC Registered & Form 20/21 Licensed Chemist Registry</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Licensed Retail Pharmacies & Chemists
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Real-time directory of verified chemists, 24x7 emergency medical counters, and
              registered pharmacists across Deoria, Kanpur, and Lucknow. View live batch inventory,
              official statutory drug licenses, and Google Maps locations.
            </p>
          </section>

          {/* District Highlights */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">6</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Verified Stores</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Form 20/21 Verified</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">24x7</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Emergency Counters</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">UPPC</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">R.Ph. Council Link</p>
            </div>
          </section>

          {/* Directory Store Cards */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                <span>All Licensed Retail Chemists & Stores</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Showing {pharmacies.length} verified pharmacies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pharmacies.map((store) => (
                <div
                  key={store.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/5 transition group flex flex-col justify-between"
                >
                  <div>
                    {/* Store Image */}
                    <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                      <img
                        src={store.photoUrl}
                        alt={`${store.name} storefront`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      {store.is24x7 && (
                        <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg">
                          ● 24x7 Emergency
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-teal-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-teal-500/30">
                        {store.district}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-lg font-black text-white group-hover:text-teal-300 transition">
                          {store.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-start space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{store.address}</span>
                        </p>
                      </div>

                      {/* Statutory Info */}
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Chief Pharmacist:</span>
                          <span className="font-bold text-slate-200">{store.ownerName}</span>
                        </div>
                        <div className="flex justify-between items-center font-mono">
                          <span className="text-slate-500">Form 20 License:</span>
                          <span className="font-bold text-teal-400">{store.license20}</span>
                        </div>
                        <div className="flex justify-between items-center font-mono">
                          <span className="text-slate-500">Operating Hours:</span>
                          <span className="text-slate-300">{store.operatingHours}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t border-slate-800/50 mt-4 flex items-center justify-between">
                    <a
                      href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-400" />
                      <span>{store.phone}</span>
                    </a>
                    <Link
                      href={`/pharmacy/${store.slug}`}
                      className="inline-flex items-center space-x-1 text-xs font-extrabold text-teal-400 hover:text-teal-300 group-hover:translate-x-0.5 transition"
                    >
                      <span>View Store & Stock</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Local Deoria SEO Keyword Section */}
          <section className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-slate-400 leading-relaxed">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              About Uttar Pradesh Retail Pharmacy Compliance & Verification
            </h3>
            <p>
              DocNest Pharmacy Network connects licensed medical shops and retail drug dispensaries
              operating under Form 20 and Form 21 licenses issued by the Food Safety and Drug
              Administration (FSDA), Government of Uttar Pradesh. In full compliance with Section 42 of
              the Pharmacy Act, 1948, every listed storefront operates under the physical supervision
              of a qualified pharmacist registered with the Uttar Pradesh Pharmacy Council (UPPC).
            </p>
            <p>
              Key locations served include Deoria Sadar (Subhash Chowk, Station Road, Malviya Road,
              Civil Lines, Raghav Nagar), Kanpur Nagar (Mall Road, Phool Bagh), and Lucknow
              (Hazratganj).
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500 text-center">
          <p>© 2026 DocNest Healthcare Platform. UPPC Statutory Compliance Syndicate.</p>
        </footer>
      </div>
    </>
  );
}
