'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import { savePrescription, getQueueEntries, updateQueueEntryStatus, getPatientPastVisits, PastClinicalVisit } from '../../../lib/clinical-store';
import {
  Printer, Plus, Trash2, Save, Download, Stethoscope,
  User, Calendar, Pill, CheckCircle2, FileText, ArrowLeft, Search, Check, Sparkles, Zap, MessageSquare, Clock,
  AlertTriangle, ShieldAlert, ShieldCheck, Info, FlaskConical, History, PenTool, Stamp, X, RotateCcw, BadgeCheck, Copy, ChevronDown, ChevronUp, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import NavControls from '../../../components/NavControls';

interface RxMedicine {
  id: string;
  name: string;
  dosage: string; // e.g. 1-0-1
  duration: string; // e.g. 5 Days
  timing: string; // e.g. After Food (खाने के बाद)
}

interface SafetyAlert {
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  involvedMeds: string[];
}

function checkPrescriptionSafety(medicines: RxMedicine[]): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];
  if (medicines.length === 0) return alerts;

  // 1. Check for Duplicate Paracetamol / Acetaminophen
  const paracetamolMatches = medicines.filter(m => {
    const n = m.name.toLowerCase();
    return n.includes('paracetamol') ||
      n.includes('acetaminophen') ||
      n.includes('dolo') ||
      n.includes('calpol') ||
      n.includes('combiflam') ||
      n.includes('zerodol-sp') ||
      n.includes('zerodol-p') ||
      n.includes('ultracet') ||
      n.includes('crocin');
  });

  if (paracetamolMatches.length > 1) {
    alerts.push({
      type: 'danger',
      title: '🚨 Severe Safety Alert: Duplicate Paracetamol Salt Prescribed',
      message: `Multiple drugs contain Paracetamol (${paracetamolMatches.map(m => m.name.split(' (')[0]).join(' + ')}). Cumulative daily dose risks exceeding maximum safe limit (4000mg/day) which can cause severe drug-induced liver injury (hepatotoxicity).`,
      involvedMeds: paracetamolMatches.map(m => m.name)
    });
  }

  // 2. Check for Duplicate NSAIDs (Non-Steroidal Anti-Inflammatory Drugs)
  const nsaidMatches = medicines.filter(m => {
    const n = m.name.toLowerCase();
    return n.includes('aceclofenac') ||
      n.includes('diclofenac') ||
      n.includes('ibuprofen') ||
      n.includes('combiflam') ||
      n.includes('brufen') ||
      n.includes('naproxen') ||
      n.includes('naprosyn') ||
      n.includes('voveran') ||
      n.includes('zerodol') ||
      n.includes('mefenamic');
  });

  if (nsaidMatches.length > 1) {
    alerts.push({
      type: 'danger',
      title: '⚠️ Concurrent Multi-NSAID Toxicity Warning',
      message: `Prescription contains multiple NSAID painkillers (${nsaidMatches.map(m => m.name.split(' (')[0]).join(' + ')}). Combining systemic NSAIDs offers no additional pain relief but sharply increases gastrointestinal bleeding and Acute Kidney Injury (AKI).`,
      involvedMeds: nsaidMatches.map(m => m.name)
    });
  }

  // 3. Check for NSAID without Gastroprotection (PPI / H2 blocker)
  const hasNsaid = nsaidMatches.length > 0;
  const hasPpiOrAntacid = medicines.some(m => {
    const n = m.name.toLowerCase();
    return n.includes('pantoprazole') ||
      n.includes('pantocid') ||
      n.includes('pan-d') ||
      n.includes('omeprazole') ||
      n.includes('omez') ||
      n.includes('rabeprazole') ||
      n.includes('rabekind') ||
      n.includes('aciloc') ||
      n.includes('ranitidine') ||
      n.includes('gelusil');
  });

  if (hasNsaid && !hasPpiOrAntacid) {
    alerts.push({
      type: 'warning',
      title: '💡 Recommended Gastroprotection (Add PPI)',
      message: 'Systemic NSAID painkillers prescribed without gastric acid suppression. In elderly or acid-peptic patients, consider co-prescribing an empty-stomach PPI (e.g. Tab. Pan-D or Pantocid 40mg) to prevent gastric irritation.',
      involvedMeds: nsaidMatches.map(m => m.name)
    });
  }

  // 4. Check for Dual Antibiotics Overlap
  const antibioticMatches = medicines.filter(m => {
    const n = m.name.toLowerCase();
    return n.includes('augmentin') ||
      n.includes('clavam') ||
      n.includes('azithromycin') ||
      n.includes('azithral') ||
      n.includes('cefixime') ||
      n.includes('taxim') ||
      n.includes('ceftum') ||
      n.includes('ciprofloxacin') ||
      n.includes('ciplox') ||
      n.includes('zenflox') ||
      n.includes('doxycycline') ||
      n.includes('amoxil');
  });

  if (antibioticMatches.length > 1) {
    alerts.push({
      type: 'warning',
      title: '🔬 Dual Antibiotic Concurrency',
      message: `Multiple systemic antimicrobials prescribed (${antibioticMatches.map(m => m.name.split(' (')[0]).join(' + ')}). Ensure dual antimicrobial coverage is clinically intended to prevent antibiotic resistance and gut dysbiosis.`,
      involvedMeds: antibioticMatches.map(m => m.name)
    });
  }

  return alerts;
}

interface MedicineSuggestion {
  name: string;
  category: string;
  defaultDosage: string;
  defaultDuration: string;
  defaultTiming: string;
}

