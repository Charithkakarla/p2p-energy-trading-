import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, useWindowDimensions, Pressable } from 'react-native';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, Landmark, History, ChevronRight, Zap } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';

export default function WalletScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 800;

  return (
    <ScrollView style={s.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <ThemedText style={s.title}>My Wallet</ThemedText>
        <ThemedText style={s.subtitle}>Total balance across all linked grids.</ThemedText>
      </View>

      <View style={[s.balanceCard, !isWide && { width: '100%' }]}>
        <View style={s.balanceInfo}>
          <ThemedText style={s.tokenLabel}>CURRENT BALANCE</ThemedText>
          <ThemedText style={s.tokenAmount}>₹ 12,450.00</ThemedText>
        </View>
        <View style={[s.actionRow, !isWide && { flexDirection: 'column' }]}>
           <Pressable style={({hovered}: any) => [s.mainBtn, hovered && { backgroundColor: '#16a34a' }]}>
              <ArrowUpRight size={18} color="#fff" />
              <ThemedText style={s.btnTxt}>Add Credits</ThemedText>
           </Pressable>
           <Pressable style={({hovered}: any) => [s.secondaryBtn, hovered && { backgroundColor: '#eee' }]}>
              <ArrowDownLeft size={18} color="#000" />
              <ThemedText style={[s.btnTxt, { color: '#000' }]}>Withdraw</ThemedText>
           </Pressable>
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
                  <ThemedText style={s.accountName}>BSES Prepaid Grid</ThemedText>
                  <ThemedText style={s.accountSub}>ID: 121004523</ThemedText>
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
            { tag: 'SALE', title: 'Energy Sold (Node-401)', date: 'Today, 10:24 AM', val: '+ ₹ 420.00', pos: true },
            { tag: 'PURCHASE', title: 'Energy Buy (Node-112)', date: 'Yesterday, 04:15 PM', val: '- ₹ 86.50', pos: false },
            { tag: 'REFUND', title: 'Grid Oversupply Rebate', date: 'April 10, 2024', val: '+ ₹ 12.00', pos: true },
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
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 24 },
  header: { marginBottom: 32, marginTop: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748b' },

  balanceCard: { backgroundColor: '#0f172a', borderRadius: 24, padding: 32, marginBottom: 40, shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.1, shadowRadius: 20 },
  balanceInfo: { marginBottom: 32 },
  tokenLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  tokenAmount: { color: '#fff', fontSize: 36, fontWeight: '900' },
  
  actionRow: { flexDirection: 'row', gap: 12 },
  mainBtn: { flex: 1, height: 50, backgroundColor: '#22c55e', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  secondaryBtn: { flex: 1, height: 50, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  section: { marginBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  viewAll: { fontSize: 13, color: '#22c55e', fontWeight: '700' },

  cardsGroup: { gap: 16 },
  accountCard: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  accountInfo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bankIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  accountName: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  accountSub: { fontSize: 12, color: '#64748b' },

  historyList: { backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  historyItem: { flexDirection: 'row', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center', gap: 16 },
  historyIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  historyDetails: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  historyTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  historyDate: { fontSize: 12, color: '#94a3b8' },
  historyVal: { fontSize: 15, fontWeight: '800' },
});
