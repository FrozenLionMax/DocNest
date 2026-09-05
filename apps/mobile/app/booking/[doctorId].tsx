import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Check } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useBookingStore } from '../../store/bookingStore';

export default function SlotPickerScreen() {
  const router = useRouter();
  const { doctorId } = useLocalSearchParams();
  const { t } = useTranslation();
  const { doctorName, fee, setDate, setSlot, setFamilyMember } = useBookingStore();

  // Generate next 7 days dates
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      fullDate: d.toISOString().split('T')[0], // YYYY-MM-DD
      dayName: i === 0 ? 'आज (Today)' : i === 1 ? 'कल (Tomorrow)' : d.toLocaleDateString('hi-IN', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('hi-IN', { month: 'short' }),
    };
  });

  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>('10:00 AM');
  const [patientType, setPatientType] = useState<'self' | 'family'>('self');

  const morningSlots = ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'];

  const handleContinue = () => {
    if (!selectedSlotTime) return;
    setDate(selectedDate);
    setSlot(selectedSlotTime);
    setFamilyMember(patientType === 'self' ? null : 'family_1');
    router.push('/booking/confirm');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>समय का चयन (Select Slot)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Doctor Summary Banner */}
        <View style={styles.doctorBanner}>
          <View>
            <Text style={styles.doctorName}>{doctorName || 'Dr. Amit Kumar'}</Text>
            <Text style={styles.feeText}>परामर्श शुल्क: ₹{fee || 300}</Text>
          </View>
        </View>

        {/* Date Selection Horizontal Scroll */}
        <Text style={styles.sectionHeading}>📅 तारीख का चयन करें (Select Date)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
          {dates.map((item) => (
            <TouchableOpacity
              key={item.fullDate}
              style={[
                styles.dateCard,
                selectedDate === item.fullDate && styles.dateCardActive,
              ]}
              onPress={() => setSelectedDate(item.fullDate)}
            >
              <Text
                style={[
                  styles.dayName,
                  selectedDate === item.fullDate && styles.dayNameActive,
                ]}
              >
                {item.dayName}
              </Text>
              <Text
                style={[
                  styles.dateNum,
                  selectedDate === item.fullDate && styles.dateNumActive,
                ]}
              >
                {item.dateNum}
              </Text>
              <Text
                style={[
                  styles.monthText,
                  selectedDate === item.fullDate && styles.monthTextActive,
                ]}
              >
                {item.month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Patient Selection (Self vs Family Member) */}
        <Text style={styles.sectionHeading}>👤 किसके लिए बुकिंग है? (Book For)</Text>
        <View style={styles.patientRow}>
          <TouchableOpacity
            style={[styles.patientChip, patientType === 'self' && styles.patientChipActive]}
            onPress={() => setPatientType('self')}
          >
            <User size={16} color={patientType === 'self' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.patientChipText, patientType === 'self' && styles.patientChipTextActive]}>
              स्वयं (Self)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.patientChip, patientType === 'family' && styles.patientChipActive]}
            onPress={() => setPatientType('family')}
          >
            <User size={16} color={patientType === 'family' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.patientChipText, patientType === 'family' && styles.patientChipTextActive]}>
              परिवार का सदस्य (Family)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Morning Time Slots Grid */}
        <Text style={styles.sectionHeading}>🌅 सुबह का समय (Morning Slots)</Text>
        <View style={styles.slotsGrid}>
          {morningSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slotPill,
                selectedSlotTime === slot && styles.slotPillActive,
              ]}
              onPress={() => setSelectedSlotTime(slot)}
            >
              <Text
                style={[
                  styles.slotText,
                  selectedSlotTime === slot && styles.slotTextActive,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Evening Time Slots Grid */}
        <Text style={styles.sectionHeading}>🌆 शाम का समय (Evening Slots)</Text>
        <View style={styles.slotsGrid}>
          {afternoonSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slotPill,
                selectedSlotTime === slot && styles.slotPillActive,
              ]}
              onPress={() => setSelectedSlotTime(slot)}
            >
              <Text
                style={[
                  styles.slotText,
                  selectedSlotTime === slot && styles.slotTextActive,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.selectedSlotLabel}>चुना गया समय:</Text>
          <Text style={styles.selectedSlotVal}>{selectedDate} | {selectedSlotTime}</Text>
        </View>

        <TouchableOpacity
          style={[styles.continueBtn, !selectedSlotTime && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!selectedSlotTime}
        >
          <Text style={styles.continueBtnText}>आगे बढ़ें (Confirm)</Text>
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
  doctorBanner: {
    backgroundColor: COLORS.tealLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  feeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  datesRow: {
    gap: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  dateCard: {
    width: 80,
    height: 85,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  dateCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayName: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  dayNameActive: {
    color: COLORS.tealLight,
  },
  dateNum: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  dateNumActive: {
    color: COLORS.white,
  },
  monthText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  monthTextActive: {
    color: COLORS.tealLight,
  },
  patientRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  patientChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  patientChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.tealLight,
  },
  patientChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  patientChipTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  slotPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  slotPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  slotTextActive: {
    color: COLORS.white,
    fontWeight: '700',
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
  selectedSlotLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  selectedSlotVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    ...SHADOWS.card,
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
