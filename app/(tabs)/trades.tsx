import React from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Pressable } from 'react-native';
import { History, ArrowRight, Zap, CheckCircle2, XCircle, ChevronRight, FileText } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';

const MOCK_TRADES = [
  { id: '1', date: 'April 12, 2024', status: 'completed', energy: '12.4 kWh', price: '₹ 62.4', type: 'sold', counterpart: 'Consumer Node-120' },
  { id: '2', date: 'April 11, 2024', status: 'completed', energy: '8.0 kWh', price: '₹ 41.6', type: 'bought', counterpart: 'Seller Node-045' },
  { id: '3', date: 'April 09, 2024', status: 'cancelled', energy: '15.0 kWh', price: '₹ 78.0', type: 'sold', counterpart: 'Buyer Node-990' },
];

export default function TradesScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 800;

  return (
    <ScrollView style={s.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <ThemedText style={s.title}>Trade Ledger</ThemedText>
        <ThemedText style={s.subtitle}>Verified peer-to-peer energy transactions.</ThemedText>
      </View>

      <View style={[s.content, isWide && { maxWidth: 800, alignSelf: 'center' }]}>
        {MOCK_TRADES.map(trade => {
          const isCompleted = trade.status === 'completed';
          const isSold = trade.type === 'sold';
          
          return (
            <View key={trade.id} style={s.tradeCard}>
               <View style={s.tradeHeader}>
                  <View style={[s.statusBadge, { backgroundColor: isCompleted ? '#f0fdf4' : '#fef2f2' }]}>
                     {isCompleted ? (
                       <CheckCircle2 size={12} color="#16a34a" />
                     ) : (
                       <XCircle size={12} color="#ef4444" />
                     )}
                     <ThemedText style={[s.statusTxt, { color: isCompleted ? '#16a34a' : '#ef4444' }]}>
                       {trade.status}
                     </ThemedText>
                  </View>
                  <ThemedText style={s.dateTxt}>{trade.date}</ThemedText>
               </View>

               <View style={s.tradeBody}>
                  <View style={s.mainInfo}>
                     <View style={s.typeBadge}>
                        <Zap size={14} color="#22c55e" fill="#22c55e" />
                        <ThemedText style={s.typeTxt}>{trade.type}</ThemedText>
                     </View>
                     <ThemedText style={s.energyText}>{trade.energy}</ThemedText>
                  </View>
                  
                  <View style={s.priceInfo}>
                     <ThemedText style={s.priceVal}>{trade.price}</ThemedText>
                     <ThemedText style={s.priceSub}>Settle via Smart Contract</ThemedText>
                  </View>
               </View>

               <View style={s.divider} />

               <View style={s.tradeFooter}>
                  <View style={s.counterpartGroup}>
                    <ThemedText style={s.withTxt}>Counterparty:</ThemedText>
                    <ThemedText style={s.counterName}>{trade.counterpart}</ThemedText>
                  </View>
                  <Pressable style={({hovered}: any) => [s.detailsBtn, hovered && { backgroundColor: '#f1f5f9' }]}>
                     <FileText size={14} color="#22c55e" />
                     <ThemedText style={s.btnText}>View Receipt</ThemedText>
                  </Pressable>
               </View>
            </View>
          );
        })}
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

  content: { gap: 16 },
  tradeCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.05, shadowRadius: 10 },
  
  tradeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusTxt: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  dateTxt: { fontSize: 13, color: '#94a3b8' },

  tradeBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  mainInfo: { gap: 6 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeTxt: { fontSize: 13, fontWeight: '700', color: '#64748b', textTransform: 'capitalize' },
  energyText: { fontSize: 28, fontWeight: '900', color: '#0f172a' },
  
  priceInfo: { alignItems: 'flex-end', gap: 4 },
  priceVal: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  priceSub: { fontSize: 11, color: '#94a3b8' },

  divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 16 },

  tradeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counterpartGroup: { gap: 2 },
  withTxt: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  counterName: { fontSize: 13, color: '#0f172a', fontWeight: '700' },

  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  btnText: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
});
