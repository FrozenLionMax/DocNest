import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { User, Users, FileText, Globe, Phone, LogOut, ChevronRight, MapPin } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { openMedicaveOrder } from '../../lib/whatsapp';

export default function ProfileTabScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { profile, logout } = useAuthStore();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>मेरी प्रोफ़ाइल (My Profile)</Text>
      </View>

      {/* User Info Hero Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.full_name ? profile.full_name[0] : 'R'}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{profile?.full_name || 'Rahul Sharma'}</Text>
          <Text style={styles.userPhone}>+91 {profile?.phone || '9876543210'}</Text>
          <View style={styles.locationBadge}>
            <MapPin size={12} color={COLORS.primary} />
            <Text style={styles.locationText}>{profile?.address || 'Deoria Sadar, UP'}</Text>
          </View>
        </View>
      </View>

      {/* Options Menu List */}
      <View style={styles.menuContainer}>
        {/* Family Members */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/family')}>
          <View style={styles.menuIconBg}>
            <Users size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>परिवार के सदस्य (Family Members)</Text>
            <Text style={styles.menuSub}>घर के सदस्यों के नाम जोड़ें</Text>
          </View>
          <ChevronRight size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Health Records */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/records')}>
          <View style={styles.menuIconBg}>
            <FileText size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>स्वास्थ्य रिकॉर्ड (Prescriptions & Reports)</Text>
            <Text style={styles.menuSub}>पर्चे और लैब रिपोर्ट सहेजें</Text>
          </View>
          <ChevronRight size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Language Switcher */}
        <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
          <View style={styles.menuIconBg}>
            <Globe size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>ऐप की भाषा (App Language)</Text>
            <Text style={styles.menuSub}>वर्तमान: {i18n.language === 'hi' ? 'हिंदी' : 'English'}</Text>
          </View>
          <Text style={styles.langBadge}>{i18n.language === 'hi' ? 'English' : 'हिंदी'}</Text>
        </TouchableOpacity>

        {/* Medicave Support */}
        <TouchableOpacity style={styles.menuItem} onPress={() => openMedicaveOrder()}>
          <View style={[styles.menuIconBg, { backgroundColor: '#FFF0EB' }]}>
            <Phone size={20} color={COLORS.secondary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Medicave हेल्पलाइन</Text>
            <Text style={styles.menuSub}>दवाइयों की जानकारी एवं ऑर्डर</Text>
          </View>
          <ChevronRight size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <View style={[styles.menuIconBg, { backgroundColor: '#FEE2E2' }]}>
            <LogOut size={20} color={COLORS.error} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={[styles.menuTitle, { color: COLORS.error }]}>लॉगआउट (Logout)</Text>
            <Text style={styles.menuSub}>ऐप से बाहर निकलें</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* App Version Info */}
      <View style={styles.footerInfo}>
        <Text style={styles.appVersionText}>DocNest v1.0.0 (Deoria Edition)</Text>
        <Text style={styles.poweredByText}>Powered by Medicave Healthcare</Text>
      </View>
    </ScrollView>
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
  userCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userPhone: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xs,
    ...SHADOWS.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  menuSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  langBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  footerInfo: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  appVersionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  poweredByText: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: '700',
    marginTop: 2,
  },
});
