import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, CreditCard, Banknote } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useBookingStore } from '../../store/bookingStore';
import { shareBookingOnWhatsApp } from '../../lib/whatsapp';
import { supabase } from '../../lib/supabase';

export default function BookingConfirmScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { doctorName, fee, selectedDate, selectedSlot, resetBooking } = useBookingStore();

  const [paymentMethod, setPaymentMethod] = useState<'pay_at_clinic' | 'online'>('pay_at_clinic');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const generatedId = `DN-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingId(generatedId);

      // Store booking in Supabase DB
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase.from('appointments').insert({
          id: generatedId,
          patient_id: userData.user.id,
          appointment_date: selectedDate || new Date().toISOString().split('T')[0],
          appointment_time: selectedSlot || '10:00 AM',
          type: 'clinic',
          status: 'confirmed',
          fee_amount: fee || 300,
          payment_status: paymentMethod === 'pay_at_clinic' ? 'pay_at_clinic' : 'paid',
        });
      }

      setConfirmed(true);
    } catch (err) {
      console.warn('Booking error:', err);
      setConfirmed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    shareBookingOnWhatsApp({
      doctorName: doctorName || 'Dr. Amit Kumar',
      date: selectedDate || '15 Sep 2026',
      time: selectedSlot || '10:00 AM',
      clinicName: 'Gupta Clinic',
      clinicAddress: 'Station Road, Deoria',
      bookingId: bookingId || 'DN-482019',
    });
  };

  const handleDone = () => {
    resetBooking();
    router.replace('/(tabs)/appointments');
  };

  if (confirmed) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successIconBadge}>
            <CheckCircle2 size={64} color={COLORS.primary} />
          </View>

          <Text style={styles.successTitle}>अपॉइंटमेंट सफलतापूर्वक बुक हो गया!</Text>
          <Text style={styles.successSub}>
            बुकिंग ID: <Text style={{ fontWeight: '700', color: COLORS.primary }}>#{bookingId || 'DN-482019'}</Text>
          </Text>

          <View style={styles.successDetailsBox}>
            <Text style={styles.successDocName}>{doctorName || 'Dr. Amit Kumar'}</Text>
            <Text style={styles.successDetailText}>📅 {selectedDate || '15 Sep 2026'} | {selectedSlot || '10:00 AM'}</Text>
            <Text style={styles.successDetailText}>📍 Gupta Clinic, Station Road, Deoria</Text>
            <Text style={styles.successDetailText}>💵 भुगतान प्रकार: {paymentMethod === 'pay_at_clinic' ? 'क्लिनिक पर नकद' : 'ऑनलाइन भुक्तान'}</Text>
          </View>

          <TouchableOpacity style={styles.whatsappShareBtn} onPress={handleShareWhatsApp}>
            <Text style={styles.whatsappShareText}>💬 व्हाट्सएप पर रसीद पाएं / शेयर करें</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneBtnText}>मेरे अपॉइंटमेंट्स देखें</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>बुकिंग पुष्टि (Confirmation)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Booking Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>📋 अपॉइंटमेंट विवरण (Summary)</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>डॉक्टर:</Text>
            <Text style={styles.detailVal}>{doctorName || 'Dr. Amit Kumar'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>दिनांक (Date):</Text>
            <Text style={styles.detailVal}>{selectedDate || '15 Sep 2026'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>समय (Time):</Text>
            <Text style={styles.detailVal}>{selectedSlot || '10:00 AM'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>स्थान (Clinic):</Text>
            <Text style={styles.detailVal}>Gupta Clinic, Station Road, Deoria</Text>
          </View>
        </View>

        {/* Payment Method Selector */}
        <Text style={styles.sectionHeading}>💳 भुगतान का तरीका चुनें (Payment Method)</Text>
        <View style={styles.paymentOptions}>
          {/* Pay at Clinic */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              paymentMethod === 'pay_at_clinic' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('pay_at_clinic')}
          >
            <Banknote size={24} color={paymentMethod === 'pay_at_clinic' ? COLORS.primary : COLORS.textMuted} />
            <View style={styles.paymentTextCol}>
              <Text style={[styles.paymentTitle, paymentMethod === 'pay_at_clinic' && styles.paymentTitleActive]}>
                क्लिनिक पर भुगतान करें (Pay at Clinic)
              </Text>
              <Text style={styles.paymentSub}>नकद (Cash) या यूपीआई क्लिनिक काउंटर पर दें</Text>
            </View>
          </TouchableOpacity>

          {/* Razorpay Online */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              paymentMethod === 'online' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('online')}
          >
            <CreditCard size={24} color={paymentMethod === 'online' ? COLORS.primary : COLORS.textMuted} />
            <View style={styles.paymentTextCol}>
              <Text style={[styles.paymentTitle, paymentMethod === 'online' && styles.paymentTitleActive]}>
                ऑनलाइन भुगतान (UPI / GPay / PhonePe / Card)
              </Text>
              <Text style={styles.paymentSub}>सुरक्षित ऑनलाइन पेमेंट द्वारा तुरंत कन्फर्म करें</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>💰 शुल्क विवरण (Bill Breakdown)</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>डॉक्टर परामर्श फीस:</Text>
            <Text style={styles.detailVal}>₹{fee || 300}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>प्लेटफॉर्म शुल्क (Platform Fee):</Text>
            <Text style={[styles.detailVal, { color: COLORS.primary, fontWeight: '700' }]}>₹0 (मुफ्त / FREE)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary }]}>कुल देय राशि (Total):</Text>
            <Text style={[styles.detailVal, { fontSize: 20, fontWeight: '800', color: COLORS.primary }]}>₹{fee || 300}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>कुल राशि (Total Payable)</Text>
          <Text style={styles.bottomVal}>₹{fee || 300}</Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.confirmBtnText}>अपॉइंटमेंट कन्फर्म करें</Text>
          )}
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  detailVal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  paymentOptions: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.tealLight,
  },
  paymentTextCol: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  paymentTitleActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  paymentSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
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
  bottomLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  bottomVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    ...SHADOWS.card,
  },
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  successCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    ...SHADOWS.modal,
  },
  successIconBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  successSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  successDetailsBox: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
    marginBottom: SPACING.lg,
    gap: 4,
  },
  successDocName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  successDetailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  whatsappShareBtn: {
    backgroundColor: '#25D366',
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  whatsappShareText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  doneBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