const MEDICINE_DATABASE: MedicineSuggestion[] = [
  // ANALGESIC & ANTI-INFLAMMATORY (Fever, Pain & Swelling)
  { name: 'Tab. Dolo 650mg (Paracetamol / Acetaminophen)', category: 'Analgesic / Fever', defaultDosage: '1-0-1', defaultDuration: '3 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Paracetamol 500mg (IP/BP/USP)', category: 'Fever & Mild Pain', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Calpol 500mg (Paracetamol)', category: 'Fever & Body Ache', defaultDosage: '1-0-1', defaultDuration: '3 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Combiflam (Ibuprofen 400mg + Paracetamol 325mg)', category: 'Pain & Swelling', defaultDosage: '1-0-1', defaultDuration: '3 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Zerodol-SP (Aceclofenac 100mg + Serratiopeptidase 15mg + Paracetamol)', category: 'Severe Pain & Swelling', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Zerodol-P (Aceclofenac 100mg + Paracetamol 325mg)', category: 'Joint & Muscle Pain', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Meftal-Spas (Dicyclomine 20mg + Mefenamic Acid 250mg)', category: 'Abdominal Spasm & Period Pain', defaultDosage: '1-0-1 (SOS)', defaultDuration: '3 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Voveran-SR 100mg (Diclofenac Sodium)', category: 'Ortho & Joint Pain', defaultDosage: '0-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Naprosyn 500mg (Naproxen)', category: 'Migraine & Joint Pain', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Brufen 400mg (Ibuprofen)', category: 'Pain & Inflammation', defaultDosage: '1-0-1', defaultDuration: '3 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Ultracet (Tramadol 37.5mg + Paracetamol 325mg)', category: 'Severe Post-Op / Trauma Pain', defaultDosage: '1-0-1', defaultDuration: '3 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Gel Volini / Voveran Ointment (Diclofenac Gel)', category: 'Topical Pain Relief Gel', defaultDosage: 'Apply 2-3 Times', defaultDuration: '7 Days', defaultTiming: 'External Use (बाहरी उपयोग)' },

  // ANTIBIOTICS & ANTIBACTERIALS (Global & Domestic)
  { name: 'Tab. Augmentin 625mg (Amoxicillin 500mg + Clavulanic Acid 125mg)', category: 'Broad Spectrum Antibiotic', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Clavam 625mg (Amoxicillin + Clavulanate)', category: 'Antibiotic', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Azithral 500mg (Azithromycin)', category: 'Chest Infection / URTI Antibiotic', defaultDosage: '1-0-0', defaultDuration: '3 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Azee 250mg / 500mg (Azithromycin)', category: 'Respiratory Antibiotic', defaultDosage: '1-0-0', defaultDuration: '3 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Taxim-O 200mg (Cefixime)', category: 'Urinary & ENT Antibiotic', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Ceftum 500mg (Cefuroxime Axetil)', category: 'Cephalosporin Antibiotic', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Ciplox 500mg (Ciprofloxacin)', category: 'Fluoroquinolone Antibiotic', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Zenflox-OZ (Ofloxacin 200mg + Ornidazole 500mg)', category: 'Diarrhea & Gastro Infection', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Norflox-TZ (Norfloxacin 400mg + Tinidazole 600mg)', category: 'Loose Motions & Stomach Infection', defaultDosage: '1-0-1', defaultDuration: '3 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Flagyl 400mg (Metronidazole)', category: 'Amoebic & Anaerobic Infection', defaultDosage: '1-1-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Cap. Doxy-1 LDR (Doxycycline 100mg + Lactic Acid Bacillus)', category: 'Tetracycline Antibiotic', defaultDosage: '1-0-1', defaultDuration: '7 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Bactrim DS (Sulfamethoxazole + Trimethoprim)', category: 'UTI & Skin Infection Antibiotic', defaultDosage: '1-0-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Cap. Amoxil 500mg (Amoxicillin Trihydrate)', category: 'Penicillin Antibiotic', defaultDosage: '1-1-1', defaultDuration: '5 Days', defaultTiming: 'After Food (खाने के बाद)' },

  // ANTACIDS, PPIs & GASTROINTESTINAL
  { name: 'Tab. Pantocid 40mg (Pantoprazole)', category: 'PPI / Hyperacidity', defaultDosage: '1-0-0', defaultDuration: '7 Days', defaultTiming: 'Empty Stomach (खाली पेट)' },
  { name: 'Tab. Pan-D (Pantoprazole 40mg + Domperidone 30mg SR)', category: 'Gastric & Nausea Relief', defaultDosage: '1-0-0', defaultDuration: '7 Days', defaultTiming: 'Empty Stomach (खाली पेट)' },
  { name: 'Cap. Omez 20mg (Omeprazole)', category: 'Antacid / Heartburn', defaultDosage: '1-0-0', defaultDuration: '7 Days', defaultTiming: 'Empty Stomach (खाली पेट)' },
  { name: 'Cap. Omez-D (Omeprazole + Domperidone)', category: 'Acidity & Reflux', defaultDosage: '1-0-0', defaultDuration: '7 Days', defaultTiming: 'Empty Stomach (खाली पेट)' },
  { name: 'Tab. Rabekind-DSR (Rabeprazole 20mg + Domperidone 30mg)', category: 'GERD & Acidity', defaultDosage: '1-0-0', defaultDuration: '7 Days', defaultTiming: 'Empty Stomach (खाली पेट)' },
  { name: 'Tab. Aciloc 150mg (Ranitidine HCL)', category: 'H2 Blocker / Acidity', defaultDosage: '1-0-1', defaultDuration: '7 Days', defaultTiming: 'Before Meals (खाने से पहले)' },
  { name: 'Syr. Gelusil MPS Antacid (Aluminium + Magnesium + Simethicone)', category: 'Antacid & Gas Relief Liquid', defaultDosage: '2 tsp (10ml)', defaultDuration: '7 Days', defaultTiming: 'After Meals (खाने के बाद)' },
  { name: 'Syr. Mucaine Gel (Oxetacaine + Aluminium Hydroxide)', category: 'Stomach Ulcer & Burning Relief', defaultDosage: '2 tsp (10ml)', defaultDuration: '5 Days', defaultTiming: 'Before Meals (खाने से पहले)' },
  { name: 'Syr. Cremaffin Plus (Liquid Paraffin + Milk of Magnesia)', category: 'Laxative / Constipation Relief', defaultDosage: '15ml Bedtime', defaultDuration: '5 Days', defaultTiming: 'At Bedtime (रात में खाते समय)' },
  { name: 'Tab. Emeset 4mg (Ondansetron HCL)', category: 'Anti-vomiting / Nausea', defaultDosage: '1-0-0 (SOS)', defaultDuration: '3 Days', defaultTiming: 'Before Food (खाने से पहले)' },
  { name: 'Tab. Perinorm 10mg (Metoclopramide)', category: 'Anti-nausea & Motility', defaultDosage: '1-0-0 (SOS)', defaultDuration: '3 Days', defaultTiming: 'Before Food (खाने से पहले)' },
  { name: 'Tab. Eldoper / Imodium (Loperamide 2mg)', category: 'Anti-diarrheal', defaultDosage: '1-0-1 (SOS)', defaultDuration: '2 Days', defaultTiming: 'After Food (खाने के बाद)' },

  // ANTIHYPERTENSIVE & CARDIAC (BP, Heart, Cholesterol)
  { name: 'Tab. Telmikind 40mg (Telmisartan)', category: 'Anti-hypertensive (BP)', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Morning (सुबह)' },
  { name: 'Tab. Telma 40mg / 80mg (Telmisartan)', category: 'BP Control', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Morning (सुबह)' },
  { name: 'Tab. Telma-H (Telmisartan 40mg + Hydrochlorothiazide 12.5mg)', category: 'BP & Diuretic', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Morning (सुबह)' },
  { name: 'Tab. Amlokind 5mg / Amlodipine 5mg', category: 'Calcium Channel Blocker (BP)', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Morning (सुबह)' },
  { name: 'Tab. Cilacar 10mg (Cilnidipine)', category: 'BP Control', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Morning (सुबह)' },
  { name: 'Tab. Concor 5mg (Bisoprolol Fumarate)', category: 'Beta Blocker / Pulse Control', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Morning (सुबह)' },
  { name: 'Tab. Atorva 10mg / 20mg (Atorvastatin)', category: 'Cholesterol / Statin', defaultDosage: '0-0-1', defaultDuration: '30 Days', defaultTiming: 'Night (रात में)' },
  { name: 'Tab. Rosuvas 10mg (Rosuvastatin)', category: 'Statin / Cholesterol', defaultDosage: '0-0-1', defaultDuration: '30 Days', defaultTiming: 'Night (रात में)' },
  { name: 'Tab. Ecosprin 75mg / 150mg (Aspirin)', category: 'Blood Thinner / Antiplatelet', defaultDosage: '0-1-0', defaultDuration: '30 Days', defaultTiming: 'After Lunch (दोपहर भोजन के बाद)' },
  { name: 'Tab. Clopitab 75mg (Clopidogrel)', category: 'Antiplatelet Blood Thinner', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'After Food (खाने के बाद)' },

  // ANTIDIABETIC (Blood Sugar Control)
  { name: 'Tab. Glycomet 500mg / 1000mg (Metformin SR)', category: 'Anti-diabetic (Sugar)', defaultDosage: '1-0-1', defaultDuration: '30 Days', defaultTiming: 'With Meals (खाने के साथ)' },
  { name: 'Tab. Janumet 50/500mg (Sitagliptin + Metformin)', category: 'DPP-4 Inhibitor + Metformin', defaultDosage: '1-0-1', defaultDuration: '30 Days', defaultTiming: 'With Meals (खाने के साथ)' },
  { name: 'Tab. Amaryl 1mg / 2mg (Glimepiride)', category: 'Sulfonylurea / Sugar', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Before Breakfast (नाश्ते से पहले)' },
  { name: 'Tab. Forxiga 10mg (Dapagliflozin)', category: 'SGLT2 Inhibitor / Sugar & Kidney', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Morning (सुबह)' },
  { name: 'Tab. Galvus Met 50/500mg (Vildagliptin + Metformin)', category: 'Diabetes Combination', defaultDosage: '1-0-1', defaultDuration: '30 Days', defaultTiming: 'With Meals (खाने के साथ)' },
  { name: 'Tab. Teneligliptin 20mg', category: 'Diabetes Control', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Before Food (खाने से पहले)' },

  // RESPIRATORY, ASTHMA & ALLERGY
  { name: 'Tab. Montair-LC (Montelukast 10mg + Levocetirizine 5mg)', category: 'Allergic Rhinitis & Asthma', defaultDosage: '0-0-1', defaultDuration: '10 Days', defaultTiming: 'At Bedtime (रात में सोते समय)' },
  { name: 'Tab. Allegra 120mg / 180mg (Fexofenadine HCL)', category: 'Non-drowsy Antihistamine', defaultDosage: '0-0-1', defaultDuration: '7 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Ceticip 10mg (Cetirizine HCL)', category: 'Anti-allergic / Cold', defaultDosage: '0-0-1', defaultDuration: '5 Days', defaultTiming: 'At Bedtime (रात में)' },
  { name: 'Inhaler Asthalin 100mcg (Salbutamol / Albuterol)', category: 'Bronchodilator SOS Inhaler', defaultDosage: '2 Puffs SOS', defaultDuration: '30 Days', defaultTiming: 'When Short of Breath' },
  { name: 'Inhaler Foracort 200 (Budesonide 200mcg + Formoterol 6mcg)', category: 'Asthma / COPD Maintenance Inhaler', defaultDosage: '2 Puffs 1-0-1', defaultDuration: '30 Days', defaultTiming: 'Rinse Mouth After Use' },
  { name: 'Syr. Ascoril-LS (Levosalbutamol + Ambroxol + Guaiphenesin)', category: 'Wet Cough Syrup', defaultDosage: '2 tsp (10ml)', defaultDuration: '5 Days', defaultTiming: 'Thrice Daily (दिन में 3 बार)' },
  { name: 'Syr. Grilinctus-BM / Grilinctus Non-drowsy', category: 'Dry Cough Syrup', defaultDosage: '2 tsp (10ml)', defaultDuration: '5 Days', defaultTiming: 'Thrice Daily (दिन में 3 बार)' },
  { name: 'Budecort 1mg Respules (Budesonide Nebuliser Suspension)', category: 'Nebulisation Steroid', defaultDosage: '1 Respule 1-0-1', defaultDuration: '3 Days', defaultTiming: 'Via Nebuliser' },

  // VITAMINS, MINERALS & NUTRITIONAL SUPPLEMENTS
  { name: 'Cap. Shelcal 500 (Calcium Carbonate 500mg + Vit D3 250 IU)', category: 'Bone & Calcium Supplement', defaultDosage: '0-0-1', defaultDuration: '30 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Cap. Becosules Z (Vitamin B-Complex + Vitamin C + Zinc)', category: 'Multivitamin & Mouth Ulcer', defaultDosage: '0-0-1', defaultDuration: '15 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Neurobion Forte (Vitamin B1, B2, B3, B5, B6, B12)', category: 'Nerve Health & Tingling', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Cap. Evion 400mg (Vitamin E / Tocopheryl Acetate)', category: 'Antioxidant & Skin Health', defaultDosage: '0-0-1', defaultDuration: '30 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Feronia-XT (Ferrous Ascorbate + Folic Acid + Zinc)', category: 'Iron & Anemia Supplement', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Sachet Tayo 60K / Calcirol 60,000 IU (Cholecalciferol / Vit D3)', category: 'High Dose Vitamin D3', defaultDosage: '1 Sachet / Week', defaultDuration: '8 Weeks', defaultTiming: 'With Warm Milk' },
  { name: 'Tab. Zincovit (Multivitamin + Multimineral + Grape Seed)', category: 'Immunity & Energy', defaultDosage: '0-0-1', defaultDuration: '30 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Tab. Limcee 500mg (Vitamin C / Ascorbic Acid)', category: 'Chewable Vitamin C', defaultDosage: '1-0-0', defaultDuration: '15 Days', defaultTiming: 'Chewable (चबाकर खाएं)' },

  // CNS, PSYCHIATRY & NEUROLOGY
  { name: 'Tab. Nexito 10mg (Escitalopram Oxalate)', category: 'Anti-anxiety / Antidepressant', defaultDosage: '0-0-1', defaultDuration: '30 Days', defaultTiming: 'Night (रात में)' },
  { name: 'Tab. Clonafit 0.5mg / Zapiz 0.5mg (Clonazepam)', category: 'Anxiolytic / Sleep Aid', defaultDosage: '0-0-1', defaultDuration: '10 Days', defaultTiming: 'At Bedtime (रात में सोते समय)' },
  { name: 'Tab. Gabapin-NT 100 (Gabapentin 100mg + Nortriptyline 10mg)', category: 'Neuropathic Nerve Pain Relief', defaultDosage: '0-0-1', defaultDuration: '15 Days', defaultTiming: 'At Bedtime (रात में सोते समय)' },
  { name: 'Tab. Pregabalin 75mg (Lyrica)', category: 'Nerve Pain & Fibromyalgia', defaultDosage: '0-0-1', defaultDuration: '15 Days', defaultTiming: 'At Bedtime (रात में सोते समय)' },

  // DERMATOLOGY & ANTIFUNGALS
  { name: 'Cap. Itrasys 100mg / 200mg (Itraconazole)', category: 'Systemic Antifungal', defaultDosage: '1-0-1', defaultDuration: '14 Days', defaultTiming: 'After Heavy Meals' },
  { name: 'Tab. Terbinaforce 250mg (Terbinafine HCL)', category: 'Ringworm & Nail Antifungal', defaultDosage: '1-0-0', defaultDuration: '14 Days', defaultTiming: 'After Food (खाने के बाद)' },
  { name: 'Cream Candid-B (Clotrimazole + Beclomethasone)', category: 'Topical Antifungal & Anti-itch', defaultDosage: 'Apply 1-0-1', defaultDuration: '7 Days', defaultTiming: 'External Use (बाहरी उपयोग)' },
  { name: 'Lotion Caladryl (Calamine + Diphenhydramine)', category: 'Soothing Anti-itch Lotion', defaultDosage: 'Apply Twice Daily', defaultDuration: '7 Days', defaultTiming: 'External Use (बाहरी उपयोग)' },

  // OPHTHALMIC, ENT & THYROID
  { name: 'Eye Drops Ciplox (Ciprofloxacin 0.3%)', category: 'Antibacterial Eye/Ear Drops', defaultDosage: '2 Drops 1-1-1', defaultDuration: '5 Days', defaultTiming: 'In Affected Eye/Ear' },
  { name: 'Eye Drops Refresh Tears (Carboxymethylcellulose 0.5%)', category: 'Lubricating Eye Drops for Dry Eyes', defaultDosage: '2 Drops 1-1-1', defaultDuration: '30 Days', defaultTiming: 'Both Eyes' },
  { name: 'Nasal Spray Otrivin (Xylometazoline HCL 0.1%)', category: 'Nasal Decongestant Spray', defaultDosage: '2 Sprays 1-0-1', defaultDuration: '3 Days', defaultTiming: 'In Each Nostril' },
  { name: 'Tab. Thyronorm 25mcg / 50mcg / 100mcg (Levothyroxine Sodium)', category: 'Thyroid Hormone Replacement', defaultDosage: '1-0-0', defaultDuration: '30 Days', defaultTiming: 'Early Morning Empty Stomach' }
];

const COMMON_ILLNESS_TEMPLATES = [
  {
    id: 'fever',
    label: '🌡️ Fever / Viral Cold',
    diagnosis: 'Viral Fever & Body Ache (बुखार व शरीर दर्द)',
    advice: '1. 3 दिनों तक पर्याप्त पानी पिएं व आराम करें।\n2. ताजा व सुपाच्य भोजन लें।\n3. 3 दिन बाद पुनः दिखाएं।',
    medicines: [
      { id: 't-1', name: 'Tab. Dolo 650mg (Paracetamol)', dosage: '1-0-1', duration: '3 Days', timing: 'After Food (खाने के बाद)' },
      { id: 't-2', name: 'Tab. Pantocid 40mg (Pantoprazole)', dosage: '1-0-0', duration: '5 Days', timing: 'Empty Stomach (खाली पेट)' },
      { id: 't-3', name: 'Tab. Allegra 120mg (Fexofenadine)', dosage: '0-0-1', duration: '5 Days', timing: 'After Food (खाने के बाद)' },
    ]
  },
  {
    id: 'ortho',
    label: '🦴 Joint / Back Pain',
    diagnosis: 'Acute Lumbar Strain & Joint Stiffness (कमर व जोड़ों में दर्द)',
    advice: '1. 5 दिनों तक वजन न उठाएं व गर्म पानी की सिकाई करें।\n2. नरम गद्दे पर सोएं।\n3. 5 दिन बाद परामर्श लें।',
    medicines: [
      { id: 't-4', name: 'Tab. Zerodol-SP (Aceclofenac + Serratiopeptidase)', dosage: '1-0-1', duration: '5 Days', timing: 'After Food (खाने के बाद)' },
      { id: 't-5', name: 'Tab. Pan-D (Pantoprazole + Domperidone)', dosage: '1-0-0', duration: '7 Days', timing: 'Empty Stomach (खाली पेट)' },
      { id: 't-6', name: 'Cap. Shelcal 500 (Calcium + Vit D3)', dosage: '0-0-1', duration: '30 Days', timing: 'After Food (खाने के बाद)' },
    ]
  },
  {
    id: 'acidity',
    label: '🧪 Acidity & Gastritis',
    diagnosis: 'GERD & Hyperacidity (पेट में जलन व गैस)',
    advice: '1. मिर्च-मसाले व तले भोजन से परहेज करें।\n2. सुबह खाली पेट गुनगुना पानी पिएं।',
    medicines: [
      { id: 't-7', name: 'Tab. Pan-D (Pantoprazole + Domperidone)', dosage: '1-0-0', duration: '7 Days', timing: 'Empty Stomach (खाली पेट)' },
      { id: 't-8', name: 'Syr. Gelusil MPS Antacid', dosage: '2 tsp (10ml)', duration: '7 Days', timing: 'After Meals (खाने के बाद)' },
    ]
  },
  {
    id: 'cough',
    label: '🫁 Cough & Allergy',
    diagnosis: 'Upper Respiratory Tract Infection / URTI (खांसी व जुकाम)',
    advice: '1. ठंडे पानी व आइसक्रीम से परहेज करें।\n2. दिन में 2 बार नमक के पानी से गरारे करें।',
    medicines: [
      { id: 't-9', name: 'Tab. Azithral 500mg (Azithromycin)', dosage: '1-0-0', duration: '3 Days', timing: 'After Food (खाने के बाद)' },
      { id: 't-10', name: 'Tab. Montair-LC (Montelukast + Levocetirizine)', dosage: '0-0-1', duration: '7 Days', timing: 'At Bedtime (रात में सोते समय)' },
      { id: 't-11', name: 'Syr. Grilinctus-BM Syrup', dosage: '2 tsp (10ml)', duration: '5 Days', timing: 'Thrice Daily (दिन में 3 बार)' },
    ]
  },
];

const POPULAR_INVESTIGATIONS = [
  {
    category: 'Blood & Biochemistry (रक्त जाँच)',
    tests: [
      'Complete Blood Count (CBC)',
      'Fasting Blood Sugar (FBS / PPBS)',
      'HbA1c (Glycated Hemoglobin)',
      'Liver Function Test (LFT)',
      'Kidney Function Test (KFT / RFT)',
      'Lipid Profile (Cholesterol / Triglycerides)',
      'Serum Uric Acid',
      'Thyroid Profile (T3, T4, TSH)',
      'Serum Calcium & Vitamin D3',
      'ESR & CRP (Inflammatory Markers)',
      'Serum Electrolytes (Na+, K+, Cl-)',
    ]
  },
  {
    category: 'Radiology & Imaging (एक्स-रे व स्कैन)',
    tests: [
      'X-Ray Lumbar Spine AP/Lat',
      'X-Ray Cervical Spine AP/Lat',
      'X-Ray Both Knees AP/Lat Standing',
      'X-Ray Chest PA View',
      'X-Ray Pelvis with Both Hips AP',
      'USG Whole Abdomen & Pelvis',
      'MRI Lumbosacral Spine',
      '12-Lead Electrocardiogram (ECG)',
    ]
  },
  {
    category: 'Urine & Infection Markers (अन्य जाँच)',
    tests: [
      'Urine Routine & Microscopic',
      'Urine Culture & Sensitivity',
      'Dengue NS1 Antigen & Platelet Count',
      'Widal Test (Typhoid)',
      'Rheumatoid Factor (RA Factor / Anti-CCP)',
    ]
  }
];

function PrescriptionContent() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const [patientName, setPatientName] = useState(searchParams.get('patient') || 'Rahul Sharma');
  const [patientAgeGender, setPatientAgeGender] = useState('32 / Male');
  const [patientPhone, setPatientPhone] = useState('9876543210');
  const [tokenNumber] = useState(searchParams.get('token') || '1');
  const [vitals, setVitals] = useState({ bp: '120/80 mmHg', pulse: '72 bpm', weight: '68 kg', temp: '98.6 °F' });
  const [diagnosis, setDiagnosis] = useState('Acute Lumbar Strain / LBA (कमर दर्द व जकड़न)');
  const [advice, setAdvice] = useState('1. 5 दिनों तक भारी वजन न उठाएं।\n2. गर्म पानी से सुबह-शाम सिकाई करें।\n3. दर्द होने पर बेड रेस्ट लें।');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Item 1: Interactive Follow-up Date Scheduler
  const [followUpDays, setFollowUpDays] = useState<number>(5);
  const [followUpDateStr, setFollowUpDateStr] = useState<string>('');

  // Feature 2: Diagnostic Lab & Radiology Requisitions
  const [orderedTests, setOrderedTests] = useState<string[]>([
    'Complete Blood Count (CBC)',
    'X-Ray Lumbar Spine AP/Lat',
  ]);
  const [customTestInput, setCustomTestInput] = useState<string>('');
  const [showTestPicker, setShowTestPicker] = useState<boolean>(false);

  // Feature 3: Patient Past Medical History & Revisit Timeline Drawer
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [pastVisits, setPastVisits] = useState<PastClinicalVisit[]>([]);
  const [copyHistorySuccess, setCopyHistorySuccess] = useState<string | null>(null);

  // Feature 4: Digital Signature Pad & Clinic Seal Stamp
  const [signatureMode, setSignatureMode] = useState<'seal' | 'draw'>('seal');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [medicines, setMedicines] = useState<RxMedicine[]>([
    { id: 'm-1', name: 'Tab. Dolo 650mg (Paracetamol)', dosage: '1-0-1', duration: '5 Days', timing: 'After Food (खाने के बाद)' },
    { id: 'm-2', name: 'Tab. Pantocid 40mg (Pantoprazole)', dosage: '1-0-0', duration: '7 Days', timing: 'Empty Stomach (खाली पेट)' },
    { id: 'm-3', name: 'Tab. Zerodol-SP (Aceclofenac + Serratiopeptidase)', dosage: '1-0-1', duration: '5 Days', timing: 'After Food (खाने के बाद)' },
  ]);

  const [newMed, setNewMed] = useState({ name: '', dosage: '1-0-1', duration: '5 Days', timing: 'After Food (खाने के बाद)' });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<MedicineSuggestion[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load past visits for current patient
  useEffect(() => {
    setPastVisits(getPatientPastVisits(patientName));
  }, [patientName]);

  // AI Clinical Drug Interaction & Duplicate Salt Safety Warning Checker
  const safetyAlerts = checkPrescriptionSafety(medicines);

  // Calculate follow-up return date
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + followUpDays);
    const formatted = targetDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    setFollowUpDateStr(formatted);
  }, [followUpDays]);

  // Close suggestion dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // AI Shorthand Keystroke Expander Parser
  const checkShorthandRx = (query: string) => {
    const q = query.toLowerCase().trim();
    const map: Record<string, { name: string; dosage: string; duration: string; timing: string }> = {
      'd 650': { name: 'Tab. Dolo 650mg (Paracetamol / Acetaminophen)', dosage: '1-0-1', duration: '3 Days', timing: 'After Food (खाने के बाद)' },
      'd650': { name: 'Tab. Dolo 650mg (Paracetamol / Acetaminophen)', dosage: '1-0-1', duration: '3 Days', timing: 'After Food (खाने के बाद)' },
      'p 40': { name: 'Tab. Pantocid 40mg (Pantoprazole)', dosage: '1-0-0', duration: '7 Days', timing: 'Empty Stomach (खाली पेट)' },
      'p40': { name: 'Tab. Pantocid 40mg (Pantoprazole)', dosage: '1-0-0', duration: '7 Days', timing: 'Empty Stomach (खाली पेट)' },
      'pan d': { name: 'Tab. Pan-D (Pantoprazole 40mg + Domperidone 30mg)', dosage: '1-0-0', duration: '7 Days', timing: 'Empty Stomach (खाली पेट)' },
      'aug 625': { name: 'Tab. Augmentin 625mg (Amoxicillin 500mg + Clavulanic Acid 125mg)', dosage: '1-0-1', duration: '5 Days', timing: 'After Food (खाने के बाद)' },
      'azi 500': { name: 'Tab. Azithral 500mg (Azithromycin)', dosage: '1-0-0', duration: '3 Days', timing: 'After Food (खाने के बाद)' },
      'comb': { name: 'Tab. Combiflam (Ibuprofen 400mg + Paracetamol 325mg)', dosage: '1-0-1', duration: '3 Days', timing: 'After Food (खाने के बाद)' },
      'zero sp': { name: 'Tab. Zerodol-SP (Aceclofenac + Serratiopeptidase)', dosage: '1-0-1', duration: '5 Days', timing: 'After Food (खाने के बाद)' },
      'mont': { name: 'Tab. Montair-LC (Montelukast 10mg + Levocetirizine 5mg)', dosage: '0-0-1', duration: '10 Days', timing: 'At Bedtime (रात में सोते समय)' },
      'tel 40': { name: 'Tab. Telmikind 40mg (Telmisartan)', dosage: '1-0-0', duration: '30 Days', timing: 'Morning (सुबह)' },
      'gly 500': { name: 'Tab. Glycomet 500mg (Metformin SR)', dosage: '1-0-1', duration: '30 Days', timing: 'With Meals (खाने के साथ)' },
      'shel 500': { name: 'Cap. Shelcal 500 (Calcium + Vit D3)', dosage: '0-0-1', duration: '30 Days', timing: 'After Food (खाने के बाद)' },
      'bec': { name: 'Cap. Becosules Z (B-Complex + Vit C + Zinc)', dosage: '0-0-1', duration: '15 Days', timing: 'After Food (खाने के बाद)' },
    };
    return map[q] || null;
  };

  const applyTemplate = (tpl: typeof COMMON_ILLNESS_TEMPLATES[0]) => {
    setDiagnosis(tpl.diagnosis);
    setAdvice(tpl.advice);
    setMedicines(tpl.medicines);
  };

  const handleMedNameChange = (val: string) => {
    setNewMed((prev) => ({ ...prev, name: val }));
    
    // Check if shorthand matched
    const shorthandMatch = checkShorthandRx(val);
    if (shorthandMatch) {
      setNewMed({
        name: shorthandMatch.name,
        dosage: shorthandMatch.dosage,
        duration: shorthandMatch.duration,
        timing: shorthandMatch.timing,
      });
      setShowSuggestions(false);
      return;
    }

    if (val.trim().length > 0) {
      const matches = MEDICINE_DATABASE.filter((m) =>
        m.name.toLowerCase().includes(val.toLowerCase()) ||
        m.category.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(MEDICINE_DATABASE);
      setShowSuggestions(true);
    }
  };

  const selectSuggestion = (s: MedicineSuggestion) => {
    setNewMed({
      name: s.name,
      dosage: s.defaultDosage,
      duration: s.defaultDuration,
      timing: s.defaultTiming,
    });
    setShowSuggestions(false);
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;
    setMedicines((prev) => [
      ...prev,
      { id: `med-${Date.now()}`, ...newMed }
    ]);
    setNewMed({ name: '', dosage: '1-0-1', duration: '5 Days', timing: 'After Food (खाने के बाद)' });
    setShowSuggestions(false);
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // Feature 2: Diagnostic Investigations & Lab Tests Handlers
  const toggleTest = (testName: string) => {
    setOrderedTests((prev) =>
      prev.includes(testName) ? prev.filter((t) => t !== testName) : [...prev, testName]
    );
  };

  const addCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customTestInput.trim();
    if (clean && !orderedTests.includes(clean)) {
      setOrderedTests((prev) => [...prev, clean]);
      setCustomTestInput('');
    }
  };

  const removeTest = (testName: string) => {
    setOrderedTests((prev) => prev.filter((t) => t !== testName));
  };

  // Feature 3: Patient Past Medical History Refill Handler
  const refillFromVisit = (visit: PastClinicalVisit) => {
    setDiagnosis(visit.diagnosis);
    setAdvice(visit.advice);
    setMedicines(
      visit.medicines.map((m, idx) => ({
        id: `med-${Date.now()}-${idx}`,
        name: m.name,
        dosage: m.dosage,
        duration: m.duration,
        timing: m.timing,
      }))
    );
    if (visit.orderedTests && visit.orderedTests.length > 0) {
      setOrderedTests(visit.orderedTests);
    }
    setCopyHistorySuccess(`Previous prescription from ${visit.date} copied successfully!`);
    setTimeout(() => {
      setCopyHistorySuccess(null);
      setShowHistoryDrawer(false);
    }, 1200);
  };

  // Feature 4: Digital Signature Pad Canvas Drawing Handlers
  const getCanvasPos = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#064e3b'; // deep medical emerald ink

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const pos = getCanvasPos(canvas, clientX, clientY);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const pos = getCanvasPos(canvas, clientX, clientY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureDataUrl(null);
  };

  // Item 4: One-Click Direct PDF / Print File Download
  const handlePrintOrPDF = () => {
    if (typeof window !== 'undefined') {
      const originalTitle = document.title;
      document.title = `DocNest-Rx-Token${tokenNumber}-${patientName.replace(/\s+/g, '_')}`;
      window.print();
      setTimeout(() => { document.title = originalTitle; }, 1000);
    }
  };

  // Item 2: 1-Click WhatsApp Rx Share Button
  const handleShareWhatsApp = () => {
    const docName = session?.name || 'Dr. Amit Kumar';
    const clinic = session?.clinic || 'Gupta Clinic & Joint Care Center';
    const testsMsg = orderedTests.length > 0
      ? `\n\n🔬 *जाँच सलाह (Lab / Radiology Orders):*\n${orderedTests.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
      : '';
    const message = `🏥 *${clinic}*\n👨‍⚕️ *${docName}*\n\nनमस्ते *${patientName}*,\nआपका डिजिटल पर्चा (Token #${tokenNumber}) तैयार है।\n\n📋 *निदान (Diagnosis):* ${diagnosis}\n💊 *दवाएं (${medicines.length}):*\n${medicines.map((m, i) => `${i + 1}. ${m.name} (${m.dosage}) - ${m.duration}`).join('\n')}${testsMsg}\n\n📅 *पुनः परामर्श तिथि (Follow-up):* ${followUpDateStr}\n\nपर्चा ऑनलाइन देखें: https://www.drugs.systems/patient`;

    const cleanPhone = patientPhone.replace(/\D/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSaveRx = async () => {
    try {
      const cleanPhone = patientPhone.replace(/\D/g, '') || '9999888877';
      const docId = session?.id || 'doc-001';
      const docName = session?.name || 'Dr. Amit Kumar';
      const clinicTitle = session?.clinic || 'Gupta Clinic & Joint Care Center';

      // 1. Central Clinical Store Persistence (Broadcasts to Pharmacy & Updates Patient History)
      savePrescription({
        doctorId: docId,
        doctorName: docName,
        clinicName: clinicTitle,
        patientName: patientName,
        patientPhone: cleanPhone,
        tokenNumber: Number(tokenNumber) || 1,
        diagnosis: diagnosis || 'General Clinical Consultation',
        advice: advice || 'Take medicines on time as prescribed.',
        followUpDate: followUpDateStr,
        orderedTests: orderedTests,
        signatureDataUrl: signatureDataUrl || undefined,
        medicines: medicines.map(m => ({
          name: m.name,
          dosage: m.dosage,
          duration: m.duration,
          timing: m.timing,
          price: 110,
        })),
      });

      // 2. Mark this token in the live OPD queue as completed
      try {
        const queueEntries = getQueueEntries(docId);
        const target = queueEntries.find(e => e.tokenNumber === Number(tokenNumber) || e.patientName === patientName);
        if (target) {
          updateQueueEntryStatus(target.id, 'completed');
        }
      } catch (err) {}

      // 3. Fallback direct storage for patient lookup
      if (typeof window !== 'undefined') {
        const key = `docnest_rx_${cleanPhone}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const newRxEntry = {
          id: `rx-${Date.now()}`,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          doctor: `${docName} (${session?.specialty || 'Orthopedic Surgeon'})`,
          clinic: clinicTitle,
          diagnosis: diagnosis || 'General Clinical Consultation',
          vitals: 'BP: 120/80 mmHg • Pulse: 74 bpm • Weight: 65 kg',
          advice: advice || 'Take medicines on time as prescribed.',
          followUp: followUpDateStr,
          medicines: medicines.map(m => ({
            name: m.name,
            dosage: m.dosage,
            duration: m.duration,
            timing: m.timing
          }))
        };
        localStorage.setItem(key, JSON.stringify([newRxEntry, ...existing]));
      }

      // 4. Sync to Supabase prescriptions table if available
      try {
        await supabase.from('prescriptions').insert([{
          patient_name: patientName,
          patient_phone: cleanPhone,
          doctor_name: docName,
          clinic_name: clinicTitle,
          diagnosis: diagnosis,
          advice: advice,
          follow_up_date: followUpDateStr,
          medicines_json: medicines
        }]);
      } catch (err) {}

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (e) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 pb-28 flex flex-col items-center">
      {/* Dynamic CSS Print Styles for Genuine A4 Printable Output */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          .print-a4-container {
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Top Action Bar (Hidden on Print) */}
      <div className="print:hidden w-full max-w-4xl bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl mb-4 flex flex-wrap items-center justify-between shadow-xl gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/doctor/dashboard"
            className="p-2 bg-[#141e28] text-slate-300 hover:text-white rounded-xl border border-[rgba(196,225,230,0.18)] flex items-center justify-center sm:hidden"
            title="Back to OPD Queue"
            aria-label="Back to OPD Queue"
          >
            <ChevronLeft className="w-5 h-5 text-emerald-400" />
          </Link>
          <NavControls fallbackBackUrl="/doctor/dashboard" showHome={true} showLogout={false} className="hidden sm:flex" />
          <div>
            <h1 className="text-lg font-bold flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Digital Prescription Creator (डिजिटल पर्चा)</span>
            </h1>
            <p className="text-xs text-slate-400">Token #{tokenNumber} • Patient: {patientName}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Feature 3: Patient Past Medical History & Revisit Timeline Button */}
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(true)}
            className="bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition shadow"
            title="View previous clinical visits and 1-click refill past medicines"
          >
            <History className="w-4 h-4 text-teal-400" />
            <span>Past History ({pastVisits.length})</span>
          </button>

          {/* Item 2: WhatsApp Share Button */}
          <button
            onClick={handleShareWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow flex items-center space-x-1.5 transition"
            title="Share Prescription summary to patient via WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
            <span>Send WhatsApp</span>
          </button>

          <button
            onClick={handleSaveRx}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Saved ✓' : 'Save Record'}</span>
          </button>

          {/* Item 4: Direct PDF File Download & Print Button */}
          <button
            onClick={handlePrintOrPDF}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-lg flex items-center space-x-2 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF / Print</span>
          </button>
        </div>
      </div>

      {/* 1-CLICK COMMON ILLNESS TEMPLATES BAR */}
      <div className="print:hidden w-full max-w-4xl bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
            <Zap className="w-4 h-4" />
            <span>1-Click Prescriptions for Common Illnesses</span>
          </span>
          <span className="text-[10px] text-slate-400">Auto-populates diagnosis, advice & Rx medicines</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {COMMON_ILLNESS_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl)}
              className="bg-slate-800 hover:bg-emerald-500/15 hover:border-emerald-500/40 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <span>{tpl.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ITEM 1: INTERACTIVE FOLLOW-UP DATE SCHEDULER BAR */}
      <div className="print:hidden w-full max-w-4xl bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">Follow-Up Return Date (पुनः परामर्श तिथि):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { days: 3, label: '3 Days' },
            { days: 5, label: '5 Days' },
            { days: 7, label: '7 Days' },
            { days: 15, label: '15 Days' },
            { days: 30, label: '1 Month' },
          ].map((item) => (
            <button
              key={item.days}
              onClick={() => setFollowUpDays(item.days)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                followUpDays === item.days
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}

          <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            Return: {followUpDateStr}
          </span>
        </div>
      </div>

      {/* FEATURE 2: DIAGNOSTIC LAB & RADIOLOGY REQUISITIONS CONTROLLER BAR (Hidden on Print) */}
      <div className="print:hidden w-full max-w-4xl bg-slate-900/90 border border-slate-800 p-5 rounded-2xl mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <FlaskConical className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">
              Diagnostic Lab & Radiology Orders (जाँच सलाह)
            </h3>
            <span className="text-[10px] bg-teal-500/20 text-teal-300 font-extrabold px-2.5 py-0.5 rounded-full border border-teal-500/30">
              {orderedTests.length} Selected
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTestPicker(!showTestPicker)}
            className="text-xs font-bold text-teal-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5"
          >
            <span>{showTestPicker ? 'Hide Test Catalog' : '+ Browse Test Catalog (CBC, X-Ray, etc.)'}</span>
            {showTestPicker ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Selected Test Chips */}
        {orderedTests.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {orderedTests.map((test) => (
              <span
                key={test}
                className="inline-flex items-center space-x-1.5 bg-teal-950/70 border border-teal-600/40 text-teal-200 text-xs px-3 py-1.5 rounded-xl font-bold shadow-sm"
              >
                <span>{test}</span>
                <button
                  type="button"
                  onClick={() => removeTest(test)}
                  className="p-0.5 text-teal-400 hover:text-rose-400 transition"
                  title="Remove test"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No investigations currently ordered for this prescription.</p>
        )}

        {/* Custom Test Adder Form */}
        <form onSubmit={addCustomTest} className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Type custom test name (e.g. Vitamin B12, Bilateral Knee MRI, Dengue NS1)..."
            value={customTestInput}
            onChange={(e) => setCustomTestInput(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 font-medium"
          />
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Test</span>
          </button>
        </form>

        {/* Expandable Test Catalog Picker */}
        {showTestPicker && (
          <div className="pt-3 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
            {POPULAR_INVESTIGATIONS.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {cat.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {cat.tests.map((test) => {
                    const isSelected = orderedTests.includes(test);
                    return (
                      <button
                        key={test}
                        type="button"
                        onClick={() => toggleTest(test)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-teal-500 text-slate-950 font-black shadow-md border border-teal-400'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{test}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GENUINE A4 RX SHEET CANVAS CONTAINER */}
      <div className="print-a4-container w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-sm">
        
        {/* Official Clinic Letterhead Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white print:bg-none print:text-slate-900 print:border-b-2 print:border-emerald-800 print:p-0 print:pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-950 print:hidden">
                  🩺
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white print:text-emerald-900 print:text-2xl">
                    {session?.clinic || 'Gupta Clinic & Joint Care Center'}
                  </h2>
                  <p className="text-xs text-emerald-300 font-bold print:text-slate-700 uppercase tracking-wider">
                    Advanced Orthopedic & Multi-Specialty OPD
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 print:text-slate-600 pt-1">
                Deoria Sadar, Near Railway Overbridge, Deoria (U.P.) • Emergency OPD: +91 98765 43210
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <h3 className="text-lg md:text-xl font-extrabold text-emerald-400 print:text-slate-900">
                {session?.name || 'Dr. Amit Kumar'}
              </h3>
              <p className="text-xs font-bold text-slate-200 print:text-slate-700">M.B.B.S., M.S. (Orthopedics)</p>
              <p className="text-[11px] text-emerald-300 print:text-emerald-800 font-semibold">Reg. No: UP-MED-84920</p>
              <p className="text-[10px] text-slate-400 print:text-slate-500 font-medium">Senior Orthopedic Consultant</p>
            </div>
          </div>
        </div>

        {/* Patient Demographics Banner */}
        <div className="bg-slate-100/80 border-y border-slate-300 px-6 md:px-8 py-3.5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Patient Name</span>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="bg-transparent font-black text-slate-900 text-sm focus:outline-none focus:border-emerald-600 w-full border-b border-dashed border-slate-400"
            />
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Age / Gender</span>
            <input
              type="text"
              value={patientAgeGender}
              onChange={(e) => setPatientAgeGender(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none focus:border-emerald-600 w-full border-b border-dashed border-slate-400"
            />
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Date & Token</span>
            <span className="font-extrabold text-emerald-800">Token #{tokenNumber} • {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Mobile Number</span>
            <input
              type="text"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none focus:border-emerald-600 w-full font-mono border-b border-dashed border-slate-400"
            />
          </div>
        </div>

        {/* Prescription Main Content */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Patient Vitals Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs font-medium">
            <div>
              <span className="text-slate-500 text-[11px]">B.P. (रक्तचाप):</span>{' '}
              <input type="text" value={vitals.bp} onChange={(e) => setVitals({ ...vitals, bp: e.target.value })} className="bg-transparent font-extrabold text-slate-900 w-20 focus:outline-none" />
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Pulse (नाड़ी):</span>{' '}
              <input type="text" value={vitals.pulse} onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })} className="bg-transparent font-extrabold text-slate-900 w-20 focus:outline-none" />
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Weight (वजन):</span>{' '}
              <input type="text" value={vitals.weight} onChange={(e) => setVitals({ ...vitals, weight: e.target.value })} className="bg-transparent font-extrabold text-slate-900 w-20 focus:outline-none" />
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Temp (तापमान):</span>{' '}
              <input type="text" value={vitals.temp} onChange={(e) => setVitals({ ...vitals, temp: e.target.value })} className="bg-transparent font-extrabold text-slate-900 w-20 focus:outline-none" />
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div>
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">Clinical Diagnosis (रोग व लक्षण)</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full font-bold text-slate-900 border-b-2 border-slate-300 py-1 focus:outline-none focus:border-emerald-600 text-sm"
            />
          </div>

          {/* Rx Medical Symbol */}
          <div className="flex items-center space-x-2">
            <span className="text-4xl font-serif font-black text-emerald-800">Rx</span>
            <span className="text-xs text-slate-400 font-semibold">Prescribed Medicines & Dosage Instructions</span>
          </div>

          {/* AI Clinical Drug Safety & Duplicate Salt Warning Banner (Hidden on Print) */}
          {safetyAlerts.length > 0 ? (
            <div className="print:hidden space-y-2">
              {safetyAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-start space-x-3 text-xs transition ${
                    alert.type === 'danger'
                      ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm'
                      : alert.type === 'warning'
                      ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-sm'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                  }`}
                >
                  {alert.type === 'danger' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs">{alert.title}</p>
                    <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed font-medium">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : medicines.length > 0 ? (
            <div className="print:hidden p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-bold text-[11px]">
                NABH AI Safety Verified: Zero duplicate active salts or major drug-drug interactions detected across {medicines.length} prescribed items.
              </span>
            </div>
          ) : null}

          {/* Prescribed Medicines Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-slate-800 text-xs font-black text-slate-600 uppercase tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Medicine Name (दवा का नाम)</th>
                  <th className="py-2.5 px-3">Dosage (खुराक)</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Instructions</th>
                  <th className="py-2.5 px-3 print:hidden text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {medicines.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 text-xs font-extrabold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 text-sm">{m.name}</td>
                    <td className="py-3 px-3 font-mono font-black text-emerald-800 text-sm">{m.dosage}</td>
                    <td className="py-3 px-3 text-xs font-semibold text-slate-700">{m.duration}</td>
                    <td className="py-3 px-3 text-xs text-slate-600">{m.timing}</td>
                    <td className="py-3 px-3 print:hidden text-right">
                      <button
                        onClick={() => handleRemoveMedicine(m.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                        title="Remove Medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Add Medicine Bar with Auto-Complete Search Dropdown (Hidden on Print) */}
          <div className="print:hidden p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative z-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <Search className="w-4 h-4" />
                <span>Search & Add Medicine (दवा की नई प्रविष्टि)</span>
              </span>
              <span className="text-[10px] text-slate-400">Type brand or generic name for instant suggestions</span>
            </div>

            <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {/* Medicine Name Auto-Complete Input */}
              <div className="md:col-span-3 relative" ref={searchContainerRef}>
                <input
                  type="text"
                  placeholder="Type medicine (e.g. Dolo, Augmentin, Pantocid)..."
                  value={newMed.name}
                  onChange={(e) => handleMedNameChange(e.target.value)}
                  onFocus={() => {
                    setFilteredSuggestions(MEDICINE_DATABASE);
                    setShowSuggestions(true);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  required
                />

                {/* Auto-Complete Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-800">
                    <div className="p-2 bg-slate-950 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Popular Medical Varieties & Dosage Formats
                    </div>
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((s, i) => (
                        <div
                          key={i}
                          onClick={() => selectSuggestion(s)}
                          className="p-3 hover:bg-emerald-500/10 cursor-pointer transition flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-emerald-400">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.category} • Default: {s.defaultDosage} ({s.defaultTiming})</p>
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">
                            Select
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-slate-400">No pre-set match. Press enter to add custom medicine name.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Dosage Input */}
              <input
                type="text"
                placeholder="Dosage (1-0-1)"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                className="px-3.5 py-2.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-mono"
              />

              {/* Duration Input */}
              <input
                type="text"
                placeholder="Duration (5 Days)"
                value={newMed.duration}
                onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                className="px-3.5 py-2.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />

              {/* Add Button */}
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-1 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Rx</span>
              </button>
            </form>
          </div>

          {/* FEATURE 2: PRINTABLE DIAGNOSTIC INVESTIGATIONS & LAB ORDERS SECTION */}
          {orderedTests.length > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center space-x-2 pb-2">
                <FlaskConical className="w-4 h-4 text-emerald-800" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Diagnostic Investigations & Radiology Orders (जाँच सलाह)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  {orderedTests.length} Tests
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {orderedTests.map((test, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                    <span className="font-extrabold text-slate-900 flex-1">{test}</span>
                    <button
                      type="button"
                      onClick={() => removeTest(test)}
                      className="print:hidden text-slate-400 hover:text-rose-600 p-0.5"
                      title="Remove Test"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Remarks & Instructions */}
          <div className="pt-2">
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">Doctor Advice & Remarks (चिकित्सकीय सलाह व निर्देश)</label>
            <textarea
              rows={3}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          {/* ITEM 1: PRINTED FOLLOW-UP RETURN DATE STAMP */}
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-800" />
              <span className="font-extrabold text-slate-900">Next Follow-Up Return Date (पुनः परामर्श तिथि):</span>
            </div>
            <span className="font-black text-emerald-900 bg-emerald-200/80 px-3 py-1 rounded-xl text-sm">
              {followUpDateStr}
            </span>
          </div>

          {/* FEATURE 4: NMC-COMPLIANT OFFICIAL FOOTER SIGNATURE & CLINIC SEAL ZONE */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-1 text-[10px] text-slate-500">
              <p className="font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>NMC Section 3.7 Compliant Digital Prescription</span>
              </p>
              <p>Scan QR code using DocNest Patient Mobile App to verify authentic digital copy.</p>
              <p className="font-mono text-emerald-900 font-bold">DocNest-Rx-ID: {`DN-2026-${tokenNumber}-9481`}</p>
            </div>

            {/* Signature & Seal Zone */}
            <div className="flex flex-col items-center md:items-end space-y-2 w-full md:w-auto">
              {/* Screen mode toggle (hidden on print) */}
              <div className="print:hidden flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setSignatureMode('seal')}
                  className={`px-3 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
                    signatureMode === 'seal'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stamp className="w-3.5 h-3.5" />
                  <span>Clinic Seal Stamp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureMode('draw')}
                  className={`px-3 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
                    signatureMode === 'draw'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Draw Signature Pad</span>
                </button>
              </div>

              {/* Mode A: Official Clinic Council Seal */}
              {signatureMode === 'seal' && (
                <div className="p-3 border-2 border-emerald-800 rounded-2xl bg-emerald-50/60 text-center text-emerald-950 font-sans min-w-[220px] shadow-sm">
                  <div className="flex items-center justify-center space-x-1 text-[9px] font-black uppercase tracking-widest text-emerald-900 border-b border-emerald-300 pb-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>REGISTERED MEDICAL PRACTITIONER</span>
                  </div>
                  <p className="font-serif italic font-black text-base text-emerald-900 mt-1">
                    {session?.name || 'Dr. Amit Kumar'}
                  </p>
                  <p className="text-[10px] font-extrabold text-slate-800">M.B.B.S., M.S. (Orthopedics)</p>
                  <p className="font-mono text-[10px] font-black text-emerald-900 tracking-wide">
                    Reg. No: UP-MED-84920
                  </p>
                  <p className="text-[9px] text-slate-600 font-semibold pt-0.5">
                    {session?.clinic || 'Gupta Clinic & Joint Care Center'}
                  </p>
                </div>
              )}

              {/* Mode B: Interactive Canvas Drawing Pad */}
              {signatureMode === 'draw' && (
                <div className="space-y-1.5 text-center">
                  <div className="border-2 border-emerald-800/80 rounded-2xl bg-slate-50/80 p-1 relative shadow-inner">
                    <canvas
                      ref={canvasRef}
                      width={260}
                      height={90}
                      onMouseDown={startDrawing}
                      onMouseMove={drawMove}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={drawMove}
                      onTouchEnd={stopDrawing}
                      className="cursor-crosshair bg-white rounded-xl touch-none"
                    />
                    {!signatureDataUrl && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs font-semibold">
                        Sign here with stylus / finger / mouse
                      </div>
                    )}
                  </div>
                  <div className="print:hidden flex justify-between items-center text-[10px] px-1">
                    <span className="text-slate-500 font-medium">Digital Signature Pad</span>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-rose-600 hover:text-rose-700 font-bold flex items-center space-x-0.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center pt-1">
                <p className="text-xs font-serif italic font-bold text-slate-900">
                  {session?.name || 'Dr. Amit Kumar'}
                </p>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  Authorized Doctor Signature & Verification Seal
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FEATURE 3: PATIENT PAST MEDICAL HISTORY & REVISIT TIMELINE DRAWER */}
      {showHistoryDrawer && (
        <div className="print:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-xl bg-slate-900 text-slate-100 border-l border-slate-800 h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1 rounded-full text-xs font-black">
                    <History className="w-3.5 h-3.5" />
                    <span>Clinical Consultation Timeline</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{patientName}</h3>
                  <p className="text-xs text-slate-400">Past visits, vitals, prescriptions & diagnostic reports</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryDrawer(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 border border-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toast for copy */}
              {copyHistorySuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{copyHistorySuccess}</span>
                </div>
              )}

              {/* Visits List */}
              <div className="space-y-4">
                {pastVisits.map((visit, vIdx) => (
                  <div
                    key={visit.id || vIdx}
                    className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-4 hover:border-teal-500/40 transition"
                  >
                    {/* Top Row: Date & Refill Button */}
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-700/60 pb-3">
                      <div>
                        <span className="text-xs font-black text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                          📅 {visit.date}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">{visit.doctorName} • {visit.clinicName}</p>
                      </div>

                      {/* 1-Click Copy / Refill Previous Rx Button */}
                      <button
                        type="button"
                        onClick={() => refillFromVisit(visit)}
                        className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black px-3.5 py-2 rounded-xl text-xs shadow flex items-center space-x-1.5 transition active:scale-95"
                        title="Copy all medicines, diagnosis, tests and advice into active prescription"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>🔁 Refill / Copy Rx</span>
                      </button>
                    </div>

                    {/* Diagnosis */}
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Diagnosis</span>
                      <p className="text-xs font-extrabold text-white mt-0.5">{visit.diagnosis}</p>
                    </div>

                    {/* Vitals Snapshot */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">B.P.</span>
                        <span className="font-bold text-white">{visit.vitals.bp}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Pulse</span>
                        <span className="font-bold text-white">{visit.vitals.pulse}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Weight</span>
                        <span className="font-bold text-white">{visit.vitals.weight}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Temp</span>
                        <span className="font-bold text-white">{visit.vitals.temp}</span>
                      </div>
                    </div>

                    {/* Prescribed Medicines */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        Medicines Prescribed ({visit.medicines.length})
                      </span>
                      <div className="space-y-1">
                        {visit.medicines.map((m, mIdx) => (
                          <div key={mIdx} className="flex justify-between items-center text-xs p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                            <div>
                              <span className="font-bold text-slate-200">{m.name}</span>
                              <span className="text-[10px] text-slate-400 block">{m.timing}</span>
                            </div>
                            <span className="font-mono text-[11px] text-teal-400 font-black">{m.dosage} • {m.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ordered Tests if any */}
                    {visit.orderedTests && visit.orderedTests.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Lab / Radiology Orders
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {visit.orderedTests.map((t, tIdx) => (
                            <span key={tIdx} className="text-[11px] bg-teal-950/80 text-teal-300 border border-teal-800/50 px-2 py-0.5 rounded-md font-semibold">
                              🔬 {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advice */}
                    {visit.advice && (
                      <div className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                        "{visit.advice}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowHistoryDrawer(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition"
              >
                Close History Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DigitalPrescriptionPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0c1219] p-8 text-center text-slate-400">Loading prescription builder...</div>}>
      <PrescriptionContent />
    </React.Suspense>
  );
}
