import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Award,
  MessageCircle,
  Calendar,
  ChevronRight,
  Phone,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { contactDoctorWhatsApp } from '../../lib/whatsapp';
import { supabase } from '../../lib/supabase';
import { useBookingStore } from '../../store/bookingStore';

export default function DoctorDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { setDoctor } = useBookingStore();

  const [doctor, setDoctorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      if (!id) return;
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id as string)
        .single();

      if (data) {
        setDoctorData(data);
      } else {
        // Fallback mock doctor details for Deoria
        setDoctorData({
          id: id || '1',
          full_name: 'Dr. Amit Kumar',
          specialization: 'Orthopedic Surgeon (हड्डी रोग विशेषज्ञ)',
          qualification: 'MBBS, MS (Ortho), Fellowship in Joint Replacement',
          experience_years: 12,
          consultation_fee: 300,
          clinic_name: 'Gupta Clinic & Joint Care Center',
          clinic_address: 'Station Road, Near Railway Station, Deoria Sadar',
          phone: '+919876543210',
          bio: '12+ वर्षों का अनुभव। हड्डी फ्रैक्चर, जोड़ों का दर्द, गठिया और स्पाइन समस्याओं का देवरिया में आधुनिक इलाज।',
          avg_rating: 4.8,
          total_reviews: 124,
          is_verified: true,
        });
      }
    } catch (err) {
      console.warn('Fetch doctor detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMap = () => {
    if (doctor?.clinic_address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${doctor.clinic_name}, ${doctor.clinic_address}`
      )}`;
      Linking.openURL(url);
    }
  };

  const handleStartBooking = () => {
    if (doctor) {
      setDoctor(doctor.id, doctor.full_name, doctor.consultation_fee);
      router.push(`/booking/${doctor.id}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header Navigation */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('doctor.profile', 'डॉक्टर प्रोफाइल')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Doctor Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {doctor?.full_name ? doctor.full_name[4] || 'D' : 'D'}
              </Text>
            </View>

            <View style={styles.heroInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.doctorName}>{doctor?.full_name}</Text>
                {doctor?.is_verified && (
                  <ShieldCheck size={18} color={COLORS.primary} />
                )}
              </View>

              <Text style={styles.specialtyText}>{doctor?.specialization}</Text>
              <Text style={styles.qualText}>{doctor?.qualification}</Text>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statBox}>
              <Award size={18} color={COLORS.primary} />
              <Text style={styles.statVal}>{doctor?.experience_years}+ वर्ष</Text>
              <Text style={styles.statLabel}>अनुभव</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Star size={18} color="#FFD700" fill="#FFD700" />
              <Text style={styles.statVal}>{doctor?.avg_rating || 4.8} ★</Text>
              <Text style={styles.statLabel}>{doctor?.total_reviews || 100}+ रेटिंग</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statFee}>₹{doctor?.consultation_fee}</Text>
              <Text style={styles.statLabel}>फीस (Fee)</Text>
            </View>
          </View>
        </View>

        {/* Clinic Location Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>🏥 क्लिनिक एवं पता (Clinic Details)</Text>
          <Text style={styles.clinicName}>{doctor?.clinic_name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={COLORS.textMuted} />
            <Text style={styles.addressText}>{doctor?.clinic_address}</Text>
          </View>

          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
            <Text style={styles.mapButtonText}>📍 गूगल मैप्स पर दिशा देखें (Get Directions)</Text>
          </TouchableOpacity>
        </View>

        {/* About Bio Section */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>ℹ️ डॉक्टर के बारे में (About)</Text>
          <Text style={styles.bioText}>{doctor?.bio}</Text>
        </View>

        {/* Contact Doctor Option */}
        <TouchableOpacity
          style={styles.whatsappCard}
          onPress={() => contactDoctorWhatsApp(doctor?.phone || '9876543210', doctor?.full_name || '')}
        >
          <MessageCircle size={24} color="#25D366" />
          <View style={styles.whatsappTextContainer}>
            <Text style={styles.whatsappTitle}>व्हाट्सएप पर सवाल पूछें</Text>
            <Text style={styles.whatsappSub}>डॉक्टर के सहायक से सीधे बात करें</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </ScrollView>

      {/* Sticky Bottom Bar for Booking */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomFeeLabel}>परामर्श शुल्क (Fee)</Text>
          <Text style={styles.bottomFeeVal}>₹{doctor?.consultation_fee || 300}</Text>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleStartBooking}>
          <Calendar size={20} color={COLORS.white} />
          <Text style={styles.bookButtonText}>अपॉइंटमेंट बुक करें</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  heroInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  specialtyText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2,
  },
  qualText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  statFee: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.md,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  mapButton: {
    backgroundColor: COLORS.tealLight,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  mapButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  bioText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  whatsappCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    ...SHADOWS.card,
  },
  whatsappTextContainer: {
    flex: 1,
  },
  whatsappTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  whatsappSub: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.modal,
  },
  bottomFeeLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  bottomFeeVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    ...SHADOWS.card,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
