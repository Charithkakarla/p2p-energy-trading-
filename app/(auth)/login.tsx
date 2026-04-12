import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Modal, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Zap, Smartphone, CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const [phone, setPhone] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [countdown, setCountdown] = useState(13);

  useEffect(() => {
    let timer: any;
    if (showOtp && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showOtp, countdown]);

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setShowOtp(true);
      setCountdown(13);
    } else {
      alert("Please enter a valid 10-digit mobile number.");
    }
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length === 6) {
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
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.push('/')}>
          <ArrowLeft size={24} color="#0f172a" />
        </Pressable>
        <View style={s.logoRow}>
          <Zap size={22} color="#22c55e" fill="#22c55e" />
          <ThemedText style={s.logoText}>Yagami</ThemedText>
        </View>
      </View>

      {/* Main Box */}
      <View style={s.content}>
        <ThemedText style={s.title}>Welcome to Yagami</ThemedText>
        <ThemedText style={s.sub}>
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
          style={({hovered}: any) => [s.btn, hovered && { opacity: 0.9 }, phone.length !== 10 && s.btnDisabled]} 
          onPress={handleSendOtp}
          disabled={phone.length !== 10}
        >
          <ThemedText style={s.btnTxt}>Get OTP</ThemedText>
        </Pressable>
      </View>

      <Modal visible={showOtp} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={[s.modalCard, width < 600 && { width: '90%', padding: 24 }]}>
            <Pressable style={s.modalClose} onPress={() => setShowOtp(false)}>
              <ThemedText style={{ color: '#64748b', fontSize: 16 }}>✕</ThemedText>
            </Pressable>
            
            <View style={s.iconWrapper}>
              <Smartphone size={24} color="#0035f5" />
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

            <Pressable style={({hovered}: any) => [s.verifyBtn, hovered && { backgroundColor: '#0026c4' }]} onPress={verifyOtp}>
              <ThemedText style={s.verifyBtnTxt}>Verify & Login</ThemedText>
              <ShieldCheck size={16} color="#fff" style={{ marginLeft: 8 }} />
            </Pressable>

            <ThemedText style={s.resendTxt}>
              {countdown > 0 ? (
                <>Resend code in <ThemedText style={{ color: '#0035f5', fontWeight: '700' }}>{countdown}s</ThemedText></>
              ) : (
                <ThemedText style={{ color: '#0035f5', fontWeight: '700' }}>Resend Now</ThemedText>
              )}
            </ThemedText>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc', alignItems: 'center' },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, position: 'relative', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: '#fff' },
  backBtn: { position: 'absolute', left: 24, padding: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  content: { width: '100%', maxWidth: 440, paddingHorizontal: 32, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  sub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', height: 60, overflow: 'hidden' },
  inputValid: { borderColor: '#22c55e', borderWidth: 2 },
  prefix: { paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: '#e2e8f0', justifyContent: 'center', height: '100%' },
  prefixTxt: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  input: { flex: 1, height: '100%', fontSize: 18, color: '#0f172a', paddingHorizontal: 16, outlineStyle: 'none' },
  
  btn: { width: '100%', height: 56, backgroundColor: '#22c55e', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  btnDisabled: { backgroundColor: '#94a3b8' },
  btnTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 40, width: 440, alignItems: 'center', position: 'relative' },
  modalClose: { position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  iconWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  modalSub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  otpBox: { width: 45, height: 55, borderRadius: 8, borderWidth: 1, borderColor: '#0035f5', backgroundColor: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center', color: '#0f172a', outlineStyle: 'none' },
  otpBoxFilled: { backgroundColor: '#f0f4ff' },

  verifyBtn: { width: '100%', height: 50, backgroundColor: '#0035f5', borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  verifyBtnTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
  resendTxt: { fontSize: 12, color: '#64748b' },
});
