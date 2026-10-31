import { DOCTORS_DIRECTORY, DoctorProfile } from './doctors-data';

export interface SymptomAnalysisResult {
  recommendedSpecialty: string;
  specialtyId: 'orthopedic' | 'general' | 'pediatrics' | 'gynecology' | 'cardio' | 'ent' | 'dermatology';
  confidence: number; // 0 to 100
  urgencyLevel: 'Routine OPD' | 'Priority OPD' | 'Immediate Medical Attention (108)';
  summaryHindi: string;
  summaryEnglish: string;
  firstAidAdvice: string[];
  suggestedDoctors: DoctorProfile[];
}

export const COMMON_SYMPTOMS_CATALOG = [
  { id: 'fever', label: 'बुखार व शरीर दर्द', en: 'Viral Fever & Body Ache', icon: '🌡️' },
  { id: 'joints', label: 'जोड़ों व घुटने में दर्द', en: 'Joint & Knee Pain', icon: '🦴' },
  { id: 'acidity', label: 'गैस व सीने में जलन', en: 'Hyperacidity & Gas', icon: '🧪' },
  { id: 'child', label: 'बच्चे को उल्टी / दस्त', en: 'Child Illness & Fever', icon: '👶' },
  { id: 'heart', label: 'घबराहट व हाई बीपी', en: 'Palpitations & High BP', icon: '❤️' },
  { id: 'ent', label: 'गला खराब व कान दर्द', en: 'Sore Throat & Ear Ache', icon: '👂' },
  { id: 'pregnancy', label: 'गर्भावस्था व पेट दर्द', en: 'Pregnancy & Period Care', icon: '🤰' },
  { id: 'skin', label: 'दाद, खुजली व लाल चकत्ते', en: 'Skin Rash & Itching', icon: '✨' },
];

