import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Info } from 'lucide-react-native';
import { Colors } from '@/constants';
import { authApi } from '@/src/api/auth.api';
import { useAuthStore } from '@/src/store/auth.store';
import axios from 'axios';

const { width } = Dimensions.get('window');
const CODE_LENGTH = 6;

// ─── Inline status banner ────────────────────────────────────────────────────

type BannerType = 'success' | 'error' | 'info';

interface BannerState {
  type: BannerType;
  message: string;
}

function StatusBanner({ banner }: { banner: BannerState | null }) {
  if (!banner) return null;

  const config = {
    success: { bg: '#E6F4F0', border: '#3A6E57', text: '#1E4D3A', Icon: CheckCircle2, iconColor: '#3A6E57' },
    error:   { bg: '#FDECEC', border: '#D43A3A', text: '#7A1A1A', Icon: AlertCircle,  iconColor: '#D43A3A' },
    info:    { bg: '#EFF6FF', border: '#3B82F6', text: '#1E3A5F', Icon: Info,         iconColor: '#3B82F6' },
  }[banner.type];

  return (
    <Animated.View
      entering={FadeInDown.duration(250).springify()}
      style={[styles.banner, { backgroundColor: config.bg, borderColor: config.border }]}
    >
      <config.Icon size={16} color={config.iconColor} style={{ flexShrink: 0 }} />
      <Text style={[styles.bannerText, { color: config.text }]}>{banner.message}</Text>
    </Animated.View>
  );
}

// ─── OTP digit box ───────────────────────────────────────────────────────────

function OtpBox({ digit, focused, hasError }: { digit: string; focused: boolean; hasError: boolean }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (digit) {
      scale.value = withSequence(withSpring(1.12, { damping: 8 }), withSpring(1, { damping: 12 }));
    }
  }, [digit]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const borderColor = hasError
    ? Colors.frozen
    : focused
    ? Colors.primary
    : digit
    ? Colors.primary + '60'
    : Colors.border;

  const bgColor = hasError
    ? '#FFF5F5'
    : focused
    ? '#F0F7F4'
    : digit
    ? '#F8FDFB'
    : '#FAFAFA';

  return (
    <Animated.View
      style={[
        styles.otpBox,
        animStyle,
        { borderColor, backgroundColor: bgColor },
      ]}
    >
      <Text style={[styles.otpDigit, { color: hasError ? Colors.frozen : Colors.text }]}>
        {digit || ''}
      </Text>
      {focused && !digit && <View style={styles.cursor} />}
    </Animated.View>
  );
}

// ─── Countdown timer ─────────────────────────────────────────────────────────

