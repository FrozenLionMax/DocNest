import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllPharmacies,
  getPharmacyBySlug,
  getAllPharmacySlugs,
  PharmacyStore,
} from '../../../lib/pharmacy-data';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Share2,
  Navigation,
  FileText,
  Pill,
  ExternalLink,
  ChevronLeft,
  Building,
  UserCheck,
  Check,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPharmacySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = getPharmacyBySlug(slug);

  if (!store) {
    return {
      title: 'Pharmacy Not Found | DocNest',
    };
  }

  const ownerLabel = store.ownerName ? ` (${store.ownerName})` : '';
  const title = `${store.name}${ownerLabel} - Licensed Retail Pharmacy | ${store.address.split(',')[0]}, ${store.district}, UP`;
  const description = `${store.name} located at ${store.address}. Licensed under Form 20/21 (${store.license20}). UPPC registered chief pharmacist ${store.ownerName} on duty. Phone ${store.phone}. Browse live stock, retail MRP & 24x7 emergency medical service.`;
  const canonicalUrl = `https://www.drugs.systems/pharmacy/${store.slug}`;

  const keywords = [
    store.name,
    `${store.name} deoria`,
    `${store.name} akhil`,
    store.ownerName,
    `${store.ownerName} chemist`,
    `chemist in ${store.district}`,
    `medical store ${store.city}`,
    'station road deoria chemist',
    'subhash chowk chemist',
    'UPPC registered pharmacist',
    `Form 20 ${store.license20}`,
    'medicine stock availability',
    '24 hour pharmacy deoria',
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'DocNest • UP Pharmacy & Clinical Network',
      images: [
        {
          url: store.photoUrl,
          width: 1200,
          height: 630,
          alt: `${store.name} storefront`,
        },
      ],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [store.photoUrl],
    },
  };
}

