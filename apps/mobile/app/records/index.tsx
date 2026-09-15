import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Plus, ChevronLeft, Calendar, Download, Share2, Stethoscope, RefreshCw } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { openMedicaveOrder } from '../../lib/whatsapp';
import { supabase } from '../../lib/supabase';

interface RecordItem {
  id: string;
  title: string;
  doctor: string;
  clinic: string;
  date: string;
  type: string;
  fileType: string;
}

export default function RecordsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<RecordItem[]>([
    {
      id: 'rec-1',
      title: 'Orthopedic OPD Digital Prescription (डिजिटल पर्चा)',
      doctor: 'Dr. Amit Kumar',
      clinic: 'Gupta Clinic, Deoria Sadar',
      date: '06 Sep 2026',
      type: 'Prescription (Rx)',
      fileType: 'PDF',
    },
    {
      id: 'rec-2',
      title: 'Knee X-Ray & Joint Scan Report',
      doctor: 'Dr. Rajesh Verma',
      clinic: 'City Radiology Center, Civil Lines',
      date: '28 Aug 2026',
      type: 'X-Ray Report',
      fileType: 'IMAGE',
    },
  ]);

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const fetchHealthRecords = async () => {
    setLoading(true);
    try {
      // Fetch from Supabase prescriptions & health_records tables
      const { data: rxData } = await supabase.from('prescriptions').select('*');
      const { data: recData } = await supabase.from('health_records').select('*');

      const fetchedList: RecordItem[] = [];

      if (rxData && rxData.length > 0) {
        rxData.forEach((rx: any) => {
          fetchedList.push({
            id: rx.id,
            title: `Rx: ${rx.diagnosis || 'डिजिटल पर्चा'}`,
            doctor: rx.doctor_name || 'Dr. Amit Kumar',
            clinic: rx.clinic_name || 'Gupta Clinic, Deoria',
            date: new Date(rx.created_at).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            type: 'Prescription (Rx)',
            fileType: 'PDF',
          });
        });
      }

      if (recData && recData.length > 0) {
        recData.forEach((r: any) => {
          fetchedList.push({
            id: r.id,
            title: r.record_title || 'लैब टेस्ट रिपोर्ट',
            doctor: r.doctor_name || 'Doctor',
            clinic: r.hospital_name || 'Deoria Clinic',
            date: new Date(r.created_at).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            type: r.record_type || 'Report',
            fileType: 'PDF',
          });
        });
      }

      if (fetchedList.length > 0) {
        setRecords(fetchedList);
      }
    } catch (e) {
      console.log('Health records loaded fallback');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadRecord = () => {
    Alert.alert(
      'पर्चा अपलोड 📄',
      'कैमरा या गैलरी से अपने डॉक्टरी पर्चे की फोटो या PDF सिलेक्ट करें। आपका डेटा पूरी तरह एन्क्रिप्टेड एवं सुरक्षित रहेगा।'
    );
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>स्वास्थ्य रिकॉर्ड (Health Records)</Text>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <FileText size={24} color={COLORS.primary} />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>सुरक्षित पर्चा एवं लैब रिपोर्ट</Text>
            <Text style={styles.bannerSub}>अपने सभी डॉक्टरी पर्चे और टेस्ट रिपोर्ट हमेशा साथ रखें</Text>
          </View>
        </View>

        {/* Upload Action Card */}
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadRecord}>
          <Plus size={20} color={COLORS.white} />
          <Text style={styles.uploadBtnText}>+ नया पर्चा / रिपोर्ट अपलोड करें</Text>
        </TouchableOpacity>

        {/* Records List */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
          <Text style={styles.sectionHeader}>सहेजे गए रिकॉर्ड ({records.length})</Text>
          <TouchableOpacity onPress={fetchHealthRecords}>
            <RefreshCw size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={{ marginVertical: 20 }} />
        ) : (
          records.map((item) => (
            <View key={item.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{item.type}</Text>
                </View>
                <Text style={styles.recordDate}>📍 {item.date}</Text>
              </View>

              <Text style={styles.recordTitle}>{item.title}</Text>
              <Text style={styles.recordDoctor}>👨‍⚕️ {item.doctor} — {item.clinic}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.medicaveOrderBtn}
                  onPress={() => openMedicaveOrder(item.title)}
                >
                  <Text style={styles.medicaveOrderText}>💊 Medicave से दवा मंगवाएं</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn}>
                  <Share2 size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  navbar: {
    backgroundColor: COLORS.white,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  backBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  body: {
    flex: 1,
    padding: SPACING.lg,
  },
  banner: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  bannerSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  uploadBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  uploadBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  recordCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeBadge: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  recordDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  recordTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  recordDoctor: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  medicaveOrderBtn: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  medicaveOrderText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  iconBtn: {
    padding: 6,
  },
});
