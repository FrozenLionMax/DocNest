import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck, HeartHandshake, Stethoscope } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: <Stethoscope size={64} color={COLORS.primary} />,
      title: t('onboarding.title_1', 'अपने पास के डॉक्टर खोजें'),
      desc: t('onboarding.desc_1', 'देवरिया के बेहतरीन डॉक्टर, अस्पताल और क्लिनिक की पूरी जानकारी एक जगह।'),
    },
    {
      icon: <ShieldCheck size={64} color={COLORS.secondary} />,
      title: t('onboarding.title_2', 'लाइव क्लिनिक नंबर (Queue Tracker)'),
      desc: t('onboarding.desc_2', 'घर बैठे क्लिनिक का चालू टोकन नंबर देखें और बिना भीड़ में फंसे सही समय पर पहुंचें।'),
    },
    {
      icon: <HeartHandshake size={64} color={COLORS.primary} />,
      title: t('onboarding.title_3', 'Medicave से दवाई मंगाएं'),
      desc: t('onboarding.desc_3', 'व्हाट्सएप से पर्चा भेजें और रियायती दरों पर ओरिजिनल दवाइयां पाएं।'),
    },
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>DocNest</Text>
        <Text style={styles.brandSubtitle}>देवरिया का अपना हेल्थ ऐप</Text>
      </View>

      {/* Slide Illustration Container */}
      <View style={styles.slideContainer}>
        <View style={styles.iconCircle}>
          {slides[activeSlide].icon}
        </View>

        <Text style={styles.slideTitle}>{slides[activeSlide].title}</Text>
        <Text style={styles.slideDesc}>{slides[activeSlide].desc}</Text>

        {/* Dots Indicator */}
        <View style={styles.dotsRow}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeSlide === index && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {activeSlide === slides.length - 1
              ? t('common.get_started', 'शुरू करें')
              : t('common.next', 'आगे बढ़ें')}
          </Text>
          <ArrowRight size={20} color={COLORS.white} />
        </TouchableOpacity>

        {activeSlide < slides.length - 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.skipText}>
              {t('common.skip', 'स्किप करें')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl + 20,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 15,
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: 4,
  },
  slideContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  slideDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  footer: {
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    ...SHADOWS.card,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
