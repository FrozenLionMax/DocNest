import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { User, Calendar, MapPin, Check, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { session, fetchProfile } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('Deoria Sadar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setError(t('auth.name_required', 'कृपया अपना पूरा नाम दर्ज करें'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = session?.user;
      if (!user) {
        // Demo mode fallback
        router.replace('/(tabs)');
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          phone: user.phone || null,
          gender: gender,
          date_of_birth: dob || null,
          address: address.trim(),
          city: 'Deoria',
          language_pref: i18n.language || 'hi',
          role: 'patient',
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      await fetchProfile();
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || t('auth.profile_save_failed', 'प्रोफ़ाइल सहेजने में विफल'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('auth.complete_profile', 'अपनी प्रोफ़ाइल पूरी करें')}
        </Text>
        <Text style={styles.subtitle}>
          डॉक्टर अपॉइंटमेंट और पर्चे के लिए अपनी जानकारी दर्ज करें
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        {/* Full Name */}
        <Text style={styles.label}>
          {t('auth.full_name', 'पूरा नाम')} *
        </Text>
        <View style={styles.inputBox}>
          <User size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="उदा. राहुल शर्मा"
            placeholderTextColor={COLORS.textMuted}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Gender Selection */}
        <Text style={styles.label}>
          {t('auth.gender', 'लिंग')}
        </Text>
        <View style={styles.genderRow}>
          {[
            { id: 'male', label: 'पुरुष (Male)' },
            { id: 'female', label: 'महिला (Female)' },
            { id: 'other', label: 'अन्य (Other)' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.genderChip,
                gender === item.id && styles.genderChipActive,
              ]}
              onPress={() => setGender(item.id as any)}
            >
              <Text
                style={[
                  styles.genderChipText,
                  gender === item.id && styles.genderChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date of Birth */}
        <Text style={styles.label}>
          {t('auth.dob', 'जन्म तिथि (DD/MM/YYYY)')}
        </Text>
        <View style={styles.inputBox}>
          <Calendar size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="15/08/1995"
            placeholderTextColor={COLORS.textMuted}
            value={dob}
            onChangeText={setDob}
          />
        </View>

        {/* Address in Deoria */}
        <Text style={styles.label}>
          {t('auth.area', 'देवरिया में आपका क्षेत्र/ब्लॉक')}
        </Text>
        <View style={styles.inputBox}>
          <MapPin size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="उदा. देवरिया सदर, भाटपार रानी, रुद्रपुर"
            placeholderTextColor={COLORS.textMuted}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSaveProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.saveBtnText}>
                {t('auth.start_app', 'ऐप शुरू करें')}
              </Text>
              <ArrowRight size={20} color={COLORS.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.modal,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: SPACING.md,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    backgroundColor: COLORS.backgroundSecondary,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  genderRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  genderChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.tealLight,
  },
  genderChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  genderChipTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: SPACING.md,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xl,
    ...SHADOWS.card,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
