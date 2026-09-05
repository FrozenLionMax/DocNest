import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { contactDoctorWhatsApp } from '../../lib/whatsapp';
import { supabase } from '../../lib/supabase';

export default function AppointmentsScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        doctorName: 'Dr. Amit Kumar',
        specialty: 'Orthopedic (हड्डी रोग)',
        date: '15 Sep 2026',
        time: '10:00 AM',
        clinicName: 'Gupta Clinic, Station Road, Deoria',
        status: 'confirmed',
        fee: 300,
        tokenNumber: 18,
      },
    ]);
  };

  const handleOpenMap = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>मेरे अपॉइंटमेंट्स (My Appointments)</Text>
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
            पुराने (Past)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Calendar size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>कोई अपॉइंटमेंट नहीं मिला</Text>
          <Text style={styles.emptySub}>अपने पास के डॉक्टर खोजें और अपॉइंटमेंट बुक करें</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.doctorName}>{item.doctorName}</Text>
                  <Text style={styles.specialtyText}>{item.specialty}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <CheckCircle size={14} color={COLORS.primary} />
                  <Text style={styles.statusText}>कन्फर्म</Text>
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
                <TouchableOpacity
                  style={styles.actionBtnOutline}
                  onPress={() => handleOpenMap(item.clinicName)}
                >
                  <MapPin size={15} color={COLORS.primary} />
                  <Text style={styles.actionBtnOutlineText}>दिशा देखें</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtnGreen}
                  onPress={() => contactDoctorWhatsApp('9876543210', item.doctorName)}
                >
                  <MessageCircle size={15} color={COLORS.white} />
                  <Text style={styles.actionBtnGreenText}>व्हाट्सएप</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  actionBtnOutlineText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnGreen: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#25D366',
  },
  actionBtnGreenText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
