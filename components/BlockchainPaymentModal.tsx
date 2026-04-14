import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { CheckCircle2, Clock3, Layers3, ShieldCheck, ArrowRight, Wallet2, Activity } from 'lucide-react-native';
import { ThemedText } from './ThemedText';
import type { TradeItem } from '../constants/userStore';

type PaymentStage = 'review' | 'broadcasting' | 'confirming' | 'complete';

type BlockchainPaymentModalProps = {
  visible: boolean;
  trade: TradeItem | null;
  onClose: () => void;
  onComplete: (tradeId: string, settlementHash: string) => void;
};

export function BlockchainPaymentModal({ visible, trade, onClose, onComplete }: BlockchainPaymentModalProps) {
  const [stage, setStage] = useState<PaymentStage>('review');

  useEffect(() => {
    if (!visible) {
      setStage('review');
      return;
    }

    setStage('review');
  }, [visible, trade?.id]);

  const fakeHash = useMemo(() => {
    if (!trade) {
      return '0x0000000000000000';
    }
    return `0x${trade.id.replace(/[^a-z0-9]/gi, '').slice(0, 12).padEnd(12, '0')}`;
  }, [trade]);

  useEffect(() => {
    if (!visible || stage !== 'broadcasting') {
      return undefined;
    }

    const confirmingTimer = setTimeout(() => setStage('confirming'), 1200);

    return () => {
      clearTimeout(confirmingTimer);
    };
  }, [stage, visible]);

  useEffect(() => {
    if (!visible || stage !== 'confirming') {
      return undefined;
    }

    const completeTimer = setTimeout(() => setStage('complete'), 1200);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [stage, visible]);

  const handleStartPayment = () => {
    setStage('broadcasting');
  };

  const handleFinalize = () => {
    if (!trade) {
      return;
    }
    onComplete(trade.id, fakeHash);
  };

  if (!trade) {
    return null;
  }

  const stageIndex = stage === 'review' ? 0 : stage === 'broadcasting' ? 1 : stage === 'confirming' ? 2 : 3;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrap}>
          <View style={styles.header}>
            <View>
              <ThemedText type="title">Blockchain payment</ThemedText>
              <ThemedText style={styles.subtitle}>Settle the pending trade on-chain and update the ledger when confirmed.</ThemedText>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <ThemedText style={styles.closeTxt}>Close</ThemedText>
            </Pressable>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Wallet2 size={16} color="#2563eb" />
              <ThemedText style={styles.summaryLabel}>Trade amount</ThemedText>
            </View>
            <ThemedText style={styles.summaryValue}>{trade.price}</ThemedText>
            <ThemedText style={styles.summaryMeta}>{trade.energy} with {trade.counterpart}</ThemedText>
          </View>

          <View style={styles.stepsCard}>
            {[
              { title: 'Lock funds in escrow', text: 'Buyer payment is reserved before release.', icon: <Layers3 size={16} color="#2563eb" /> },
              { title: 'Broadcast transaction', text: 'The network receives the signed settlement request.', icon: <Activity size={16} color="#a855f7" /> },
              { title: 'Wait for confirmations', text: 'Validators confirm the transaction in the chain.', icon: <Clock3 size={16} color="#d97706" /> },
              { title: 'Release payment', text: 'The contract marks the trade as complete.', icon: <CheckCircle2 size={16} color="#16a34a" /> },
            ].map((step, index) => {
              const isActive = index === stageIndex;
              const isDone = index < stageIndex || stage === 'complete';
              return (
                <View key={step.title} style={[styles.stepRow, isActive && styles.stepRowActive]}>
                  <View style={[styles.stepIcon, isDone && styles.stepIconDone, isActive && styles.stepIconActive]}>{step.icon}</View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.stepTitle}>{step.title}</ThemedText>
                    <ThemedText style={styles.stepText}>{step.text}</ThemedText>
                  </View>
                  {isDone ? <CheckCircle2 size={16} color="#16a34a" /> : isActive ? <Clock3 size={16} color="#2563eb" /> : <ArrowRight size={16} color="#cbd5e1" />}
                </View>
              );
            })}
          </View>

          <View style={styles.hashCard}>
            <View style={styles.hashRow}>
              <ShieldCheck size={14} color="#16a34a" />
              <ThemedText style={styles.hashLabel}>Settlement reference</ThemedText>
            </View>
            <ThemedText style={styles.hashValue}>{fakeHash}</ThemedText>
            <ThemedText style={styles.hashText}>
              {stage === 'review' && 'Review the pending trade, then start the blockchain payment.'}
              {stage === 'broadcasting' && 'Broadcasting signed settlement to the network.'}
              {stage === 'confirming' && 'Waiting for confirmations from the chain.'}
              {stage === 'complete' && 'Payment complete. The trade can now be marked as completed.'}
            </ThemedText>
          </View>

          <View style={styles.footer}>
            {stage !== 'complete' ? (
              <Pressable onPress={handleStartPayment} style={styles.primaryBtn} disabled={stage !== 'review'}>
                <ThemedText style={styles.primaryTxt}>{stage === 'review' ? 'Start blockchain payment' : 'Processing payment...'}</ThemedText>
              </Pressable>
            ) : (
              <Pressable onPress={handleFinalize} style={styles.primaryBtn}>
                <CheckCircle2 size={16} color="#fff" />
                <ThemedText style={styles.primaryTxt}>Mark payment complete</ThemedText>
              </Pressable>
            )}
            <Pressable onPress={onClose} style={styles.secondaryBtn}>
              <ThemedText style={styles.secondaryTxt}>Back to trades</ThemedText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  wrap: { flex: 1, padding: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  subtitle: { marginTop: 6, color: '#64748b', lineHeight: 20, fontSize: 14 },
  closeBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  closeTxt: { fontWeight: '800', color: '#334155' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#dbeafe', padding: 16, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  summaryLabel: { color: '#334155', fontWeight: '800' },
  summaryValue: { fontSize: 30, fontWeight: '900', color: '#0f172a' },
  summaryMeta: { fontSize: 13, color: '#64748b', marginTop: 4 },
  stepsCard: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, gap: 10, marginBottom: 14 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 14 },
  stepRowActive: { backgroundColor: '#eff6ff' },
  stepIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  stepIconDone: { backgroundColor: '#ecfdf5', borderColor: '#bbf7d0' },
  stepIconActive: { backgroundColor: '#dbeafe', borderColor: '#93c5fd' },
  stepTitle: { fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  stepText: { fontSize: 12, color: '#64748b', lineHeight: 17 },
  hashCard: { backgroundColor: '#0f172a', borderRadius: 18, padding: 16, marginBottom: 16 },
  hashRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  hashLabel: { color: '#cbd5e1', fontWeight: '800' },
  hashValue: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  hashText: { color: '#cbd5e1', marginTop: 6, lineHeight: 20 },
  footer: { gap: 10, marginTop: 'auto' },
  primaryBtn: { minHeight: 52, borderRadius: 14, backgroundColor: '#2563eb', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryTxt: { color: '#fff', fontWeight: '900' },
  secondaryBtn: { minHeight: 52, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
  secondaryTxt: { color: '#334155', fontWeight: '800' },
});