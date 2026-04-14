import React from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Pressable } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Landmark, History, ChevronRight, Zap, TrendingUp, Leaf } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';
import { useUserStore, updateWallet } from '../../constants/userStore';

export default function WalletScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 880;
  const isPhone = width < 640;
  const user = useUserStore();

  const netMonthly = user.wallet.monthlyEarnings - user.wallet.monthlySpend;
  const usageProgress = Math.min((user.wallet.monthlySpend / 4000) * 100, 100);

  const handleAddCredits = () => {
    updateWallet({ balance: user.wallet.balance + 500 });
  };

  const handleWithdraw = () => {
    const nextBalance = Math.max(0, user.wallet.balance - 300);
    updateWallet({ balance: nextBalance });
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={[styles.scrollContent, isPhone && { paddingBottom: 130 }]} showsVerticalScrollIndicator={false}>
      <View style={[s.header, isPhone && { marginTop: 8 }]}> 
        <ThemedText style={s.title}>My Wallet</ThemedText>
        <ThemedText style={s.subtitle}>Personalized balance and green-energy financial analytics.</ThemedText>
      </View>

      <View style={[s.balanceCard, !isWide && { width: '100%', padding: isPhone ? 20 : 28 }]}> 
        <View style={s.balanceInfo}>
          <ThemedText style={s.tokenLabel}>CURRENT BALANCE</ThemedText>
          <ThemedText style={s.tokenAmount}>₹ {user.wallet.balance.toLocaleString('en-IN')}</ThemedText>
          <ThemedText style={s.balanceSub}>Auto top-up {user.wallet.autoTopUpEnabled ? 'enabled' : 'disabled'} at ₹ {user.wallet.autoTopUpThreshold}</ThemedText>
        </View>
        <View style={[s.actionRow, !isWide && { flexDirection: 'column' }]}> 
          <Pressable onPress={handleAddCredits} style={({ hovered }: any) => [s.mainBtn, hovered && { backgroundColor: '#16a34a' }]}> 
            <ArrowUpRight size={18} color="#fff" />
            <ThemedText style={s.btnTxt}>Add Credits</ThemedText>
          </Pressable>
          <Pressable onPress={handleWithdraw} style={({ hovered }: any) => [s.secondaryBtn, hovered && { backgroundColor: '#eee' }]}> 
            <ArrowDownLeft size={18} color="#000" />
            <ThemedText style={[s.btnTxt, { color: '#000' }]}>Withdraw</ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={[s.metricsRow, !isWide && { flexDirection: 'column' }]}> 
        <View style={s.metricCard}>
          <TrendingUp size={16} color="#16a34a" />
          <ThemedText style={s.metricTitle}>Monthly Net</ThemedText>
          <ThemedText style={[s.metricValue, { color: netMonthly >= 0 ? '#16a34a' : '#ef4444' }]}>
            {netMonthly >= 0 ? '+' : '-'} ₹ {Math.abs(netMonthly).toLocaleString('en-IN')}
          </ThemedText>
        </View>
        <View style={s.metricCard}>
          <Leaf size={16} color="#22c55e" />
          <ThemedText style={s.metricTitle}>CO2 Saved</ThemedText>
          <ThemedText style={s.metricValue}>{user.wallet.greenSavingsKg} kg</ThemedText>
        </View>
      </View>

      <View style={s.section}>
        <ThemedText style={s.sectionTitle}>Monthly Usage Target</ThemedText>
        <View style={s.progressCard}>
          <View style={s.progressHead}>
            <ThemedText style={s.progressLabel}>Budget usage this month</ThemedText>
            <ThemedText style={s.progressPercent}>{usageProgress.toFixed(0)}%</ThemedText>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressBar, { width: `${usageProgress}%` }]} />
          </View>
          <ThemedText style={s.progressSub}>Current spend ₹ {user.wallet.monthlySpend.toLocaleString('en-IN')} of ₹ 4,000 target</ThemedText>
        </View>
      </View>

      <View style={s.section}>
        <ThemedText style={s.sectionTitle}>Linked Accounts</ThemedText>
        <View style={[s.cardsGroup, isWide && { flexDirection: 'row' }]}> 
          <Pressable style={s.accountCard}>
            <View style={s.accountInfo}>
              <View style={s.bankIcon}><Landmark size={20} color="#0f172a" /></View>
              <View>
                <ThemedText style={s.accountName}>HDFC Bank Primary</ThemedText>
                <ThemedText style={s.accountSub}>**** 4210</ThemedText>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>
          <Pressable style={s.accountCard}>
            <View style={s.accountInfo}>
              <View style={s.bankIcon}><Zap size={20} color="#22c55e" /></View>
              <View>
                <ThemedText style={s.accountName}>{user.profile.discomName}</ThemedText>
                <ThemedText style={s.accountSub}>{user.profile.meterId}</ThemedText>
              </View>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>
        </View>
      </View>

      <View style={s.section}>
        <View style={s.sectionHeader}>
          <ThemedText style={s.sectionTitle}>Transaction History</ThemedText>
          <Pressable>
            <ThemedText style={s.viewAll}>View Complete Ledger</ThemedText>
          </Pressable>
        </View>

        <View style={s.historyList}>
          {[
            { title: 'Energy Sold (Node-401)', date: 'Today, 10:24 AM', val: '+ ₹ 420.00', pos: true },
            { title: 'Energy Buy (Node-112)', date: 'Yesterday, 04:15 PM', val: '- ₹ 86.50', pos: false },
            { title: 'Grid Oversupply Rebate', date: 'April 10, 2026', val: '+ ₹ 12.00', pos: true },
          ].map((tx, i) => (
            <View key={i} style={s.historyItem}>
              <View style={s.historyIcon}>
                <History size={16} color="#64748b" />
              </View>
              <View style={s.historyDetails}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={s.historyTitle}>{tx.title}</ThemedText>
                  <ThemedText style={s.historyDate}>{tx.date}</ThemedText>
                </View>
                <ThemedText style={[s.historyVal, { color: tx.pos ? '#16a34a' : '#ef4444' }]}>
                  {tx.val}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 100 },
});

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20 },
  header: { marginBottom: 24, marginTop: 14 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748b' },

  balanceCard: { backgroundColor: '#0f172a', borderRadius: 24, padding: 30, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  balanceInfo: { marginBottom: 24 },
  tokenLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  tokenAmount: { color: '#fff', fontSize: 34, fontWeight: '900' },
  balanceSub: { color: '#cbd5e1', marginTop: 8, fontSize: 12 },

  actionRow: { flexDirection: 'row', gap: 12 },
  mainBtn: { flex: 1, height: 48, backgroundColor: '#22c55e', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  secondaryBtn: { flex: 1, height: 48, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  metricCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', gap: 8 },
  metricTitle: { fontSize: 12, color: '#64748b' },
  metricValue: { fontSize: 20, fontWeight: '800', color: '#0f172a' },

  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  viewAll: { fontSize: 13, color: '#22c55e', fontWeight: '700' },

  progressCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', padding: 16 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: '#334155', fontWeight: '600' },
  progressPercent: { fontSize: 13, fontWeight: '700', color: '#16a34a' },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#e2e8f0', overflow: 'hidden', marginBottom: 8 },
  progressBar: { height: '100%', backgroundColor: '#22c55e' },
  progressSub: { fontSize: 12, color: '#64748b' },

  cardsGroup: { gap: 12 },
  accountCard: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  accountInfo: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  bankIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  accountName: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 2, flexShrink: 1 },
  accountSub: { fontSize: 12, color: '#64748b' },

  historyList: { backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  historyItem: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center', gap: 12 },
  historyIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  historyDetails: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  historyTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  historyDate: { fontSize: 11, color: '#94a3b8' },
  historyVal: { fontSize: 14, fontWeight: '800' },
});
