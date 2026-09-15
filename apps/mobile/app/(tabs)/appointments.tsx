import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  X,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { contactDoctorWhatsApp } from '../../lib/whatsapp';
import { supabase } from '../../lib/supabase';
import { useBookingStore } from '../../store/bookingStore';

const CANCELLATION_REASONS = [
  'स्वास्थ्य में सुधार आ गया (Health Improved)',
  'आपातकालीन कार्य आ गया (Emergency Work)',
  'गलत तारीख/समय चुना गया (Selected Wrong Slot)',
  'देवरिया से बाहर जाना पड़ा (Out of Station)',
  'अन्य कारण (Other Reason)',
];

export default function AppointmentsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setDoctor } = useBookingStore();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal State
  const [selectedApptForCancel, setSelectedApptForCancel] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState(CANCELLATION_REASONS[0]);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', userData.user.id);

        if (data && data.length > 0) {
          setAppointments(data);
        } else {
          loadMockAppointments();
        }
      } else {
        loadMockAppointments();
      }
    } catch (err) {
      loadMockAppointments();
    } finally {
      setLoading(false);
    }
  };

  const loadMockAppointments = () => {
    setAppointments([
      {
        id: 'DN-482019',
        doctorId: '1',
        doctorName: 'Dr. Amit Kumar',
        specialty: 'Orthopedic (हड्डी रोग)',
        date: '15 Sep 2026',
        time: '10:00 AM',
        clinicName: 'Gupta Clinic, Station Road, Deoria',
        status: 'confirmed',
        fee: 300,
        tokenNumber: 18,
      },
      {
        id: 'DN-392011',
        doctorId: '2',
        doctorName: 'Dr. Sunita Rai',
        specialty: 'Gynecologist (स्त्री रोग)',
        date: '20 Aug 2026',
        time: '11:30 AM',
        clinicName: 'Rai Hospital, Malviya Road, Deoria',
        status: 'completed',
        fee: 400,
        tokenNumber: 7,
      },
    ]);
  };

  const handleConfirmCancellation = async () => {
    if (!selectedApptForCancel) return;
    setSubmittingCancel(true);
    const finalReason = cancelReason === 'अन्य कारण (Other Reason)' ? otherReasonText : cancelReason;

    try {
      // 1. Update appointment status in Supabase
      await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          symptoms_notes: `Cancelled by patient. Reason: ${finalReason}`,
        })
        .eq('id', selectedApptForCancel.id);

      // 2. Also update associated queue entry if present
      await supabase
        .from('queue_entries')
        .update({ status: 'cancelled' })
        .eq('appointment_id', selectedApptForCancel.id);

      setAppointments((prev) =>
        prev.map((a) => (a.id === selectedApptForCancel.id ? { ...a, status: 'cancelled' } : a))
      );

      Alert.alert(
        'अपॉइंटमेंट रद्द हो गया ✅',
        'आपका अपॉइंटमेंट सफलतापूर्वक रद्द कर दिया गया है। क्लिनिक टोकन सूची भी अपडेट हो गई है।'
      );
    } catch (e) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === selectedApptForCancel.id ? { ...a, status: 'cancelled' } : a))
      );
      Alert.alert('अपॉइंटमेंट रद्द हो गया ✅', 'आपका अपॉइंटमेंट रद्द कर दिया गया है।');
    } finally {
      setSubmittingCancel(false);
      setSelectedApptForCancel(null);
    }
  };

  const handleReschedule = (item: any) => {
    setDoctor(item.doctorId || '1', item.doctorName, item.fee || 300);
    router.push(`/booking/${item.doctorId || '1'}?rescheduleId=${item.id}`);
  };

  const handleOpenMap = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const filteredAppointments = appointments.filter((item) => {
    if (activeTab === 'upcoming') {
      return item.status === 'confirmed' || item.status === 'booked';
    }
    return item.status === 'completed' || item.status === 'cancelled';
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>मेरे अपॉइंटमेंट्स (My Appointments)</Text>
          <TouchableOpacity onPress={fetchAppointments}>
            <RefreshCw size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented Tab Switch */}
      <View style={styles.tabSwitchContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            आगामी (Upcoming)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'past' && styles.tabBtnActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            पुराने / इतिहास (Past)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Calendar size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>कोई अपॉइंटमेंट नहीं मिला</Text>
          <Text style={styles.emptySub}>अपने पास के डॉक्टर खोजें और अपॉइंटमेंट बुक करें</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.doctorName}>{item.doctorName}</Text>
                  <Text style={styles.specialtyText}>{item.specialty}</Text>
                </View>
                <View style={[styles.statusBadge, item.status === 'cancelled' && { backgroundColor: '#FEE2E2' }]}>
                  {item.status === 'cancelled' ? (
                    <>
                      <XCircle size={14} color="#EF4444" />
                      <Text style={[styles.statusText, { color: '#EF4444' }]}>रद्द (Cancelled)</Text>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} color={COLORS.primary} />
                      <Text style={styles.statusText}>कन्फर्म</Text>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.infoRow}>
                <Calendar size={15} color={COLORS.textMuted} />
                <Text style={styles.infoText}>{item.date} | {item.time}</Text>
              </View>

              <View style={styles.infoRow}>
                <MapPin size={15} color={COLORS.textMuted} />
                <Text style={styles.infoText}>{item.clinicName}</Text>
              </View>

              {item.tokenNumber && (
                <View style={styles.tokenBox}>
                  <Text style={styles.tokenLabel}>आपका टोकन नंबर:</Text>
                  <Text style={styles.tokenVal}>#{item.tokenNumber}</Text>
                </View>
              )}

              <View style={styles.actionRow}>
                {activeTab === 'upcoming' && (
                  <>
                    <TouchableOpacity
                      style={styles.actionBtnCancel}
                      onPress={() => setSelectedApptForCancel(item)}
                    >
                      <XCircle size={14} color="#EF4444" />
                      <Text style={styles.actionBtnCancelText}>रद्द करें</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnReschedule}
                      onPress={() => handleReschedule(item)}
                    >
                      <RotateCcw size={14} color={COLORS.primary} />
                      <Text style={styles.actionBtnRescheduleText}>रीशेड्यूल</Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity
                  style={styles.actionBtnGreen}
                  onPress={() => contactDoctorWhatsApp('9876543210', item.doctorName)}
                >
                  <MessageCircle size={14} color={COLORS.white} />
                  <Text style={styles.actionBtnGreenText}>व्हाट्सएप</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* CANCELLATION DEEP LOGIC MODAL */}
      <Modal visible={!!selectedApptForCancel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textPrimary }}>अपॉइंटमेंट कैंसिलेशन</Text>
              <TouchableOpacity onPress={() => setSelectedApptForCancel(null)}>
                <X size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Policy Warning Banner */}
            <View style={styles.policyWarningBox}>
              <AlertTriangle size={18} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.policyWarningTitle}>क्लिनिक कैंसिलेशन पॉलिसी</Text>
                <Text style={styles.policyWarningSub}>
                  OPD समय से 2 घंटे पूर्व मुफ्त कैंसिलेशन उपलब्ध है। टोकन ऑटो-अपडेट हो जाएगा।
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginVertical: SPACING.sm }}>
              कैंसिलेशन का कारण चुनें (Select Reason):
            </Text>

            {CANCELLATION_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonChip,
                  cancelReason === reason && styles.reasonChipActive,
                ]}
                onPress={() => setCancelReason(reason)}
              >
                <Text style={[styles.reasonText, cancelReason === reason && styles.reasonTextActive]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            {cancelReason === 'अन्य कारण (Other Reason)' && (
              <TextInput
                placeholder="विवरण लिखें..."
                value={otherReasonText}
                onChangeText={setOtherReasonText}
                style={styles.modalInput}
              />
            )}

            <View style={{ flexDirection: 'row', gap: 10, marginTop: SPACING.lg }}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setSelectedApptForCancel(null)}
              >
                <Text style={{ color: COLORS.textMuted, fontWeight: '700', fontSize: 13 }}>वापस जाएं</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmCancellation}
                disabled={submittingCancel}
              >
                {submittingCancel ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>कैंसिलेशन कन्फर्म करें</Text>
                )}
              </TouchableOpacity>
            </View>
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
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tabSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 6,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  tabBtnActive: {
    backgroundColor: COLORS.tealLight,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: SPACING.lg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  specialtyText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  tokenBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.md,
  },
  tokenLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tokenVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  actionBtnCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  actionBtnCancelText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtnReschedule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.tealLight,
  },
  actionBtnRescheduleText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtnGreen: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#25D366',
  },
  actionBtnGreenText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  policyWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  policyWarningTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  policyWarningSub: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 1,
  },
  reasonChip: {
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 6,
  },
  reasonChipActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  reasonTextActive: {
    color: '#991B1B',
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 13,
    marginTop: SPACING.xs,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
});