export default async function PharmacyStorePage({ params }: Props) {
  const { slug } = await params;
  const store = getPharmacyBySlug(slug);

  if (!store) {
    notFound();
  }

  const canonicalUrl = `https://www.drugs.systems/pharmacy/${store.slug}`;

  // Geo Coordinates for Deoria Sadar / Kanpur / Lucknow
  const geoCoords: Record<string, { lat: number; lng: number }> = {
    Deoria: { lat: 26.5028, lng: 83.7844 },
    'Kanpur Nagar': { lat: 26.4499, lng: 80.3319 },
    Lucknow: { lat: 26.8467, lng: 80.9462 },
  };
  const coords = geoCoords[store.district] || { lat: 26.5028, lng: 83.7844 };

  // Full Rich Schema.org JSON-LD for Google Local & Pharmacy Snippets
  const pharmacySchema = {
    '@context': 'https://schema.org',
    '@type': ['Pharmacy', 'MedicalBusiness', 'LocalBusiness'],
    '@id': canonicalUrl,
    name: store.name,
    alternateName: [
      `${store.name} Akhil`,
      `${store.name} ${store.district}`,
      `${store.ownerName} Medical Store`,
      ...store.slugAliases,
    ].filter(Boolean),
    image: [
      store.photoUrl,
      ...(store.galleryPhotos ? store.galleryPhotos.map((g) => g.url) : []),
    ],
    url: canonicalUrl,
    telephone: store.phone,
    priceRange: '₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, QR, Credit Card, Debit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address,
      addressLocality: store.city,
      addressRegion: 'Uttar Pradesh',
      postalCode: store.address.match(/\b\d{6}\b/)?.[0] || '274001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: coords.lat,
      longitude: coords.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    hasMap: store.mapsUrl,
    sameAs: [store.mapsUrl].filter(Boolean),
    employee: store.staff?.map((s) => ({
      '@type': 'Person',
      name: s.name,
      jobTitle: s.role,
      identifier: s.uppcRegNo || s.regNumber || 'UPPC-RPH',
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: s.qualification,
      },
    })),
  };

  const whatsappClean = store.whatsapp?.replace(/[^0-9]/g, '') || '919415283910';
  const phoneClean = store.phone?.replace(/[^0-9+]/g, '') || '+919415283910';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pharmacySchema) }}
      />

      <div className="min-h-screen bg-[#080d14] text-slate-100 flex flex-col">
        {/* Top Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/pharmacy"
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              <ChevronLeft className="w-4 h-4 text-teal-400" />
              <span>Back to Directory</span>
            </Link>

            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>UPPC Verified Chemist</span>
              </span>
              <a
                href={store.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-teal-300 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-400" />
                <span>Google Maps</span>
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
          {/* Store Hero Showcase */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="h-64 sm:h-80 w-full relative">
              <img
                src={store.photoUrl}
                alt={`${store.name} storefront`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  ● UPPC VERIFIED PHARMACY
                </span>
                {store.is24x7 && (
                  <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                    24x7 EMERGENCY COUNTER
                  </span>
                )}
              </div>
            </div>

            {/* Store Information */}
            <div className="p-6 sm:p-8 -mt-20 relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-2 text-xs text-teal-400 font-extrabold uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>Est. {store.establishedYear} • {store.district}, Uttar Pradesh</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    {store.name}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 font-medium">
                    Chief Pharmacist & Proprietor:{' '}
                    <span className="text-teal-300 font-bold">{store.ownerName}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 flex items-center space-x-1.5 pt-1">
                    <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{store.address}</span>
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/${whatsappClean}?text=Hello%20${encodeURIComponent(
                      store.name
                    )},%20I%20am%20looking%20for%20medicine%20availability%20via%20DocNest.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Order</span>
                  </a>

                  <a
                    href={`tel:${phoneClean}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg transition"
                  >
                    <Phone className="w-4 h-4 fill-slate-950" />
                    <span>Call Store</span>
                  </a>

                  <a
                    href={store.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-3 rounded-xl border border-slate-700 transition"
                  >
                    <Navigation className="w-4 h-4 text-teal-400" />
                    <span>Navigate</span>
                  </a>
                </div>
              </div>

              {/* Statutory Licenses Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Form 20 Drug License
                  </p>
                  <p className="text-xs sm:text-sm font-mono font-bold text-teal-400 mt-0.5">
                    {store.license20}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Form 21 Drug License
                  </p>
                  <p className="text-xs sm:text-sm font-mono font-bold text-teal-400 mt-0.5">
                    {store.license21}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Pharma GSTIN Number
                  </p>
                  <p className="text-xs sm:text-sm font-mono font-bold text-slate-200 mt-0.5">
                    {store.gstin}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Operating Timings
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">
                    {store.operatingHours}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pharmacist Staff on Duty */}
          {store.staff && store.staff.length > 0 && (
            <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-teal-400" />
                  <span>UPPC Registered Pharmacists on Duty</span>
                </h2>
                <span className="text-[11px] text-slate-400">
                  Section 42 Pharmacy Act, 1948 Compliant
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {store.staff.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3.5"
                  >
                    <img
                      src={s.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'}
                      alt={s.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700"
                    />
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{s.name}</p>
                      <p className="text-xs text-teal-400 font-semibold">{s.role}</p>
                      <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                        <p>UPPC Reg: <span className="text-slate-200 font-bold">{s.uppcRegNo || s.regNumber}</span></p>
                        <p>Qualification: {s.qualification}</p>
                        <p>Shift: {s.shift || s.timing}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Live Medicine Stock & Pricing Table */}
          {store.stocks && store.stocks.length > 0 && (
            <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center space-x-2">
                    <Pill className="w-5 h-5 text-teal-400" />
                    <span>Live Stock & Statutory Batch Register</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time available inventory with retail MRP & batch verification.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 w-fit">
                  {store.stocks.length} Verified Formulations
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">Brand & Generic Composition</th>
                      <th className="py-3 px-3">Schedule</th>
                      <th className="py-3 px-3">Batch & Expiry</th>
                      <th className="py-3 px-3">Manufacturer</th>
                      <th className="py-3 px-3 text-right">Retail MRP</th>
                      <th className="py-3 px-3 text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {store.stocks.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-white text-sm">{item.name}</p>
                          <p className="text-[11px] text-slate-400">{item.saltName}</p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                              item.schedule === 'Schedule H1'
                                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                : item.schedule === 'Schedule H'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {item.schedule}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[11px]">
                          <p className="text-slate-300">{item.batchNo}</p>
                          <p className="text-slate-500">Exp: {item.expiryDate}</p>
                        </td>
                        <td className="py-3.5 px-3 text-slate-300">{item.manufacturer}</td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-teal-400 text-sm">
                          ₹{item.mrp.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="inline-flex items-center space-x-1 font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                            <Check className="w-3 h-3" />
                            <span>In Stock ({item.quantity})</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Store Gallery */}
          {store.galleryPhotos && store.galleryPhotos.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-white">Storefront & Infrastructure Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {store.galleryPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group relative aspect-video"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90 p-2 flex flex-col justify-end">
                      <p className="text-[10px] font-bold text-white truncate">{photo.title}</p>
                      <p className="text-[9px] text-teal-400">{photo.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Google Maps Embed / Navigation Section */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  <span>Store Location & Directions</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">{store.address}</p>
              </div>
              <a
                href={store.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg hover:from-teal-400 hover:to-emerald-400 transition w-fit"
              >
                <Navigation className="w-4 h-4 fill-slate-950" />
                <span>Open in Google Maps App</span>
              </a>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500 text-center space-y-2">
          <p>© 2026 DocNest Healthcare Platform • UP Pharmacy Network</p>
          <p className="text-[11px] text-slate-600">
            Registered under Section 42 of the Pharmacy Act, 1948 and Drug Rules, 1945.
          </p>
        </footer>
      </div>
    </>
  );
}