export function analyzeSymptomInput(query: string): SymptomAnalysisResult {
  const q = query.toLowerCase().trim();

  // 1. Emergency Red Flags (Chest pain + sweating / fainting)
  if (
    (q.includes('chest') && (q.includes('pressure') || q.includes('tight') || q.includes('crush') || q.includes('heavy'))) ||
    (q.includes('chhati') && (q.includes('dard') || q.includes('dabav'))) ||
    q.includes('heart attack') || q.includes('behosh') || q.includes('fainted')
  ) {
    const cardioDocs = DOCTORS_DIRECTORY.filter(d => d.specialty.toLowerCase().includes('cardio') || d.specialty.toLowerCase().includes('physician'));
    return {
      recommendedSpecialty: 'Cardiologist / Emergency Medicine',
      specialtyId: 'cardio',
      confidence: 98,
      urgencyLevel: 'Immediate Medical Attention (108)',
      summaryHindi: 'गंभीर चेतावनी: सीने में भारीपन या दर्द दिल से संबंधित हो सकता है। तुरंत नजदीकी आपातकालीन केंद्र (District Hospital Deoria) जाएं या 108 डायल करें।',
      summaryEnglish: 'Emergency Alert: Acute chest pressure may indicate cardiac distress. Do not wait for routine OPD. Seek immediate emergency evaluation.',
      firstAidAdvice: [
        'रोगी को आराम से बिठाएं और हवादार स्थान पर रखें।',
        'यदि डॉक्टर ने पहले सलाह दी हो तो Sorbitrate या Aspirin लें।',
        'एंबुलेंस हेल्पलाइन 108 पर तत्काल कॉल करें।'
      ],
      suggestedDoctors: cardioDocs
    };
  }

  // 2. Pediatric conditions
  if (
    q.includes('child') || q.includes('baby') || q.includes('baccha') || q.includes('bacha') ||
    q.includes('pediatric') || q.includes('shishu') || q.includes('toddler') || q.includes('infant')
  ) {
    const peds = DOCTORS_DIRECTORY.filter(d => d.specialty.toLowerCase().includes('pediatric'));
    return {
      recommendedSpecialty: 'Pediatrician (बाल रोग विशेषज्ञ)',
      specialtyId: 'pediatrics',
      confidence: 95,
      urgencyLevel: q.includes('high fever') || q.includes('tez bukhar') ? 'Priority OPD' : 'Routine OPD',
      summaryHindi: 'बच्चों की शारीरिक संरचना वयस्कों से भिन्न होती है। विशेषज्ञ बाल रोग चिकित्सक से परामर्श लें।',
      summaryEnglish: 'Pediatric symptoms require careful weight-adjusted dosage and child specialist evaluation.',
      firstAidAdvice: [
        'बच्चे को पर्याप्त ओआरएस (ORS) या हल्का तरल पदार्थ दें।',
        'तेज बुखार में माथे पर ताजे पानी की गीली पट्टी रखें।',
        'बिना डॉक्टर के पर्चे के वयस्कों की दवा न दें।'
      ],
      suggestedDoctors: peds.length ? peds : DOCTORS_DIRECTORY
    };
  }

  // 3. Orthopedic & Joint Pain
  if (
    q.includes('joint') || q.includes('knee') || q.includes('ghutna') || q.includes('kamar') ||
    q.includes('back') || q.includes('bone') || q.includes('haddi') || q.includes('fracture') ||
    q.includes('arthritis') || q.includes('shoulder') || q.includes('stiffness') || q.includes('ligament') ||
    q.includes('joints')
  ) {
    const ortho = DOCTORS_DIRECTORY.filter(d => d.specialty.toLowerCase().includes('ortho'));
    return {
      recommendedSpecialty: 'Orthopedic Surgeon (हड्डी व जोड़ रोग विशेषज्ञ)',
      specialtyId: 'orthopedic',
      confidence: 96,
      urgencyLevel: 'Routine OPD',
      summaryHindi: 'घुटनों, कमर या जोड़ों में दर्द व जकड़न के लिए हड्डी एवं जोड़ रोग विशेषज्ञ से परामर्श आवश्यक है।',
      summaryEnglish: 'Joint stiffness, back pain or ligament strain should be clinically assessed by an Orthopedic Consultant.',
      firstAidAdvice: [
        'दर्द वाले हिस्से पर गर्म पानी या आइस पैक की सिकाई करें।',
        'सीढ़ियां चढ़ने व भारी वजन उठाने से परहेज करें।',
        'डॉक्टर द्वारा बताए गए पर्चे पर ही दर्द निवारक लें।'
      ],
      suggestedDoctors: ortho.length ? ortho : DOCTORS_DIRECTORY
    };
  }

  // 4. Gynecology & Women's Health
  if (
    q.includes('period') || q.includes('mahawari') || q.includes('pregnancy') || q.includes('garbh') ||
    q.includes('gynec') || q.includes('female') || q.includes('mahila') || q.includes('pelvic') ||
    q.includes('white discharge') || q.includes('bleeding')
  ) {
    const gyn = DOCTORS_DIRECTORY.filter(d => d.specialty.toLowerCase().includes('gynec'));
    return {
      recommendedSpecialty: 'Gynecologist & Obstetrician (स्त्री एवं प्रसूति रोग विशेषज्ञ)',
      specialtyId: 'gynecology',
      confidence: 94,
      urgencyLevel: 'Priority OPD',
      summaryHindi: 'मासिक धर्म, गर्भावस्था या महिला स्वास्थ्य संबंधी लक्षणों के लिए स्त्री रोग विशेषज्ञ से तुरंत जांच कराएं।',
      summaryEnglish: 'Consult a verified Gynecologist for menstrual irregularities, antenatal maternal care, or pelvic pain.',
      firstAidAdvice: [
        'भरपूर आराम करें और पानी का सेवन अधिक रखें।',
        'तेज दर्द होने पर डॉक्टर की पूर्व सलाह के अनुसार ही दवा लें।'
      ],
      suggestedDoctors: gyn.length ? gyn : DOCTORS_DIRECTORY
    };
  }

  // 5. ENT (Ear, Nose, Throat)
  if (
    q.includes('ear') || q.includes('throat') || q.includes('kaan') || q.includes('gala') ||
    q.includes('tonsil') || q.includes('hearing') || q.includes('sinus') || q.includes('nose') ||
    q.includes('ent')
  ) {
    const ent = DOCTORS_DIRECTORY.filter(d => d.specialty.toLowerCase().includes('ent'));
    return {
      recommendedSpecialty: 'ENT Specialist (नाक, कान व गला रोग विशेषज्ञ)',
      specialtyId: 'ent',
      confidence: 92,
      urgencyLevel: 'Routine OPD',
      summaryHindi: 'गले में खराश, टॉन्सिल या कान के दर्द व इन्फेक्शन के लिए ईएनटी विशेषज्ञ को दिखाएं।',
      summaryEnglish: 'Ear infections, persistent sore throat, or sinus congestion require ENT endoscopic examination.',
      firstAidAdvice: [
        'हल्के गुनगुने नमक के पानी से दिन में 2-3 बार गरारे करें।',
        'कान में बिना डॉक्टर की सलाह के तेल या नुकीली वस्तु न डालें।'
      ],
      suggestedDoctors: ent.length ? ent : DOCTORS_DIRECTORY
    };
  }

  // 6. Default to General Physician / Internal Medicine
  const genPhysicians = DOCTORS_DIRECTORY.filter(d => d.specialty.toLowerCase().includes('physician') || d.specialty.toLowerCase().includes('medicine'));
  return {
    recommendedSpecialty: 'General Physician / Internal Medicine (वरिष्ठ फिजिशियन)',
    specialtyId: 'general',
    confidence: 88,
    urgencyLevel: 'Routine OPD',
    summaryHindi: 'बुखार, कमजोरी, पेट विकार या सामान्य अस्वस्थता के लिए फिजिशियन की ओपीडी जांच उपयुक्त है।',
    summaryEnglish: 'Comprehensive clinical evaluation by an Internal Medicine Consultant for diagnosis and targeted treatment.',
    firstAidAdvice: [
      'ताजा, सुपाच्य और हल्का भोजन लें।',
      'पर्याप्त आराम करें और तापमान चार्ट बनाकर रखें।'
    ],
    suggestedDoctors: genPhysicians.length ? genPhysicians : DOCTORS_DIRECTORY
  };
}
