import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ShieldCheck, Smartphone, Zap } from 'lucide-react-native';
import { ThemedText } from './ThemedText';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

const OTP_LENGTH = 6;

function isValidIndianPhone(value: string) {
  return /^[6-9]\d{9}$/.test(value);
}

export function AuthModal({ visible, onClose }: AuthModalProps) {
  const { width } = useWindowDimensions();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(13);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (visible) {
      setStep('phone');
      setPhone('');
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(13);
      setPhoneError('');
      setOtpError('');
    }
  }, [visible]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((value) => value - 1), 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [step, countdown]);

  const handlePhoneChange = (rawText: string) => {
    const cleaned = rawText.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleSendOtp = () => {
    if (!isValidIndianPhone(phone)) {
      setPhoneError('Enter a valid 10-digit mobile number starting with 6-9.');
      return;
    }

    setStep('otp');
    setCountdown(13);
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setTimeout(() => otpRefs.current[0]?.focus(), 80);
  };

  const handleOtpChange = (text: string, index: number) => {
    const value = text.replace(/\D/g, '');
    const next = [...otp];

    if (value.length > 1) {
      const chars = value.slice(0, OTP_LENGTH - index).split('');
      chars.forEach((char, offset) => {
        next[index + offset] = char;
      });
      setOtp(next);
      setOtpError('');
      const focusIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
      otpRefs.current[focusIndex]?.focus();
      return;
    }

    next[index] = value;
    setOtp(next);
    setOtpError('');

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length !== OTP_LENGTH) {
      setOtpError('Please enter the complete 6-digit OTP.');
      return;
    }

    onClose();
    router.push('/(auth)/discom');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={s.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[s.modalCard, width < 600 && { width: '92%', padding: 24 }]}> 
          <Pressable style={s.modalClose} onPress={onClose}>
            <ThemedText style={{ color: '#64748b', fontSize: 16 }}>X</ThemedText>
          </Pressable>

          {step === 'phone' ? (
            <View style={s.stepContainer}>
              <View style={s.logoWrapper}>
                <Zap size={28} color="#22c55e" fill="#22c55e" />
              </View>
              <ThemedText style={s.modalTitle}>Welcome to Yagami</ThemedText>
              <ThemedText style={s.modalSub}>
                Enter your mobile number to get started with P2P energy trading.
              </ThemedText>

              <View
                style={[
                  s.inputContainer,
                  phone.length === 10 && !phoneError && s.inputValid,
                  phoneError && s.inputError,
                ]}
              >
                <View style={s.prefix}>
                  <ThemedText style={s.prefixTxt}>+91</ThemedText>
                </View>
                <TextInput
                  style={s.input}
                  placeholder="Enter 10-digit mobile number"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholderTextColor="#94a3b8"
                  autoFocus
                  textContentType="telephoneNumber"
                  autoComplete="tel"
                  selectionColor="#22c55e"
                />
              </View>

              {!!phoneError && <ThemedText style={s.errorText}>{phoneError}</ThemedText>}

              <Pressable
                style={({ hovered }: any) => [
                  s.btn,
                  hovered && { backgroundColor: '#16a34a' },
                  !isValidIndianPhone(phone) && s.btnDisabled,
                ]}
                onPress={handleSendOtp}
                disabled={!isValidIndianPhone(phone)}
              >
                <ThemedText style={s.btnTxt}>Get OTP</ThemedText>
              </Pressable>
            </View>
          ) : (
            <View style={s.stepContainer}>
              <View style={s.iconWrapper}>
                <Smartphone size={24} color="#22c55e" />
              </View>

              <ThemedText style={s.modalTitle}>Verification Code</ThemedText>
              <ThemedText style={s.modalSub}>
                We have sent the verification code to{'\n'}
                <ThemedText style={{ fontWeight: '700', color: '#0f172a' }}>
                  +91-{phone.slice(0, 2)}-xxxxx-{phone.slice(-3)}
                </ThemedText>
              </ThemedText>

              <View style={s.otpRow}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => {
                      otpRefs.current[idx] = ref;
                    }}
                    style={[s.otpBox, digit !== '' && s.otpBoxFilled, otpError && s.otpBoxError]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(t) => handleOtpChange(t, idx)}
                    onKeyPress={(e) => handleOtpKeyPress(e.nativeEvent.key, idx)}
                    textAlign="center"
                    selectionColor="#22c55e"
                  />
                ))}
              </View>

              {!!otpError && <ThemedText style={s.errorText}>{otpError}</ThemedText>}

              <Pressable
                style={({ hovered }: any) => [s.verifyBtn, hovered && { backgroundColor: '#16a34a' }]}
                onPress={verifyOtp}
              >
                <ThemedText style={s.verifyBtnTxt}>Verify & Login</ThemedText>
                <ShieldCheck size={16} color="#fff" style={{ marginLeft: 8 }} />
              </Pressable>

              <ThemedText style={s.resendTxt}>
                {countdown > 0 ? (
                  <>
                    Resend code in{' '}
                    <ThemedText style={{ color: '#22c55e', fontWeight: '700' }}>{countdown}s</ThemedText>
                  </>
                ) : (
                  <ThemedText style={{ color: '#22c55e', fontWeight: '700' }}>Resend Now</ThemedText>
                )}
              </ThemedText>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 40,
    width: 440,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 35,
    elevation: 10,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stepContainer: { width: '100%', alignItems: 'center' },
  logoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 60,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 12,
  },
  inputValid: { borderColor: '#22c55e', borderWidth: 2 },
  inputError: { borderColor: '#ef4444' },
  prefix: {
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
    justifyContent: 'center',
    height: '100%',
  },
  prefixTxt: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  input: { flex: 1, height: '100%', fontSize: 18, color: '#0f172a', paddingHorizontal: 16 },
  errorText: {
    alignSelf: 'flex-start',
    marginBottom: 14,
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  btn: {
    width: '100%',
    height: 56,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#cbd5e1' },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  otpBox: {
    width: 45,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0f172a',
  },
  otpBoxFilled: { backgroundColor: '#f0fdf4', borderColor: '#22c55e' },
  otpBoxError: { borderColor: '#ef4444' },
  verifyBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyBtnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
  resendTxt: { fontSize: 12, color: '#64748b' },
});
