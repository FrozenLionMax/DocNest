import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Search,
  Clock,
  PhoneCall,
  Pill,
  ChevronRight,
  Star,
  ShieldCheck,
  Activity,
  Calendar,
  Sparkles,
  Stethoscope,
  HeartPulse,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { SPECIALTIES } from '../../../../packages/shared/constants/specialties';
import { openMedicaveOrder, shareLiveQueueStatus } from '../../lib/whatsapp';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [selectedBlock] = useState('Deoria Sadar');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Queue Counter State
  const [activeQueue] = useState({
    doctorName: 'Dr. Amit Kumar',
    specialty: 'Orthopedic Surgeon (हड्डी रोग)',
    currentToken: 14,
    userToken: 18,
    estimatedWaitMins: 20,
    clinicName: 'Gupta Clinic, Station Road',
  });

  useEffect(() => {
    fetchTopDoctors();
  }, []);

  const fetchTopDoctors = async () => {
    try {
      const { data } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .limit(5);

      if (data && data.length > 0) {
        setDoctors(data);
      } else {
        setDoctors([
          {
            id: '1',
            full_name: 'Dr. Amit Kumar',
            specialization: 'Orthopedic Surgeon',
            qualification: 'MBBS, MS (Ortho)',
            experience_years: 12,
            consultation_fee: 300,
            clinic_name: 'Gupta Clinic, Station Road, Deoria',
            avg_rating: 4.9,
            total_reviews: 142,
            is_verified: true,
          },
          {
            id: '2',
            full_name: 'Dr. Sunita Rai',
            specialization: 'Gynecologist & Obstetrician',
            qualification: 'MBBS, DGO',
            experience_years: 15,
            consultation_fee: 400,
            clinic_name: 'Rai Hospital, Malviya Road, Deoria',
            avg_rating: 4.8,
            total_reviews: 198,
            is_verified: true,
          },
          {
            id: '3',
            full_name: 'Dr. Rajesh Verma',
            specialization: 'General Physician',
            qualification: 'MBBS, MD (Medicine)',
            experience_years: 18,
            consultation_fee: 250,
            clinic_name: 'Verma Clinic, Civil Lines, Deoria',
            avg_rating: 4.7,
            total_reviews: 110,
            is_verified: true,
          },
        ]);
      }
    } catch (err) {
      console.warn('Doctor fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCallEmergency = () => {
    Linking.openURL('tel:108');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Professional Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.locationTag}>
            <MapPin size={14} color={COLORS.primary} />
            <Text style={styles.locationText}>📍 Deoria, UP ({selectedBlock})</Text>
          </View>

          <TouchableOpacity
            style={styles.medicavePill}
            onPress={() => openMedicaveOrder()}
          >
            <Pill size={14} color={COLORS.white} />
            <Text style={styles.medicavePillText}>Medicave Store</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heroGreeting}>
          {t('home.hero_title', 'देवरिया के डॉक्टर खोजें')}
        </Text>
        <Text style={styles.heroSubText}>
          विश्वसनीय डॉक्टर, ऑनलाइन अपॉइंटमेंट व क्लिनिक टोकन नंबर
        </Text>

        {/* Search Input Bar */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Search size={18} color={COLORS.textMuted} />
          <Text style={styles.searchPlaceholder}>
            डॉक्टर का नाम, बीमारी या क्लिनिक खोजें...
          </Text>
        </TouchableOpacity>
      </View>

      {/* SLEEK LIVE QUEUE COUNTER WIDGET */}
      <View style={styles.sectionMargin}>
        <View style={styles.queueCard}>
          <View style={styles.queueHeader}>
            <View style={styles.liveStatusBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveStatusText}>LIVE COUNTER</Text>
            </View>
            <Text style={styles.queueClinicName}>{activeQueue.clinicName}</Text>
          </View>

          <Text style={styles.queueDocTitle}>{activeQueue.doctorName}</Text>
          <Text style={styles.queueDocSub}>{activeQueue.specialty}</Text>

          {/* Tokens Visual Row */}
          <View style={styles.tokenRow}>
            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>चालू नंबर (Current)</Text>
              <Text style={styles.tokenNumberCurrent}>#{activeQueue.currentToken}</Text>
            </View>

            <View style={styles.tokenSeparator} />

            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>आपका नंबर (Your Token)</Text>
              <Text style={styles.tokenNumberUser}>#{activeQueue.userToken}</Text>
            </View>
          </View>

          <View style={styles.queueFooter}>
            <View style={styles.waitBadge}>
              <Clock size={14} color={COLORS.primary} />
              <Text style={styles.waitText}>इंतज़ार: ~{activeQueue.estimatedWaitMins} मिनट</Text>
            </View>

            <TouchableOpacity
              style={styles.shareWhatsappBtn}
              onPress={() =>
                shareLiveQueueStatus(
                  activeQueue.doctorName,
                  activeQueue.currentToken,
                  activeQueue.userToken,
                  activeQueue.estimatedWaitMins
                )
              }
            >
              <Text style={styles.shareWhatsappText}>व्हाट्सएप शेयर</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* QUICK ACTIONS CARDS */}
      <View style={styles.sectionMargin}>
        <View style={styles.quickGrid}>
          {/* Emergency Direct Call */}
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }]}
            onPress={handleCallEmergency}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#EF4444' }]}>
              <PhoneCall size={20} color={COLORS.white} />
            </View>
            <Text style={[styles.quickCardTitle, { color: '#991B1B' }]}>🚑 Emergency</Text>
            <Text style={styles.quickCardSub}>108 / 112 हेल्प कॉल</Text>
          </TouchableOpacity>

          {/* Medicave Medicine Orders */}
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#FFF7ED', borderColor: '#FDBA74' }]}
            onPress={() => openMedicaveOrder()}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: COLORS.secondary }]}>
              <Pill size={20} color={COLORS.white} />
            </View>
            <Text style={[styles.quickCardTitle, { color: '#C2410C' }]}>💊 Medicave</Text>
            <Text style={styles.quickCardSub}>दवाई पर्चा व्हाट्सएप करें</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SPECIALTIES GRID */}
      <View style={styles.sectionMargin}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>विशेषज्ञता द्वारा खोजें (Specialties)</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
            <Text style={styles.seeAllLink}>सभी देखें →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.specialtiesGrid}>
          {SPECIALTIES.slice(0, 8).map((spec) => (
            <TouchableOpacity
              key={spec.id}
              style={styles.specialtyCard}
              onPress={() => router.push(`/(tabs)/search?specialty=${spec.id}`)}
            >
              <View style={styles.specialtyIconCircle}>
                <Stethoscope size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.specialtyLabel} numberOfLines={1}>
                {spec.name_hi}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* FEATURED DOCTORS IN DEORIA */}
      <View style={[styles.sectionMargin, { marginBottom: SPACING.xxl }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>देवरिया के शीर्ष डॉक्टर (Top Doctors)</Text>
        </View>

        {doctors.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.doctorCard}
            onPress={() => router.push(`/doctor/${doc.id}`)}
          >
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorAvatarText}>{doc.full_name[4] || 'D'}</Text>
            </View>

            <View style={styles.doctorContent}>
              <View style={styles.docTitleRow}>
                <Text style={styles.doctorNameText}>{doc.full_name}</Text>
                {doc.is_verified && <ShieldCheck size={16} color={COLORS.primary} />}
              </View>

              <Text style={styles.doctorSpecText}>{doc.specialization}</Text>
              <Text style={styles.doctorClinicText} numberOfLines={1}>
                📍 {doc.clinic_name}
              </Text>

              <View style={styles.doctorMetaRow}>
                <View style={styles.ratingBadge}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingValText}>{doc.avg_rating || 4.9}</Text>
                </View>
                <Text style={styles.feeTag}>₹{doc.consultation_fee}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.bookSlotBtn}
              onPress={() => router.push(`/doctor/${doc.id}`)}
            >
              <Text style={styles.bookSlotBtnText}>बुकिंग</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  medicavePill: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medicavePillText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  heroGreeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  heroSubText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    height: 48,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchPlaceholder: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  sectionMargin: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  queueCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  liveStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  liveStatusText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  queueClinicName: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  queueDocTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  queueDocSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  tokenRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tokenBox: {
    flex: 1,
    alignItems: 'center',
  },
  tokenSeparator: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  tokenLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tokenNumberCurrent: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  tokenNumberUser: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  queueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waitText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  shareWhatsappBtn: {
    backgroundColor: COLORS.whatsappGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  shareWhatsappText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  quickIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  quickCardSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  seeAllLink: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specialtyCard: {
    width: '22%',
    alignItems: 'center',
  },
  specialtyIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.primaryMuted,
  },
  specialtyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  doctorCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  doctorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  doctorAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  doctorContent: {
    flex: 1,
  },
  docTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  doctorSpecText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  doctorClinicText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  doctorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingValText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  feeTag: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  bookSlotBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  bookSlotBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
