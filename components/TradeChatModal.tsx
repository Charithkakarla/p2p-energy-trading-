import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowRight, CheckCircle2, Send, ShieldCheck, Zap } from 'lucide-react-native';
import { ThemedText } from './ThemedText';
import { requestNegotiationTurn } from '../services/grokNegotiation';

type ChatMessage = {
  id: string;
  sender: 'you' | 'seller';
  text: string;
};

type StoredChatEntry = {
  sender: 'you' | 'seller';
  text: string;
  at: string;
};

type TradeChatModalProps = {
  visible: boolean;
  counterpartName: string;
  counterpartRole: 'seller' | 'buyer';
  askingPrice: string;
  energyAmount: string;
  marketPrice: string;
  onClose: () => void;
  onCompleteTrade: (summary: {
    acceptedPrice: string;
    counterpartName: string;
    negotiationSource: 'xai' | 'fallback' | 'manual';
    transcript: StoredChatEntry[];
  }) => void;
};

function makeMessage(sender: ChatMessage['sender'], text: string): ChatMessage {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sender,
    text,
  };
}

function toStoredTranscript(messages: ChatMessage[]): StoredChatEntry[] {
  return messages.map((entry) => ({
    sender: entry.sender,
    text: entry.text,
    at: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}

export function TradeChatModal({
  visible,
  counterpartName,
  counterpartRole,
  askingPrice,
  energyAmount,
  marketPrice,
  onClose,
  onCompleteTrade,
}: TradeChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [acceptedPrice, setAcceptedPrice] = useState(askingPrice);
  const [isSending, setIsSending] = useState(false);
  const [isFinalizingDeal, setIsFinalizingDeal] = useState(false);

  const roleLabel = counterpartRole === 'seller' ? 'seller' : 'buyer';
  const quickReplies = useMemo(
    () => [
      counterpartRole === 'seller'
        ? `Can you match ${marketPrice}?`
        : `I can sell at ${askingPrice} if you confirm now.`,
      counterpartRole === 'seller'
        ? `I can buy ${energyAmount} if you hold the rate for 10 minutes.`
        : `I can provide ${energyAmount} with immediate settlement.`,
      `Would you accept ${askingPrice} for a quick close?`,
    ],
    [askingPrice, counterpartRole, energyAmount, marketPrice]
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    setMessages([
      makeMessage('seller', `Hi, I’m ${counterpartName}. The current asking price is ${askingPrice}.`),
      makeMessage('seller', `We have ${energyAmount} available and can settle after we agree on the rate.`),
    ]);
    setDraft('');
    setAcceptedPrice(askingPrice);
    setIsSending(false);
    setIsFinalizingDeal(false);
  }, [askingPrice, counterpartName, energyAmount, visible]);

  const appendMessage = (text: string, sender: ChatMessage['sender']) => {
    setMessages((current) => [...current, makeMessage(sender, text)]);
  };

  const handleSend = async () => {
    const nextText = draft.trim();
    if (!nextText || isSending || isFinalizingDeal) {
      return;
    }

    const nextHistory = [...messages, makeMessage('you', nextText)];
    setMessages(nextHistory);
    setDraft('');
    setIsSending(true);

    const turn = await requestNegotiationTurn({
      counterpartName,
      counterpartRole,
      askingPrice,
      energyAmount,
      marketPrice,
      history: nextHistory,
      userMessage: nextText,
    });

    setIsSending(false);
    const assistantMessage = makeMessage('seller', turn.assistantReply);
    setMessages((current) => [...current, assistantMessage]);
    setAcceptedPrice(turn.acceptedPrice || askingPrice);

    if (turn.acceptDeal) {
      setIsFinalizingDeal(true);
      const finalMessage = makeMessage(
        'seller',
        `Deal accepted at ${turn.acceptedPrice || askingPrice}. Initiating blockchain settlement.`,
      );
      const finalHistory = [...nextHistory, assistantMessage, finalMessage];
      setMessages((current) => [...current, finalMessage]);
      onCompleteTrade({
        acceptedPrice: turn.acceptedPrice || askingPrice,
        counterpartName,
        negotiationSource: turn.source,
        transcript: toStoredTranscript(finalHistory),
      });
    }
  };

  const handleQuickReply = (reply: string) => {
    setDraft(reply);
  };

  const handleAcceptAndBuy = () => {
    if (isFinalizingDeal) {
      return;
    }
    setIsFinalizingDeal(true);
    const manualAcceptMsg = makeMessage('seller', `Accepted at ${acceptedPrice}. Initiating blockchain settlement.`);
    const transcriptHistory = [...messages, manualAcceptMsg];
    setMessages((current) => [...current, manualAcceptMsg]);
    onCompleteTrade({
      acceptedPrice,
      counterpartName,
      negotiationSource: 'manual',
      transcript: toStoredTranscript(transcriptHistory),
    });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View>
                <View style={styles.titleRow}>
                  <View style={styles.avatar}>
                    <Zap size={14} color="#fff" />
                  </View>
                  <View>
                    <ThemedText type="defaultSemiBold">Chat with {counterpartName}</ThemedText>
                    <ThemedText type="small">Negotiating with a verified {roleLabel}</ThemedText>
                  </View>
                </View>
              </View>

              <Pressable onPress={onClose} style={styles.closeBtn}>
                <ThemedText style={styles.closeTxt}>Close</ThemedText>
              </Pressable>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <ShieldCheck size={14} color="#16a34a" />
                <ThemedText type="small" style={styles.summaryText}>Blockchain-ready settlement</ThemedText>
              </View>
              <ThemedText style={styles.summaryValue}>{acceptedPrice}</ThemedText>
              <ThemedText type="small">Market reference: {marketPrice} | Energy: {energyAmount}</ThemedText>
            </View>

            <View style={styles.flowCard}>
              <ThemedText type="defaultSemiBold">Trade flow</ThemedText>
              <ThemedText type="small" style={styles.flowText}>1. Negotiate the rate. 2. Lock the price. 3. Move the trade to pending settlement. 4. Finish payment on-chain from the Trades tab.</ThemedText>
            </View>

            <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
              {messages.map((message) => (
                <View key={message.id} style={[styles.bubble, message.sender === 'you' ? styles.youBubble : styles.sellerBubble]}>
                  <ThemedText style={[styles.bubbleText, message.sender === 'you' ? styles.youText : styles.sellerText]}>{message.text}</ThemedText>
                </View>
              ))}
            </ScrollView>

            <View style={styles.quickRow}>
              {quickReplies.map((reply) => (
                <Pressable key={reply} onPress={() => handleQuickReply(reply)} style={styles.quickChip}>
                  <ThemedText type="small" style={styles.quickChipText}>{reply}</ThemedText>
                </Pressable>
              ))}
            </View>

            <View style={styles.composer}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Type a rate or counter-offer..."
                placeholderTextColor="#94a3b8"
                style={styles.input}
                multiline
                editable={!isSending && !isFinalizingDeal}
              />
              <Pressable
                onPress={handleSend}
                style={[styles.sendBtn, (isSending || isFinalizingDeal) && styles.sendBtnDisabled]}
                disabled={isSending || isFinalizingDeal}
              >
                <Send size={16} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.footerActions}>
              <Pressable
                onPress={handleAcceptAndBuy}
                style={[styles.buyBtn, isFinalizingDeal && styles.buyBtnDisabled]}
                disabled={isFinalizingDeal}
              >
                <CheckCircle2 size={16} color="#fff" />
                <ThemedText style={styles.buyTxt}>{isFinalizingDeal ? 'Finalizing deal...' : 'Lock price and buy'}</ThemedText>
              </Pressable>
              <Pressable onPress={onClose} style={styles.secondaryBtn}>
                <ArrowRight size={16} color="#334155" />
                <ThemedText style={styles.secondaryTxt}>Keep negotiating</ThemedText>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  sheetWrap: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  closeTxt: {
    fontWeight: '700',
    color: '#334155',
  },
  summaryCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 12,
  },
  flowCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  flowText: {
    marginTop: 4,
    color: '#475569',
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  summaryText: {
    color: '#166534',
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
  },
  messages: {
    flex: 1,
    marginBottom: 12,
  },
  messagesContent: {
    gap: 10,
    paddingVertical: 4,
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  youBubble: {
    backgroundColor: '#0f172a',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  sellerBubble: {
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    lineHeight: 20,
  },
  youText: {
    color: '#fff',
  },
  sellerText: {
    color: '#0f172a',
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  quickChip: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quickChipText: {
    color: '#334155',
  },
  composer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 96,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  footerActions: {
    gap: 10,
    marginBottom: 10,
  },
  buyBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buyTxt: {
    color: '#fff',
    fontWeight: '800',
  },
  buyBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  secondaryBtn: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryTxt: {
    color: '#334155',
    fontWeight: '700',
  },
});