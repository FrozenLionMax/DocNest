import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Star, ShieldCheck, MapPin } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { SPECIALTIES } from '../../../../packages/shared/constants/specialties';
import { supabase } from '../../lib/supabase';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    (params.specialty as string) || null
  );
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchDoctors();
  }, [query, selectedSpecialty]);

  const searchDoctors = async () => {
    setLoading(true);
    try {
      let req = supabase.from('doctors').select('*').eq('is_active', true);

      if (query.trim()) {
        req = req.or(`full_name.ilike.%${query}%,specialization.ilike.%${query}%,clinic_name.ilike.%${query}%`);
      }

      if (selectedSpecialty) {
        req = req.eq('specialty_id', selectedSpecialty);
      }

      const { data } = await req;
      if (data && data.length > 0) {
        setDoctors(data);
      } else {
        // Mock search results for Deoria
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
          {
            id: '3',
            full_name: 'Dr. Rajesh Verma',
            specialization: 'General Physician',
            qualification: 'MBBS, MD (Medicine)',
            experience_years: 18,
            consultation_fee: 250,
            clinic_name: 'Verma Clinic, Civil Lines, Deoria',
            avg_rating: 4.7,
            total_reviews: 95,
            is_verified: true,
          },
        ]);
      }
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchInputBox}>
          <Search size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder={t('search.input_placeholder', 'डॉक्टर, क्लिनिक का नाम लिखें...')}
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>

      {/* Specialties Horizontal Chips */}
      <View style={styles.chipRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={[
              styles.chip,
              selectedSpecialty === null && styles.chipActive,
            ]}
            onPress={() => setSelectedSpecialty(null)}
          >
            <Text
              style={[
                styles.chipText,
                selectedSpecialty === null && styles.chipTextActive,
              ]}
            >
              सभी (All)
            </Text>
          </TouchableOpacity>

          {SPECIALTIES.map((spec: any) => (
            <TouchableOpacity
              key={spec.id}
              style={[
                styles.chip,
                selectedSpecialty === spec.id && styles.chipActive,
              ]}
              onPress={() =>
                setSelectedSpecialty(
                  selectedSpecialty === spec.id ? null : spec.id
                )
              }
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSpecialty === spec.id && styles.chipTextActive,
                ]}
              >
                {spec.name_hi}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Results List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.full_name[4] || 'D'}</Text>
              </View>

              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <Text style={styles.name}>{item.full_name}</Text>
                  {item.is_verified && (
                    <ShieldCheck size={16} color={COLORS.primary} />
                  )}
                </View>
                <Text style={styles.spec}>{item.specialization}</Text>
                <Text style={styles.clinic} numberOfLines={1}>
                  📍 {item.clinic_name}
                </Text>

                <View style={styles.meta}>
                  <View style={styles.rating}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingVal}>{item.avg_rating}</Text>
                    <Text style={styles.reviewsCount}>({item.total_reviews})</Text>
                  </View>
                  <Text style={styles.fee}>₹{item.consultation_fee}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>बुकिंग</Text>
              </TouchableOpacity>
            </TouchableOpacity>
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  searchInputBox: {
    backgroundColor: COLORS.white,
    height: 48,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  chipRow: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.tealLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  spec: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  clinic: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewsCount: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  fee: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  bookBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
