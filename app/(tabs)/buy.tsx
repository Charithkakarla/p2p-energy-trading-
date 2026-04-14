import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, Zap, ShieldCheck, MapPin } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';
import { Card } from '../../components/Card';
import { TradeChatModal } from '../../components/TradeChatModal';
import { addTrade, useUserStore } from '../../constants/userStore';

const MOCK_LISTINGS = [
  { id: '1', seller: 'Home Solar A', energy: '45 kWh', price: '₹ 5.2/kWh', distance: '1.2 km', rating: '4.8', trustScore: 95, fulfillmentRate: '98%', disputeCount: 0, responseTime: '< 3 min' },
  { id: '2', seller: 'Green Office', energy: '120 kWh', price: '₹ 4.8/kWh', distance: '3.5 km', rating: '4.9', trustScore: 93, fulfillmentRate: '96%', disputeCount: 1, responseTime: '< 5 min' },
  { id: '3', seller: 'Rooftop Pro', energy: '22 kWh', price: '₹ 5.5/kWh', distance: '0.8 km', rating: '4.7', trustScore: 89, fulfillmentRate: '94%', disputeCount: 2, responseTime: '< 7 min' },
  { id: '4', seller: 'Eco Tower', energy: '200 kWh', price: '₹ 4.5/kWh', distance: '5.2 km', rating: '5.0', trustScore: 97, fulfillmentRate: '99%', disputeCount: 0, responseTime: '< 2 min' },
];

export default function BuyScreen() {
  const user = useUserStore();
  const [activeListing, setActiveListing] = useState<(typeof MOCK_LISTINGS)[number] | null>(null);
  const [tradeNotice, setTradeNotice] = useState<string | null>(null);
  const marketReference = `Rs ${user.market.livePricePerKwh.toFixed(2)}/kWh`;

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[1]}>
      <View style={styles.header}>
        <ThemedText type="title">Marketplace</ThemedText>
        <ThemedText style={styles.subtitle}>Find clean energy nearby</ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#999" />
          <TextInput 
            placeholder="Search sellers or locations..." 
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#000" />
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
          <ThemedText type="defaultSemiBold">32 Sellers available</ThemedText>
          <ThemedText style={styles.avgPrice}>Live: {marketReference}</ThemedText>
        </View>

        {MOCK_LISTINGS.map(item => (
          <Card key={item.id} style={styles.listingCard}>
            <View style={styles.listingHeader}>
              <View style={styles.sellerInfo}>
                <View style={styles.avatar}>
                   <Zap size={14} color="#fff" />
                </View>
                <View>
                  <ThemedText type="defaultSemiBold">{item.seller}</ThemedText>
                  <View style={styles.locationRow}>
                    <MapPin size={10} color="#666" />
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
                 <ThemedText type="small">Available Energy</ThemedText>
                 <ThemedText type="subtitle">{item.energy}</ThemedText>
               </View>
                <TouchableOpacity style={styles.buyButton} onPress={() => setActiveListing(item)}>
                  <ThemedText style={styles.buyText}>Chat with seller</ThemedText>
               </TouchableOpacity>
            </View>
            
            <View style={styles.listingFooter}>
               <View style={styles.badge}>
                  <ShieldCheck size={12} color="#000" />
                  <ThemedText type="small" style={{ fontWeight: '700' }}>Verified</ThemedText>
               </View>
               <ThemedText type="small">★ {item.rating}</ThemedText>
            </View>
          </Card>
        ))}
      </View>

      {activeListing && (
        <TradeChatModal
          visible={!!activeListing}
          counterpartName={activeListing.seller}
          counterpartRole="seller"
          askingPrice={activeListing.price}
          energyAmount={activeListing.energy}
          marketPrice={marketReference}
          onClose={() => setActiveListing(null)}
          onCompleteTrade={({ acceptedPrice, counterpartName }) => {
            addTrade({
              id: `tx-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              status: 'pending',
              energy: activeListing.energy,
              price: acceptedPrice,
              type: 'bought',
              counterpart: counterpartName,
            });
            setTradeNotice(`Locked ${acceptedPrice} with ${counterpartName}. You can finalize the blockchain settlement now.`);
            setActiveListing(null);
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  subtitle: {
    opacity: 0.6,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#666',
  },
  listingCard: {
    marginBottom: 16,
    padding: 16,
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
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  trustPill: { backgroundColor: '#eef2ff', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  trustPillText: { color: '#3730a3', fontWeight: '800', fontSize: 11 },
  priceValue: {
    fontWeight: '700',
    fontSize: 14,
  },
  listingBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buyButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buyText: {
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
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
