import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, Zap, ShieldCheck, MapPin } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';
import { Card } from '../../components/Card';
import { TradeChatModal } from '../../components/TradeChatModal';
import { addTrade, useUserStore } from '../../constants/userStore';

const BUYER_DEMAND = [
  { id: '1', buyer: 'Tech Park Block A', energy: '32 kWh', price: 'Rs 4.7/kWh', distance: '1.6 km', rating: '4.8', trustScore: 95, fulfillmentRate: '98%', disputeCount: 0, responseTime: '< 3 min' },
  { id: '2', buyer: 'Riverfront Residency', energy: '18 kWh', price: 'Rs 4.5/kWh', distance: '2.3 km', rating: '4.7', trustScore: 92, fulfillmentRate: '95%', disputeCount: 1, responseTime: '< 5 min' },
  { id: '3', buyer: 'Metro Towers', energy: '52 kWh', price: 'Rs 4.8/kWh', distance: '4.1 km', rating: '4.9', trustScore: 97, fulfillmentRate: '99%', disputeCount: 0, responseTime: '< 2 min' },
  { id: '4', buyer: 'Green County Homes', energy: '14 kWh', price: 'Rs 4.4/kWh', distance: '0.9 km', rating: '4.6', trustScore: 89, fulfillmentRate: '93%', disputeCount: 2, responseTime: '< 7 min' },
];

export default function SellScreen() {
  const user = useUserStore();
  const [activeDemand, setActiveDemand] = useState<(typeof BUYER_DEMAND)[number] | null>(null);
  const [tradeNotice, setTradeNotice] = useState<string | null>(null);
  const marketReference = `Rs ${user.market.livePricePerKwh.toFixed(2)}/kWh`;

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[1]}>
      <View style={styles.header}>
        <ThemedText type="title">Sell Marketplace</ThemedText>
        <ThemedText style={styles.subtitle}>Review buyer demand and lock a selling rate.</ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#7b8794" />
          <TextInput
            placeholder="Search buyers or areas..."
            style={styles.input}
            placeholderTextColor="#7b8794"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#334155" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tradeNotice && (
          <View style={styles.tradeNoticeCard}>
            <ThemedText type="defaultSemiBold">Trade update</ThemedText>
            <ThemedText style={styles.tradeNoticeText}>{tradeNotice}</ThemedText>
          </View>
        )}

        <View style={styles.statsRow}>
          <ThemedText type="defaultSemiBold">28 Buyer requests available</ThemedText>
          <ThemedText style={styles.avgPrice}>Live: {marketReference}</ThemedText>
        </View>

        {BUYER_DEMAND.map((item) => (
          <Card key={item.id} style={styles.listingCard}>
            <View style={styles.listingHeader}>
              <View style={styles.sellerInfo}>
                <View style={styles.avatar}>
                  <Zap size={14} color="#fff" />
                </View>
                <View>
                  <ThemedText type="defaultSemiBold">{item.buyer}</ThemedText>
                  <View style={styles.locationRow}>
                    <MapPin size={10} color="#64748b" />
                    <ThemedText type="small">{item.distance} away</ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.priceTag}>
                <ThemedText style={styles.priceValue}>{item.price}</ThemedText>
              </View>
            </View>

            <View style={styles.trustRow}>
              <View style={styles.trustPill}><ThemedText style={styles.trustPillText}>Trust {item.trustScore}</ThemedText></View>
              <View style={styles.trustPill}><ThemedText style={styles.trustPillText}>{item.fulfillmentRate} fill</ThemedText></View>
              <View style={styles.trustPill}><ThemedText style={styles.trustPillText}>{item.disputeCount} disputes</ThemedText></View>
              <View style={styles.trustPill}><ThemedText style={styles.trustPillText}>{item.responseTime}</ThemedText></View>
            </View>

            <View style={styles.listingBody}>
              <View>
                <ThemedText type="small">Requested Energy</ThemedText>
                <ThemedText type="subtitle">{item.energy}</ThemedText>
              </View>
              <TouchableOpacity style={styles.sellButton} onPress={() => setActiveDemand(item)}>
                <ThemedText style={styles.sellText}>Chat with buyer</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.listingFooter}>
              <View style={styles.badge}>
                <ShieldCheck size={12} color="#0f172a" />
                <ThemedText type="small" style={{ fontWeight: '700' }}>Verified</ThemedText>
              </View>
              <ThemedText type="small">★ {item.rating}</ThemedText>
            </View>
          </Card>
        ))}
      </View>

      {activeDemand && (
        <TradeChatModal
          visible={!!activeDemand}
          counterpartName={activeDemand.buyer}
          counterpartRole="buyer"
          askingPrice={activeDemand.price}
          energyAmount={activeDemand.energy}
          marketPrice={marketReference}
          onClose={() => setActiveDemand(null)}
          onCompleteTrade={({ acceptedPrice, counterpartName }) => {
            addTrade({
              id: `tx-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              status: 'pending',
              energy: activeDemand.energy,
              price: acceptedPrice,
              type: 'sold',
              counterpart: counterpartName,
            });
            setTradeNotice(`Locked ${acceptedPrice} with ${counterpartName}. Settlement can now be recorded on-chain.`);
            setActiveDemand(null);
          }}
        />
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  subtitle: {
    opacity: 0.75,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f4f6f8',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#dbe1e8',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe1e8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
  },
  tradeNoticeCard: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 16, padding: 14, marginBottom: 16 },
  tradeNoticeText: { marginTop: 4, color: '#166534', lineHeight: 20 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  avgPrice: {
    fontSize: 13,
    color: '#64748b',
  },
  listingCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbe1e8',
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sellerInfo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceTag: {
    backgroundColor: '#eef2f7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  trustPill: { backgroundColor: '#eef2f7', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  trustPillText: { color: '#334155', fontWeight: '700', fontSize: 11 },
  priceValue: {
    fontWeight: '700',
    fontSize: 14,
    color: '#0f172a',
  },
  listingBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },
  sellButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sellText: {
    color: '#fff',
    fontWeight: '700',
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
