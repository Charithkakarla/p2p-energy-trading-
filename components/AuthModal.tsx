import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Modal, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Smartphone, CheckCircle2, ShieldCheck, Zap } from 'lucide-react-native';
import { ThemedText } from './ThemedText';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AuthModal({ visible, onClose }: AuthModalProps) {
  const { width } = useWindowDimensions();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [countdown, setCountdown] = useState(13);

  // Reset state when modal is opened
  useEffect(() => {
    if (visible) {
      setStep('phone');
      setPhone('');
      setOtp(Array(6).fill(''));
      setCountdown(13);
    }
  }, [visible]);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setStep('otp');
      setCountdown(13);
    } else {
      alert("Please enter a valid 10-digit mobile number.");
    }
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length === 6) {
      onClose();
      router.push('/(auth)/discom');
    } else {
      alert("Please enter the complete 6-digit OTP.");
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.modalOverlay}>
        <View style={[s.modalCard, width < 600 && { width: '90%', padding: 24 }]}>
          <Pressable style={s.modalClose} onPress={onClose}>
            <ThemedText style={{ color: '#64748b', fontSize: 16 }}>✕</ThemedText>
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

              <View style={[s.inputContainer, phone.length === 10 && s.inputValid]}>
                <View style={s.prefix}><ThemedText style={s.prefixTxt}>+91</ThemedText></View>
                <TextInput
                  style={s.input}
                  placeholder="Enter 10-digit mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
                  placeholderTextColor="#94a3b8"
                  autoFocus
                />
              </View>

              <Pressable 
                style={({hovered}: any) => [s.btn, hovered && { backgroundColor: '#16a34a' }, phone.length !== 10 && s.btnDisabled]} 
                onPress={handleSendOtp}
                disabled={phone.length !== 10}
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
                    style={[s.otpBox, digit !== '' && s.otpBoxFilled]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(t) => handleOtpChange(t, idx)}
                  />
                ))}
              </View>

              <Pressable style={({hovered}: any) => [s.verifyBtn, hovered && { backgroundColor: '#16a34a' }]} onPress={verifyOtp}>
                <ThemedText style={s.verifyBtnTxt}>Verify & Login</ThemedText>
                <ShieldCheck size={16} color="#fff" style={{ marginLeft: 8 }} />
              </Pressable>

              <ThemedText style={s.resendTxt}>
                {countdown > 0 ? (
                  <>Resend code in <ThemedText style={{ color: '#22c55e', fontWeight: '700' }}>{countdown}s</ThemedText></>
                ) : (
                  <ThemedText style={{ color: '#22c55e', fontWeight: '700' }}>Resend Now</ThemedText>
                )}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s: any = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 40, width: 440, alignItems: 'center', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 35 },
  modalClose: { position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 16, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  
  stepContainer: { width: '100%', alignItems: 'center' },
  
  logoWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  iconWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  modalSub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', height: 60, overflow: 'hidden', width: '100%', marginBottom: 24 },
  inputValid: { borderColor: '#22c55e', borderWidth: 2 },
  prefix: { paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: '#f1f5f9', justifyContent: 'center', height: '100%' },
  prefixTxt: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  input: { flex: 1, height: '100%', fontSize: 18, color: '#0f172a', paddingHorizontal: 16 },
  
  btn: { width: '100%', height: 56, backgroundColor: '#22c55e', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnDisabled: { backgroundColor: '#cbd5e1' },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },

  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  otpBox: { width: 45, height: 55, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center', color: '#0f172a' },
  otpBoxFilled: { backgroundColor: '#f0fdf4', borderColor: '#22c55e' },

  verifyBtn: { width: '100%', height: 52, backgroundColor: '#22c55e', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  verifyBtnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
  resendTxt: { fontSize: 12, color: '#64748b' },
});
