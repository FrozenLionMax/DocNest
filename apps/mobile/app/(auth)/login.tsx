import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Phone, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { setSession, fetchProfile } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpInputs = useRef<Array<TextInput | null>>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = async () => {
    setError('');
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError(t('auth.invalid_phone', 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें'));
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91${cleanPhone}`;
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
      });

      if (supabaseError) {
        // Fallback for development/testing if SMS gateway is not configured yet
        console.warn('Supabase OTP notice:', supabaseError.message);
      }

      setStep('otp');
      setCountdown(30);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || t('auth.otp_failed', 'ओटीपी भेजने में असमर्थ'));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next input box
    if (text.length === 1 && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError(t('auth.invalid_otp', 'कृपया 6 अंकों का सही OTP दर्ज करें'));
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91${phone.trim()}`;
      
      // Verification call to Supabase
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otpString,
        type: 'sms',
      });

      if (verifyError) {
        // Dev fallback mode for testing
        if (otpString === '123456') {
          router.replace('/(auth)/profile-setup');
          return;
        }
        throw verifyError;
      }

      if (data.session) {
        setSession(data.session);
        await fetchProfile();
        router.replace('/(auth)/profile-setup');
      }
    } catch (err: any) {
      setError(err.message || t('auth.verify_failed', 'गलत OTP, पुनः प्रयास करें (Demo: 123456)'));
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Bar with Language Toggle */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.langBadge} onPress={toggleLanguage}>
            <Text style={styles.langText}>
              {i18n.language === 'hi' ? 'English' : 'हिंदी'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🩺</Text>
          </View>
          <Text style={styles.brandTitle}>DocNest</Text>
          <Text style={styles.brandSubtitle}>
            {t('app.tagline', 'देवरिया का अपना हेल्थ ऐप')}
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.card}>
          {step === 'phone' ? (
            <>
              <Text style={styles.cardTitle}>
                {t('auth.login_title', 'लॉगिन या रजिस्ट्रेशन')}
              </Text>
              <Text style={styles.cardSubtitle}>
                {t('auth.login_subtitle', 'जारी रखने के लिए अपना मोबाइल नंबर दर्ज करें')}
              </Text>

              {/* Phone Input Box */}
              <View style={styles.inputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.flag}>🇮🇳</Text>
                  <Text style={styles.codeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="98765 43210"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  editable={!loading}
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {t('auth.send_otp', 'OTP प्राप्त करें')}
                    </Text>
                    <ArrowRight size={20} color={COLORS.white} />
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>
                {t('auth.enter_otp', 'OTP सत्यापन')}
              </Text>
              <Text style={styles.cardSubtitle}>
                +91 {phone} पर 6 अंकों का कोड भेजा गया है
              </Text>

              {/* OTP Inputs Grid */}
              <View style={styles.otpGrid}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { otpInputs.current[index] = ref; }}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {t('auth.verify_continue', 'सत्यापित करें & आगे बढ़ें')}
                    </Text>
                    <ShieldCheck size={20} color={COLORS.white} />
                  </>
                )}
              </TouchableOpacity>

              {/* Resend & Change Phone Row */}
              <View style={styles.otpFooter}>
                {canResend ? (
                  <TouchableOpacity
                    onPress={handleSendOtp}
                    style={styles.resendBtn}
                  >
                    <RefreshCw size={14} color={COLORS.primary} />
                    <Text style={styles.resendText}>पुनः OTP भेजें</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.timerText}>
                    पुनः OTP भेजें ({countdown}s)
                  </Text>
                )}

                <TouchableOpacity onPress={() => setStep('phone')}>
                  <Text style={styles.changePhoneText}>नंबर बदलें</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Medicave Branding Footer */}
        <View style={styles.footer}>
          <Text style={styles.medicaveTag}>
            🏥 Powered by <Text style={styles.medicaveHighlight}>Medicave</Text> Deoria
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    justifyContent: 'center',
  },
  topBar: {
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  langBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.tealLight,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  langText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  logoIcon: {
    fontSize: 36,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.modal,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 54,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.md,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    marginRight: SPACING.md,
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
    ...SHADOWS.card,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: SPACING.md,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  otpBox: {
    width: 45,
    height: 52,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.backgroundSecondary,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.tealLight,
  },
  otpFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  timerText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  changePhoneText: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 13,
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  medicaveTag: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  medicaveHighlight: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
});
