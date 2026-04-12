import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Pressable } from 'react-native';
import { LogOut, ShoppingBag, Store, ShieldCheck, CheckCircle2, Info, ArrowRight, Zap, TrendingUp, Wallet, ArrowRightLeft, User } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 800;

  const [verificationMode, setVerificationMode] = useState<'none' | 'buyer' | 'seller'>('none');
  const [isVerified, setIsVerified] = useState(false);

  const handleStartVerification = (mode: 'buyer' | 'seller') => {
    setVerificationMode(mode);
    // Simulate a successful verification after a brief delay
    setTimeout(() => {
      setIsVerified(true);
    }, 1500);
  };

  if (isVerified) {
    return (
      <View style={s.root}>
        {/* Top Header */}
        <View style={s.topHeader}>
          <View style={s.logoRow}>
            <Zap size={22} color="#22c55e" fill="#22c55e" />
            <ThemedText style={s.logoText}>Yagami</ThemedText>
          </View>
          <Pressable 
            style={({hovered}: any) => [s.logoutBtn, hovered && { backgroundColor: '#f1f5f9', borderRadius: 8 }]} 
            onPress={() => router.push('/')}
          >
            <LogOut size={20} color="#64748b" />
          </Pressable>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          <View style={s.container}>
            <View style={s.verifiedHeader}>
              <View style={s.verifiedIcon}>
                <CheckCircle2 size={32} color="#16a34a" />
              </View>
              <ThemedText style={s.welcomeTitle}>Identity Verified</ThemedText>
              <ThemedText style={s.welcomeSub}>
                Your node is now active as a {verificationMode === 'buyer' ? 'Consumer' : 'Prosumer'}.
              </ThemedText>
            </View>

            {/* Trading Overview */}
            <View style={[s.statGrid, !isWide && { flexDirection: 'column' }]}>
              {[
                { label: 'Available Balance', val: '₹12,450.00', icon: <Wallet size={18} color="#22c55e" /> },
                { label: 'Pending Trades', val: '3', icon: <ArrowRightLeft size={18} color="#3b82f6" /> },
                { label: 'Live Price/kWh', val: '₹4.20', icon: <TrendingUp size={18} color="#eab308" /> },
              ].map((item, i) => (
                <View key={i} style={s.statCard}>
                  <View style={s.statIcon}>{item.icon}</View>
                  <View>
                    <ThemedText style={s.statLabel}>{item.label}</ThemedText>
                    <ThemedText style={s.statVal}>{item.val}</ThemedText>
                  </View>
                </View>
              ))}
            </View>

            <View style={s.marketPreview}>
              <View style={s.marketHeader}>
                <ThemedText style={s.sectionTitle}>Live Local Market</ThemedText>
                <View style={s.liveBadge}>
                  <View style={s.liveDot} />
                  <ThemedText style={s.liveTxt}>Live Nodes</ThemedText>
                </View>
              </View>
              {[1, 2, 3].map(i => (
                <View key={i} style={s.marketRow}>
                  <View style={s.marketNode}>
                    <View style={[s.nodeDot, { backgroundColor: i === 1 ? '#22c55e' : '#cbd5e1' }]} />
                    <ThemedText style={s.nodeName}>Node-00{i*42}</ThemedText>
                  </View>
                  <ThemedText style={s.nodePrice}>₹4.{5-i}/kWh</ThemedText>
                  <Pressable style={({hovered}: any) => [s.miniBtn, hovered && { backgroundColor: '#16a34a', borderColor: '#16a34a' }]}>
                    {({hovered}: any) => (
                      <ThemedText style={[s.miniBtnTxt, hovered && { color: '#fff' }]}>Match</ThemedText>
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.root}>
      {/* Top Header Row */}
      <View style={s.topHeader}>
        <View style={s.logoRow}>
          <Zap size={22} color="#22c55e" fill="#22c55e" />
          <ThemedText style={s.logoText}>Yagami</ThemedText>
        </View>
        <Pressable 
          style={({hovered}: any) => [s.logoutBtn, hovered && { backgroundColor: '#f1f5f9', borderRadius: 8 }]} 
          onPress={() => router.push('/')}
        >
          <LogOut size={20} color="#64748b" />
        </Pressable>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={s.container}>
          {/* Welcome Area */}
          <View style={[s.welcomeSection, isWide && { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <View>
              <ThemedText style={s.welcomeTitle}>Hello, Kakarla Charith! 👋</ThemedText>
              <ThemedText style={s.welcomeSub}>Complete your identity verification to start sustainable trading.</ThemedText>
            </View>
          </View>

          {/* Cards Row */}
          <View style={[s.cardsRow, !isWide && { flexDirection: 'column' }]}>
            {/* Buyer Card */}
            <View style={[s.actionCard, !isWide && { width: '100%' }]}>
              <View style={s.cardHeader}>
                <View style={s.cardIconBox}>
                  <ShoppingBag size={20} color="#22c55e" />
                </View>
                <View style={s.notVerifiedPill}>
                  <ThemedText style={s.notVerifiedTxt}>ACTION REQUIRED</ThemedText>
                </View>
              </View>
              <ThemedText style={s.cardTitle}>Become a Buyer</ThemedText>
              <ThemedText style={s.cardDesc}>
                Verify your consumer meter to start buying cheaper green energy from your local neighborhood.
              </ThemedText>
              <Pressable 
                style={({hovered}: any) => [s.cardBtn, hovered && { backgroundColor: '#16a34a', transform: [{ scale: 1.02 }] }]}
                onPress={() => handleStartVerification('buyer')}
                disabled={verificationMode !== 'none'}
              >
                <ThemedText style={s.cardBtnTxt}>
                  {verificationMode === 'buyer' ? 'Verifying Node...' : 'Start Buyer Verification'}
                </ThemedText>
                <ArrowRight size={16} color="#fff" />
              </Pressable>
            </View>

            {/* Seller Card */}
            <View style={[s.actionCard, !isWide && { width: '100%' }]}>
              <View style={s.cardHeader}>
                <View style={s.cardIconBox}>
                  <Store size={20} color="#22c55e" />
                </View>
                <View style={s.notVerifiedPill}>
                  <ThemedText style={s.notVerifiedTxt}>ACTION REQUIRED</ThemedText>
                </View>
              </View>
              <ThemedText style={s.cardTitle}>Become a Seller</ThemedText>
              <ThemedText style={s.cardDesc}>
                Monetize your rooftop solar by selling excess energy to neighbors via our decentralized grid.
              </ThemedText>
              <Pressable 
                style={({hovered}: any) => [s.cardBtn, hovered && { backgroundColor: '#16a34a', transform: [{ scale: 1.02 }] }]}
                onPress={() => handleStartVerification('seller')}
                disabled={verificationMode !== 'none'}
              >
                <ThemedText style={s.cardBtnTxt}>
                  {verificationMode === 'seller' ? 'Verifying Node...' : 'Start Seller Verification'}
                </ThemedText>
                <ArrowRight size={16} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Info Banner */}
          <View style={[s.banner, !isWide && { flexDirection: 'column', gap: 24 }]}>
            <View style={s.bannerLeft}>
              <View style={s.bannerTitleRow}>
                <ShieldCheck size={20} color="#fff" />
                <ThemedText style={s.bannerTitle}>Trust & Sustainability</ThemedText>
              </View>
              <ThemedText style={s.bannerDesc}>
                We use Verifiable Credentials (VC) to link your account to your physical smart meter securely. This ensures 100% traceable green energy trading.
              </ThemedText>
            </View>
            <View style={[s.bannerRight, !isWide && { width: '100%', alignSelf: 'flex-start' }]}>
              <View style={s.badgeWrap}>
                <ThemedText style={s.badgeLabel}>SECURITY</ThemedText>
                <View style={s.badgeInfo}>
                  <CheckCircle2 size={14} color="#22c55e" />
                  <ThemedText style={s.badgeVal}>Zero-Knowledge</ThemedText>
                </View>
              </View>
              <View style={s.badgeWrap}>
                <ThemedText style={s.badgeLabel}>GOVERNANCE</ThemedText>
                <View style={s.badgeInfo}>
                  <Info size={14} color="#3b82f6" />
                  <ThemedText style={s.badgeVal}>Govt. Compliant</ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s: any = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f9fafb' },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 22, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  logoutBtn: { padding: 8 },
  
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 100 },
  container: { width: '100%', maxWidth: 1000, alignSelf: 'center' },
  
  welcomeSection: { marginBottom: 40 },
  welcomeTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  welcomeSub: { fontSize: 16, color: '#64748b' },

  cardsRow: { flexDirection: 'row', gap: 24, marginBottom: 40 },
  actionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.05, shadowRadius: 15 },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center' },
  notVerifiedPill: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  notVerifiedTxt: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 0.5 },
  
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#64748b', lineHeight: 22, marginBottom: 32 },
  cardBtn: { width: '100%', height: 52, backgroundColor: '#22c55e', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  cardBtnTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },

  banner: { width: '100%', backgroundColor: '#0f172a', borderRadius: 24, padding: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerLeft: { flex: 1, paddingRight: 40 },
  bannerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  bannerDesc: { fontSize: 14, color: '#94a3b8', lineHeight: 22 },
  bannerRight: { flexDirection: 'row', gap: 16 },
  badgeWrap: { backgroundColor: '#1e293b', padding: 12, borderRadius: 16, minWidth: 140 },
  badgeLabel: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 0.8, marginBottom: 6 },
  badgeInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeVal: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Verified State
  verifiedHeader: { alignItems: 'center', marginBottom: 48, marginTop: 20 },
  verifiedIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  
  statGrid: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', gap: 16 },
  statIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  statVal: { fontSize: 20, fontWeight: '800', color: '#0f172a' },

  marketPreview: { backgroundColor: '#fff', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: '#e5e7eb' },
  marketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  liveTxt: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  
  marketRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  marketNode: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nodeDot: { width: 8, height: 8, borderRadius: 4 },
  nodeName: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  nodePrice: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  miniBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  miniBtnTxt: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
});