function ResendTimer({ seconds, onResend, isLoading }: { seconds: number; onResend: () => void; isLoading: boolean }) {
  if (seconds > 0) {
    return (
      <Text style={styles.resendTimer}>
        Resend code in <Text style={{ color: Colors.primary, fontFamily: 'PlusJakartaSans_600SemiBold' }}>{seconds}s</Text>
      </Text>
    );
  }
  return (
    <TouchableOpacity style={styles.resendButton} onPress={onResend} disabled={isLoading}>
      <RefreshCw size={14} color={Colors.primary} />
      <Text style={styles.resendText}>Resend code</Text>
    </TouchableOpacity>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

type Step = 'email' | 'otp';

export default function Login() {
  const router = useRouter();
  const { login } = useAuthStore();

  // Step state
  const [step, setStep] = useState<Step>('email');

  // Email step
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailBanner, setEmailBanner] = useState<BannerState | null>(null);

  // OTP step
  const [code, setCode] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpBanner, setOtpBanner] = useState<BannerState | null>(null);
  const [hasError, setHasError] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);

  const hiddenInputRef = useRef<TextInput>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start countdown when OTP step mounts
  useEffect(() => {
    if (step === 'otp') {
      startCountdown();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const startCountdown = () => {
    setResendSeconds(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // ── Email step handlers ──────────────────────────────────────────────────

  const handleRequestOtp = async () => {
    setEmailBanner(null);
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      setEmailBanner({ type: 'error', message: 'Please enter your email address.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailBanner({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setEmailLoading(true);
    try {
      await authApi.requestOtp(trimmed);
      setStep('otp');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const display = Array.isArray(msg) ? msg[0] : (msg ?? 'Something went wrong. Please try again.');
        // 400 means HR admin — give a clear message
        if (err.response?.status === 400) {
          setEmailBanner({ type: 'info', message: display });
        } else {
          setEmailBanner({ type: 'error', message: display });
        }
      } else {
        setEmailBanner({ type: 'error', message: 'Unable to reach the server. Check your connection.' });
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // ── OTP step handlers ────────────────────────────────────────────────────

  const handleCodeChange = (text: string) => {
    // Only digits, max 6
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    setHasError(false);
    setOtpBanner(null);
    setFocusedIndex(Math.min(digits.length, CODE_LENGTH - 1));

    if (digits.length === CODE_LENGTH) {
      hiddenInputRef.current?.blur();
      handleVerifyOtp(digits);
    }
  };

  const handleVerifyOtp = async (finalCode?: string) => {
    const codeToVerify = finalCode ?? code;
    if (codeToVerify.length < CODE_LENGTH) {
      setOtpBanner({ type: 'error', message: 'Please enter the full 6-digit code.' });
      return;
    }

    setOtpLoading(true);
    setOtpBanner(null);
    setHasError(false);

    try {
      const res = await authApi.verifyOtp(email.trim().toLowerCase(), codeToVerify);
      const token = res.data.data.access_token;
      login(token);
      router.replace('/home');
    } catch (err) {
      setHasError(true);
      setCode('');
      setFocusedIndex(0);
      setTimeout(() => hiddenInputRef.current?.focus(), 100);

      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const display = Array.isArray(msg) ? msg[0] : (msg ?? 'Invalid or expired code.');
        setOtpBanner({ type: 'error', message: display });
      } else {
        setOtpBanner({ type: 'error', message: 'Unable to reach the server. Check your connection.' });
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setOtpBanner(null);
    setHasError(false);
    setCode('');
    setFocusedIndex(0);

    try {
      await authApi.requestOtp(email.trim().toLowerCase());
      setOtpBanner({ type: 'success', message: 'A new code has been sent to your email.' });
      startCountdown();
    } catch {
      setOtpBanner({ type: 'error', message: 'Failed to resend. Please try again.' });
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setCode('');
    setFocusedIndex(0);
    setOtpBanner(null);
    setHasError(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </Animated.View>

          {/* ── Email step ── */}
          {step === 'email' && (
            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              exiting={SlideOutLeft.duration(250)}
              style={styles.stepContainer}
            >
              <Text style={styles.title}>Welcome to Sage</Text>
              <Text style={styles.subtitle}>Enter your work email to receive a sign-in code.</Text>

              <StatusBanner banner={emailBanner} />

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Work email</Text>
                <View style={[styles.inputRow, emailBanner?.type === 'error' && styles.inputRowError]}>
                  <Mail size={18} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="you@organisation.gov.ng"
                    placeholderTextColor="#BBBBBB"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    value={email}
                    onChangeText={(t) => { setEmail(t); setEmailBanner(null); }}
                    onSubmitEditing={handleRequestOtp}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, emailLoading && styles.primaryButtonDisabled]}
                activeOpacity={0.85}
                onPress={handleRequestOtp}
                disabled={emailLoading}
              >
                {emailLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send code</Text>
                    <ArrowRight size={18} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.footerNote}>Contact your HR admin if you don't have an account.</Text>
            </Animated.View>
          )}

          {/* ── OTP step ── */}
          {step === 'otp' && (
            <Animated.View
              entering={SlideInRight.duration(300).springify()}
              style={styles.stepContainer}
            >
              {/* Back button */}
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <ArrowLeft size={18} color={Colors.text} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.title}>Check your email</Text>
              <Text style={styles.subtitle}>
                We sent a 6-digit code to{'\n'}
                <Text style={styles.emailHighlight}>{email.trim().toLowerCase()}</Text>
              </Text>

              <StatusBanner banner={otpBanner} />

              {/* OTP boxes — tap to focus hidden input */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => hiddenInputRef.current?.focus()}
                style={styles.otpRow}
              >
                {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                  <OtpBox
                    key={i}
                    digit={code[i] ?? ''}
                    focused={focusedIndex === i && !otpLoading}
                    hasError={hasError}
                  />
                ))}
              </TouchableOpacity>

              {/* Hidden real input */}
              <TextInput
                ref={hiddenInputRef}
                style={styles.hiddenInput}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                autoFocus
                caretHidden
              />

              <TouchableOpacity
                style={[styles.primaryButton, (otpLoading || code.length < CODE_LENGTH) && styles.primaryButtonDisabled]}
                activeOpacity={0.85}
                onPress={() => handleVerifyOtp()}
                disabled={otpLoading || code.length < CODE_LENGTH}
              >
                {otpLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Verify & sign in</Text>
                    <ArrowRight size={18} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>Didn't get it? </Text>
                <ResendTimer
                  seconds={resendSeconds}
                  onResend={handleResend}
                  isLoading={resendLoading}
                />
              </View>

              <Text style={styles.otpNote}>The code expires in 10 minutes.</Text>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 72,
    height: 72,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  emailHighlight: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },

  // Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    lineHeight: 19,
  },

  // Input
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    gap: 10,
  },
  inputRowError: {
    borderColor: Colors.frozen,
    backgroundColor: '#FFF8F8',
  },
  inputIcon: {
    flexShrink: 0,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
  },

  // Primary button
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    marginBottom: 20,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },

  footerNote: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 19,
    marginTop: 8,
  },

  // Back button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },

  // OTP boxes
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 8,
  },
  otpBox: {
    flex: 1,
    aspectRatio: 0.9,
    maxWidth: 52,
    borderWidth: 1.5,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigit: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  cursor: {
    width: 2,
    height: 22,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },

  // Resend
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resendLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  resendTimer: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
  },
  otpNote: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#AAAAAA',
  },
});
