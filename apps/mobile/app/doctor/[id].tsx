import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Modal,
  TextInput,
  Alert,
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
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { contactDoctorWhatsApp } from '../../lib/whatsapp';
import { supabase } from '../../lib/supabase';
import { useBookingStore } from '../../store/bookingStore';

interface ReviewItem {
  id: string;
  patient_name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function DoctorDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { setDoctor } = useBookingStore();

  const [doctor, setDoctorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewItem[]>([
    { id: 'rev-1', patient_name: 'Rahul Sharma', rating: 5, comment: 'डॉक्टर साहब का व्यवहार बहुत अच्छा है। जोड़ दर्द में तुरंत आराम मिला।', date: '01 Sep 2026' },
    { id: 'rev-2', patient_name: 'Priya Singh', rating: 5, comment: 'Very professional clinic and live queue system saved our time!', date: '25 Aug 2026' },
  ]);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchDoctorDetails();
    fetchReviews();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      if (!id) return;
      const { data } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id as string)
        .single();

      if (data) {
        setDoctorData(data);
      } else {
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

  const fetchReviews = async () => {
    try {
      if (!id) return;
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('doctor_id', id as string)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setReviews(
          data.map((r: any) => ({
            id: r.id,
            patient_name: r.patient_name || 'Anonymous Patient',
            rating: r.rating || 5,
            comment: r.comment || '',
            date: new Date(r.created_at).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          }))
        );
      }
    } catch (e) {
      console.log('Reviews loaded fallback');
    }
  };

  const handleAddReview = async () => {
    if (!reviewName || !reviewComment) {
      Alert.alert('अधूरी जानकारी', 'कृपया नाम और अनुभव विवरण लिखें');
      return;
    }
    setSubmittingReview(true);
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      patient_name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: 'Just now',
    };

    setReviews((prev) => [newRev, ...prev]);
    setShowReviewModal(false);

    try {
      await supabase.from('reviews').insert([
        {
          doctor_id: id || '1',
          patient_name: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        },
      ]);
    } catch (e) {
      console.log('Saved review locally');
    } finally {
      setSubmittingReview(false);
      setReviewName('');
      setReviewComment('');
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
              <Text style={styles.statLabel}>{reviews.length}+ रेटिंग</Text>
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

        {/* REVIEWS SECTION */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
            <Text style={styles.sectionHeading}>⭐ मरीज रेटिंग एवं फीडबैक ({reviews.length})</Text>
            <TouchableOpacity style={styles.addReviewBtn} onPress={() => setShowReviewModal(true)}>
              <Plus size={14} color={COLORS.white} />
              <Text style={styles.addReviewBtnText}>रिव्यू दें</Text>
            </TouchableOpacity>
          </View>

          {reviews.map((rev) => (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={styles.reviewPatientName}>{rev.patient_name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textPrimary }}>{rev.rating}.0</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{rev.comment}</Text>
              <Text style={styles.reviewDate}>{rev.date}</Text>
            </View>
          ))}
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

      {/* WRITE REVIEW MODAL */}
      <Modal visible={showReviewModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textPrimary }}>डॉक्टर को रिव्यू दें</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <X size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="आपका नाम (Your Name)"
              value={reviewName}
              onChangeText={setReviewName}
              style={styles.modalInput}
            />

            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6 }}>स्टार रेटिंग (Rating):</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: SPACING.md }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                  <Star size={28} color={star <= reviewRating ? '#FFD700' : '#D1D5DB'} fill={star <= reviewRating ? '#FFD700' : 'transparent'} />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="अपना अनुभव लिखें (उदा. इलाज से बहुत संतुष्ट हैं)..."
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              numberOfLines={3}
              style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]}
            />

            <TouchableOpacity style={styles.submitReviewBtn} onPress={handleAddReview} disabled={submittingReview}>
              <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 14 }}>रिव्यू सबमिट करें (Submit)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
    marginTop: 4,
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
    marginTop: 4,
  },
  addReviewBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addReviewBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  reviewCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
  },
  reviewPatientName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewComment: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  modalInput: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  submitReviewBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
});
