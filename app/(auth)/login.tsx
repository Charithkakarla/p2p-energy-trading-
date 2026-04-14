import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Modal, Pressable, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Zap, Smartphone, ShieldCheck } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';

const OTP_LENGTH = 6;

function isValidIndianPhone(value: string) {
  return /^[6-9]\d{9}$/.test(value);
}

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const [phone, setPhone] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(30);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  const otpRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (showOtp && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [showOtp, countdown]);

  const handleSendOtp = () => {
    if (!isValidIndianPhone(phone)) {
      setPhoneError('Enter a valid 10-digit mobile number starting with 6-9.');
      return;
    }
    setPhoneError('');
    setShowOtp(true);
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setCountdown(30);

    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 80);
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length !== OTP_LENGTH) {
      setOtpError('Please enter the complete 6-digit OTP.');
      return;
    }
    setOtpError('');
    router.push('/(auth)/discom');
  };

  const handleOtpChange = (text: string, index: number) => {
    const value = text.replace(/\D/g, '');
    const next = [...otp];

    if (value.length > 1) {
      // Handle autofill/paste case by distributing across remaining boxes.
      const chars = value.slice(0, OTP_LENGTH - index).split('');
      chars.forEach((char, offset) => {
        next[index + offset] = char;
      });
      setOtp(next);
      const focusIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
      otpRefs.current[focusIndex]?.focus();
      return;
    }

    next[index] = value;
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePhoneChange = (rawText: string) => {
    const cleaned = rawText.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (phoneError && cleaned.length <= 10) {
      setPhoneError('');
    }
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.push('/')}>
          <ArrowLeft size={24} color="#0f172a" />
        </Pressable>
        <View style={s.logoRow}>
          <Zap size={22} color="#22c55e" fill="#22c55e" />
          <ThemedText style={s.logoText}>Yagami</ThemedText>
        </View>
      </View>

      <View style={[s.content, width < 600 && { paddingHorizontal: 18, paddingTop: 36 }]}> 
        <ThemedText style={s.title}>Welcome to Yagami</ThemedText>
        <ThemedText style={s.sub}>
          Enter your mobile number to get started with P2P energy trading.
        </ThemedText>

        <View style={[s.inputContainer, phone.length === 10 && !phoneError && s.inputValid, phoneError && s.inputError]}>
          <View style={s.prefix}><ThemedText style={s.prefixTxt}>+91</ThemedText></View>
          <TextInput
            style={s.input}
            placeholder="Enter 10-digit mobile number"
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholderTextColor="#94a3b8"
            autoFocus
          />
        </View>

        {!!phoneError && <ThemedText style={s.errorText}>{phoneError}</ThemedText>}

        <Pressable
          style={({ hovered }: any) => [s.btn, hovered && { opacity: 0.9 }, !isValidIndianPhone(phone) && s.btnDisabled]}
          onPress={handleSendOtp}
          disabled={!isValidIndianPhone(phone)}
        >
          <ThemedText style={s.btnTxt}>Get OTP</ThemedText>
        </Pressable>
      </View>

      <Modal visible={showOtp} transparent animationType="fade" onRequestClose={() => setShowOtp(false)}>
        <KeyboardAvoidingView style={s.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[s.modalCard, width < 600 && { width: '92%', padding: 20 }]}> 
            <Pressable style={s.modalClose} onPress={() => setShowOtp(false)}>
              <ThemedText style={{ color: '#64748b', fontSize: 16 }}>X</ThemedText>
            </Pressable>

            <View style={s.iconWrapper}>
              <Smartphone size={24} color="#0035f5" />
            </View>

            <ThemedText style={s.modalTitle}>Verification Code</ThemedText>
            <ThemedText style={s.modalSub}>
              We have sent the verification code to
            </ThemedText>
            <ThemedText style={s.maskedPhone}>+91-{phone.slice(0, 2)}-xxxxx-{phone.slice(-3)}</ThemedText>

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
                />
              ))}
            </View>

            {!!otpError && <ThemedText style={s.errorText}>{otpError}</ThemedText>}

            <Pressable style={({ hovered }: any) => [s.verifyBtn, hovered && { backgroundColor: '#0026c4' }]} onPress={verifyOtp}>
              <ThemedText style={s.verifyBtnTxt}>Verify & Login</ThemedText>
              <ShieldCheck size={16} color="#fff" style={{ marginLeft: 8 }} />
            </Pressable>

            <Pressable
              onPress={() => {
                if (countdown === 0) {
                  setCountdown(30);
                  setOtp(Array(OTP_LENGTH).fill(''));
                  otpRefs.current[0]?.focus();
                }
              }}
            >
              <ThemedText style={s.resendTxt}>
                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Now'}
              </ThemedText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc', alignItems: 'center' },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, position: 'relative', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: '#fff' },
  backBtn: { position: 'absolute', left: 14, padding: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  content: { width: '100%', maxWidth: 440, paddingHorizontal: 24, paddingTop: 56 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  sub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 26, lineHeight: 22 },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', height: 56, overflow: 'hidden' },
  inputValid: { borderColor: '#22c55e', borderWidth: 2 },
  inputError: { borderColor: '#ef4444' },
  prefix: { paddingHorizontal: 14, borderRightWidth: 1, borderRightColor: '#e2e8f0', justifyContent: 'center', height: '100%' },
  prefixTxt: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  input: { flex: 1, height: '100%', fontSize: 18, color: '#0f172a', paddingHorizontal: 12 },

  errorText: { marginTop: 8, color: '#ef4444', fontSize: 12, fontWeight: '600' },

  btn: { width: '100%', height: 54, backgroundColor: '#22c55e', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  btnDisabled: { backgroundColor: '#94a3b8' },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 28, width: 440, alignItems: 'center', position: 'relative' },
  modalClose: { position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  iconWrapper: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  modalSub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20 },
  maskedPhone: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 20 },

  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 6, justifyContent: 'center' },
  otpBox: { width: 42, height: 52, borderRadius: 8, borderWidth: 1, borderColor: '#0035f5', backgroundColor: '#fff', fontSize: 20, fontWeight: '700', color: '#0f172a' },
  otpBoxFilled: { backgroundColor: '#f0f4ff' },
  otpBoxError: { borderColor: '#ef4444' },

  verifyBtn: { width: '100%', height: 50, backgroundColor: '#0035f5', borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14, marginBottom: 12 },
  verifyBtnTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
  resendTxt: { fontSize: 12, color: '#0035f5', fontWeight: '700' },
});
