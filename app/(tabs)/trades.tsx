import React, { useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Pressable, Modal } from 'react-native';
import { CheckCircle2, XCircle, Clock3, Zap, FileText, Filter } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';
import { BlockchainPaymentModal } from '../../components/BlockchainPaymentModal';
import { finalizeTradeSettlement, type TradeItem, useUserStore } from '../../constants/userStore';

const FILTERS = ['all', 'sold', 'bought'] as const;
type TradeFilter = (typeof FILTERS)[number];

export default function TradesScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 880;
  const isPhone = width < 640;
  const user = useUserStore();
  const [activeFilter, setActiveFilter] = useState<TradeFilter>('all');
  const [activePaymentTrade, setActivePaymentTrade] = useState<(typeof user.trades)[number] | null>(null);
  const [detailTrade, setDetailTrade] = useState<TradeItem | null>(null);

  const filteredTrades = useMemo(() => {
    if (activeFilter === 'all') {
      return user.trades;
    }
    return user.trades.filter((trade) => trade.type === activeFilter);
  }, [activeFilter, user.trades]);

  const stats = useMemo(() => {
    const completed = user.trades.filter((trade) => trade.status === 'completed').length;
    const pending = user.trades.filter((trade) => trade.status === 'pending').length;
    const cancelled = user.trades.filter((trade) => trade.status === 'cancelled').length;
    return { completed, pending, cancelled };
  }, [user.trades]);

  return (
    <ScrollView style={s.container} contentContainerStyle={[styles.scrollContent, isPhone && { paddingBottom: 130 }]} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <ThemedText style={s.title}>Trade Ledger</ThemedText>
        <ThemedText style={s.subtitle}>{user.profile.name}, here are your verified peer-to-peer energy transactions.</ThemedText>
      </View>

      <View style={s.bannerCard}>
        <ThemedText style={s.bannerTitle}>Pending payment flow</ThemedText>
        <ThemedText style={s.bannerText}>Tap any trade with a pending symbol to open blockchain settlement. Once confirmed, the ledger updates to completed automatically.</ThemedText>
      </View>

      <View style={[s.kpiRow, !isWide && { flexDirection: 'column' }]}> 
        <KpiCard label="Completed" value={stats.completed} color="#16a34a" />
        <KpiCard label="Pending" value={stats.pending} color="#eab308" />
        <KpiCard label="Cancelled" value={stats.cancelled} color="#ef4444" />
      </View>

      <View style={s.filterWrap}>
        <View style={s.filterHead}>
          <Filter size={14} color="#64748b" />
          <ThemedText style={s.filterTitle}>Trade Type</ThemedText>
        </View>
        <View style={s.filterRow}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable key={filter} onPress={() => setActiveFilter(filter)} style={[s.filterChip, isActive && s.filterChipActive]}>
                <ThemedText style={[s.filterChipTxt, isActive && s.filterChipTxtActive]}>{filter.toUpperCase()}</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[s.content, isWide && s.contentWide]}> 
        {filteredTrades.map((trade) => {
          const isCompleted = trade.status === 'completed';
          const isCancelled = trade.status === 'cancelled';
          const isPending = trade.status === 'pending';

          return (
            <Pressable
              key={trade.id}
              disabled={!isPending}
              onPress={() => setActivePaymentTrade(trade)}
              style={({ pressed }: any) => [s.tradeCard, isWide && s.tradeCardWide, isPending && s.pendingCard, pressed && isPending && s.tradeCardPressed]}
            >
              <View style={s.tradeHeader}>
                <View style={[s.statusBadge, { backgroundColor: isCompleted ? '#f0fdf4' : isCancelled ? '#fef2f2' : '#fffbeb' }]}> 
                  {isCompleted ? (
                    <CheckCircle2 size={12} color="#16a34a" />
                  ) : isCancelled ? (
                    <XCircle size={12} color="#ef4444" />
                  ) : (
                    <Clock3 size={12} color="#eab308" />
                  )}
                  <ThemedText style={[s.statusTxt, { color: isCompleted ? '#16a34a' : isCancelled ? '#ef4444' : '#a16207' }]}>
                    {trade.status}
                  </ThemedText>
                </View>
                <ThemedText style={s.dateTxt}>{trade.date}</ThemedText>
              </View>

              {isPending && (
                <View style={s.pendingStrip}>
                  <Clock3 size={12} color="#a16207" />
                  <ThemedText style={s.pendingStripText}>Blockchain payment pending</ThemedText>
                </View>
              )}

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
                <Pressable
                  disabled={false}
                  onPress={() => {
                    setDetailTrade(trade);
                  }}
                  style={({ hovered }: any) => [
                    s.detailsBtn,
                    hovered && { backgroundColor: '#f1f5f9' },
                  ]}
                > 
                  <FileText size={14} color="#22c55e" />
                  <ThemedText style={s.btnText}>View details</ThemedText>
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </View>

      <BlockchainPaymentModal
        visible={!!activePaymentTrade}
        trade={activePaymentTrade}
        onClose={() => setActivePaymentTrade(null)}
        onComplete={(tradeId, settlementHash) => {
          finalizeTradeSettlement(tradeId, settlementHash);
          setActivePaymentTrade(null);
        }}
      />

      <Modal visible={!!detailTrade} animationType="slide" transparent onRequestClose={() => setDetailTrade(null)}>
        <View style={s.detailBackdrop}>
          <View style={s.detailSheet}>
            <View style={s.detailHeader}>
              <View>
                <ThemedText style={s.detailTitle}>Trade details</ThemedText>
                <ThemedText style={s.detailSub}>Settlement proof and negotiation transcript for trust and audit.</ThemedText>
              </View>
              <Pressable onPress={() => setDetailTrade(null)} style={s.detailCloseBtn}>
                <ThemedText style={s.detailCloseTxt}>Close</ThemedText>
              </Pressable>
            </View>

            {detailTrade && (
              <View style={s.detailCard}>
                <DetailRow label="Status" value={detailTrade.status} />
                <DetailRow label="Date" value={detailTrade.date} />
                <DetailRow label="Type" value={detailTrade.type} />
                <DetailRow label="Energy" value={detailTrade.energy} />
                <DetailRow label="Price" value={detailTrade.price} />
                <DetailRow label="Counterparty" value={detailTrade.counterpart} />
                <DetailRow label="Deal locked at" value={detailTrade.dealLockedAt || 'Not available'} />
                <DetailRow label="Negotiation source" value={detailTrade.negotiationSource || 'Not available'} />
                <DetailRow label="Network" value={detailTrade.settlementNetwork || 'Not available'} />
                <DetailRow label="Settlement hash" value={detailTrade.settlementHash || 'Not available'} />
                <DetailRow label="Confirmed at" value={detailTrade.paymentConfirmedAt || 'Not available'} />
                <View style={s.detailSeparator} />
                <ThemedText style={s.detailSectionTitle}>Negotiation transcript</ThemedText>
                {detailTrade.chatTranscript && detailTrade.chatTranscript.length > 0 ? (
                  <View style={s.transcriptWrap}>
                    {detailTrade.chatTranscript.map((entry, index) => (
                      <View
                        key={`${detailTrade.id}-msg-${index}`}
                        style={[s.transcriptRow, entry.sender === 'you' ? s.transcriptYou : s.transcriptCounterparty]}
                      >
                        <ThemedText style={s.transcriptSender}>{entry.sender === 'you' ? 'You' : 'Counterparty'}</ThemedText>
                        <ThemedText style={s.transcriptText}>{entry.text}</ThemedText>
                        <ThemedText style={s.transcriptTime}>{entry.at}</ThemedText>
                      </View>
                    ))}
                  </View>
                ) : (
                  <ThemedText style={s.detailNote}>No transcript saved for this trade.</ThemedText>
                )}

                <View style={s.detailSeparator} />
                <ThemedText style={s.detailNote}>
                  Proof checklist: negotiation record, trade amount, counterpart, settlement network, transaction hash, and confirmation timestamp.
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function KpiCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={s.kpiCard}>
      <ThemedText style={s.kpiLabel}>{label}</ThemedText>
      <ThemedText style={[s.kpiValue, { color }]}>{value}</ThemedText>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.detailRow}>
      <ThemedText style={s.detailLabel}>{label}</ThemedText>
      <ThemedText style={s.detailValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 100 },
});

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20 },
  header: { marginBottom: 20, marginTop: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748b' },
  bannerCard: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#dbeafe', borderRadius: 16, padding: 14, marginBottom: 16 },
  bannerTitle: { fontSize: 14, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
  bannerText: { fontSize: 12, color: '#475569', lineHeight: 18 },

  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  kpiCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb', padding: 14 },
  kpiLabel: { fontSize: 12, color: '#64748b' },
  kpiValue: { fontSize: 22, fontWeight: '900', marginTop: 4 },

  filterWrap: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 12, marginBottom: 16 },
  filterHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  filterTitle: { fontSize: 12, color: '#64748b', fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  filterChip: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  filterChipActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  filterChipTxt: { fontSize: 11, color: '#334155', fontWeight: '700' },
  filterChipTxtActive: { color: '#fff' },

  content: { gap: 12 },
  contentWide: { maxWidth: 980, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tradeCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  tradeCardWide: { width: '49%' },
  pendingCard: { borderColor: '#f59e0b', shadowOpacity: 0.08 },
  tradeCardPressed: { transform: [{ scale: 0.99 }] },

  tradeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusTxt: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  dateTxt: { fontSize: 12, color: '#94a3b8' },

  tradeBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  mainInfo: { gap: 4 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeTxt: { fontSize: 13, fontWeight: '700', color: '#64748b', textTransform: 'capitalize' },
  energyText: { fontSize: 24, fontWeight: '900', color: '#0f172a' },

  priceInfo: { alignItems: 'flex-end', gap: 4 },
  priceVal: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  priceSub: { fontSize: 10, color: '#94a3b8' },

  divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 14 },
  pendingStrip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fffbeb', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 12 },
  pendingStripText: { fontSize: 12, fontWeight: '800', color: '#a16207' },

  tradeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counterpartGroup: { gap: 2 },
  withTxt: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  counterName: { fontSize: 13, color: '#0f172a', fontWeight: '700' },

  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  detailsBtnDisabled: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' },
  btnText: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  btnTextDisabled: { color: '#94a3b8' },

  detailBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.55)', justifyContent: 'flex-end' },
  detailSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, minHeight: 340 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  detailTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  detailSub: { fontSize: 12, color: '#64748b', marginTop: 4 },
  detailCloseBtn: { backgroundColor: '#f8fafc', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  detailCloseTxt: { color: '#334155', fontWeight: '800' },
  detailCard: { backgroundColor: '#f8fafc', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eef2f7' },
  detailLabel: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  detailValue: { color: '#0f172a', fontSize: 13, fontWeight: '800' },
  detailSeparator: { height: 1, backgroundColor: '#e2e8f0', marginTop: 8, marginBottom: 8 },
  detailSectionTitle: { color: '#0f172a', fontSize: 13, fontWeight: '900', marginBottom: 8 },
  transcriptWrap: { gap: 8 },
  transcriptRow: { borderRadius: 12, padding: 10, borderWidth: 1 },
  transcriptYou: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  transcriptCounterparty: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' },
  transcriptSender: { fontSize: 11, fontWeight: '800', color: '#334155', marginBottom: 4 },
  transcriptText: { fontSize: 12, color: '#0f172a', lineHeight: 18 },
  transcriptTime: { marginTop: 6, fontSize: 10, color: '#64748b' },
  detailNote: { color: '#334155', fontSize: 12, lineHeight: 18 },
});
