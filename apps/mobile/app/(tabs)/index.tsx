import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
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
  AlertCircle,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { SPECIALTIES } from '../../../../packages/shared/constants/specialties';
import { openMedicaveOrder, shareLiveQueueStatus } from '../../lib/whatsapp';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [selectedBlock, setSelectedBlock] = useState('Deoria Sadar');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo active queue state (realtime listening connected in backend)
  const [activeQueue, setActiveQueue] = useState({
    doctorName: 'Dr. Amit Kumar',
    specialty: 'Orthopedic (हड्डी रोग)',
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
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .limit(5);

      if (data && data.length > 0) {
        setDoctors(data);
      } else {
        // Fallback demo data for Deoria doctors
        setDoctors([
          {
            id: '1',
            full_name: 'Dr. Amit Kumar',
            specialization: 'Orthopedic Surgeon',
            qualification: 'MBBS, MS (Ortho)',
            experience_years: 12,
            consultation_fee: 300,
            clinic_name: 'Gupta Clinic, Station Road, Deoria',
            avg_rating: 4.8,
            total_reviews: 124,
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
            avg_rating: 4.9,
            total_reviews: 180,
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
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={18} color={COLORS.white} />
          <Text style={styles.locationTitle}>📍 Deoria, UP</Text>
          <Text style={styles.locationSubtitle}>({selectedBlock})</Text>
        </View>
        <TouchableOpacity
          style={styles.medicaveHeaderBadge}
          onPress={() => openMedicaveOrder()}
        >
          <Pill size={16} color={COLORS.white} />
          <Text style={styles.medicaveBadgeText}>Medicave</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Banner / Search Bar */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          {t('home.hero_title', 'देवरिया के डॉक्टर खोजें')}
        </Text>
        <Text style={styles.heroSubtitle}>
          {t('home.hero_subtitle', 'अपॉइंटमेंट बुक करें और लाइव पर्ची नंबर देखें')}
        </Text>

        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Search size={20} color={COLORS.textMuted} />
          <Text style={styles.searchPlaceholder}>
            {t('home.search_placeholder', 'डॉक्टर, क्लिनिक या बीमारी खोजें...')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIVE QUEUE TRACKER WIDGET */}
      <View style={styles.sectionContainer}>
        <View style={styles.queueCard}>
          <View style={styles.queueHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE COUNTER</Text>
            </View>
            <Text style={styles.queueClinicText}>{activeQueue.clinicName}</Text>
          </View>

          <Text style={styles.queueDoctorName}>{activeQueue.doctorName}</Text>
          <Text style={styles.queueDoctorSub}>{activeQueue.specialty}</Text>

          {/* Token Numbers Box */}
          <View style={styles.tokenRow}>
            <View style={styles.tokenBoxCurrent}>
              <Text style={styles.tokenBoxLabel}>चालू नंबर (Current)</Text>
              <Text style={styles.tokenNumberCurrent}>
                #{activeQueue.currentToken}
              </Text>
            </View>

            <View style={styles.tokenDivider} />

            <View style={styles.tokenBoxUser}>
              <Text style={styles.tokenBoxLabel}>आपका नंबर (Your Token)</Text>
              <Text style={styles.tokenNumberUser}>
                #{activeQueue.userToken}
              </Text>
            </View>
          </View>

          <View style={styles.queueFooter}>
            <View style={styles.waitBox}>
              <Clock size={16} color={COLORS.secondary} />
              <Text style={styles.waitText}>
                अनुमानित समय: ~{activeQueue.estimatedWaitMins} मिनट
              </Text>
            </View>
            <TouchableOpacity
              style={styles.shareQueueBtn}
              onPress={() =>
                shareLiveQueueStatus(
                  activeQueue.doctorName,
                  activeQueue.currentToken,
                  activeQueue.userToken,
                  activeQueue.estimatedWaitMins
                )
              }
            >
              <Text style={styles.shareQueueText}>व्हाट्सएप शेयर</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* QUICK ACTIONS ROW */}
      <View style={styles.sectionContainer}>
        <View style={styles.quickActionsGrid}>
          {/* Emergency Button */}
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#FFF0F0' }]}
            onPress={handleCallEmergency}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#FF4D4D' }]}>
              <PhoneCall size={22} color={COLORS.white} />
            </View>
            <Text style={[styles.quickTitle, { color: '#D32F2F' }]}>
              🚑 Emergency
            </Text>

            <Text style={styles.quickSub}>Call 108 / 112</Text>
          </TouchableOpacity>

          {/* Medicave Pharmacy Button */}
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#FFF6F0' }]}
            onPress={() => openMedicaveOrder()}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: COLORS.secondary }]}>
              <Pill size={22} color={COLORS.white} />
            </View>
            <Text style={[styles.quickTitle, { color: COLORS.secondary }]}>
              💊 Medicave
            </Text>
            <Text style={styles.quickSub}>दवाई व्हाट्सएप करें</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SPECIALTIES GRID */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('home.specialties', 'विशेषज्ञता द्वारा खोजें')}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
            <Text style={styles.seeAllText}>सभी देखें</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.specialtiesGrid}>
          {SPECIALTIES.slice(0, 8).map((spec) => (
            <TouchableOpacity
              key={spec.id}
              style={styles.specialtyItem}
              onPress={() => router.push(`/(tabs)/search?specialty=${spec.id}`)}
            >
              <View style={styles.specialtyIconBg}>
                <StethoscopeIcon id={spec.id} />
              </View>
              <Text style={styles.specialtyName} numberOfLines={1}>
                {spec.name_hi}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* TOP DOCTORS IN DEORIA */}
      <View style={[styles.sectionContainer, { marginBottom: SPACING.xxl }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('home.top_doctors', 'देवरिया के प्रमुख डॉक्टर')}
          </Text>
        </View>

        {doctors.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.doctorCard}
            onPress={() => router.push(`/(tabs)/search?doctor=${doc.id}`)}
          >
            <View style={styles.doctorAvatar}>
              <Text style={styles.avatarText}>{doc.full_name[4] || 'D'}</Text>
            </View>

            <View style={styles.doctorInfo}>
              <View style={styles.docTitleRow}>
                <Text style={styles.docName}>{doc.full_name}</Text>
                {doc.is_verified && (
                  <ShieldCheck size={16} color={COLORS.primary} />
                )}
              </View>

              <Text style={styles.docSpecialty}>{doc.specialization}</Text>
              <Text style={styles.docClinic} numberOfLines={1}>
                📍 {doc.clinic_name}
              </Text>

              <View style={styles.docMetaRow}>
                <View style={styles.ratingBadge}>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{doc.avg_rating || 4.8}</Text>
                </View>
                <Text style={styles.feeText}>₹{doc.consultation_fee}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.bookBtn}>
              <Text style={styles.bookBtnText}>बुकिंग</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// Specialty Icon Helper
function StethoscopeIcon({ id }: { id: string }) {
  return <Activity size={24} color={COLORS.primary} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationTitle: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  locationSubtitle: {
    color: COLORS.tealLight,
    fontSize: 13,
  },
  medicaveHeaderBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medicaveBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  heroSection: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  heroSubtitle: {
    color: COLORS.tealLight,
    fontSize: 13,
    marginTop: 2,
    marginBottom: SPACING.lg,
  },
  searchBar: {
    backgroundColor: COLORS.white,
    height: 50,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...SHADOWS.card,
  },
  searchPlaceholder: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  queueCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.modal,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
  },
  liveText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  queueClinicText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  queueDoctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  queueDoctorSub: {
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
  tokenBoxCurrent: {
    flex: 1,
    alignItems: 'center',
  },
  tokenBoxUser: {
    flex: 1,
    alignItems: 'center',
  },
  tokenDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  tokenBoxLabel: {
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
  waitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waitText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  shareQueueBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  shareQueueText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  quickSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  specialtyItem: {
    width: '22%',
    alignItems: 'center',
  },
  specialtyIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  specialtyName: {
    fontSize: 12,
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
    ...SHADOWS.card,
  },
  doctorAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  doctorInfo: {
    flex: 1,
  },
  docTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  docName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  docSpecialty: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  docClinic: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  feeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bookBtn: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  bookBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
