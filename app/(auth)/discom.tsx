import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, useWindowDimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search, Zap, Link } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';

const DISCOMS = [
  { id: 1, name: 'BSES Rajdhani Power Limited', region: 'Delhi' },
  { id: 2, name: 'BSES Yamuna Power Limited', region: 'Delhi' },
  { id: 3, name: 'Tata Power Delhi Distribution Limited', region: 'Delhi' },
  { id: 4, name: 'Pashchimanchal Vidyut Vitran Nigam Limited', region: 'Uttar Pradesh' },
  { id: 5, name: 'APEPDCL', region: 'Andhra Pradesh Eastern Power Distribution' },
  { id: 6, name: 'Assam Power Distribution Company Limited', region: 'Assam' },
  { id: 7, name: 'New Delhi Municipal Council', region: 'Delhi' },
  { id: 8, name: 'Brihanmumbai Electric Supply and Transport (BEST)', region: 'Maharashtra' },
  { id: 9, name: 'Adani Electricity Mumbai Limited', region: 'Maharashtra' },
  { id: 10, name: 'Tata Power Mumbai', region: 'Maharashtra' },
  { id: 11, name: 'Bangalore Electricity Supply Company (BESCOM)', region: 'Karnataka' },
  { id: 12, name: 'Chamundeshwari Electricity Supply Corporation (CESC)', region: 'Karnataka' },
  { id: 13, name: 'Tamil Nadu Generation and Distribution Corp (TANGEDCO)', region: 'Tamil Nadu' },
  { id: 14, name: 'Kerala State Electricity Board (KSEB)', region: 'Kerala' },
  { id: 15, name: 'Jaipur Vidyut Vitran Nigam Limited (JVVNL)', region: 'Rajasthan' },
  { id: 16, name: 'Ajmer Vidyut Vitran Nigam Limited (AVVNL)', region: 'Rajasthan' },
  { id: 17, name: 'Dakshin Gujarat Vij Company Limited (DGVCL)', region: 'Gujarat' },
  { id: 18, name: 'Madhya Kshetra Vidyut Vitaran Company Limited (MPMKVVCL)', region: 'Madhya Pradesh' },
  { id: 19, name: 'West Bengal State Electricity Distribution Company (WBSEDCL)', region: 'West Bengal' },
  { id: 20, name: 'CESC Limited', region: 'Kolkata, West Bengal' },
  { id: 21, name: 'Punjab State Power Corporation Limited (PSPCL)', region: 'Punjab' },
  { id: 22, name: 'Dakshin Haryana Bijli Vitran Nigam (DHBVN)', region: 'Haryana' },
];

export default function DiscomScreen() {
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  
  const filtered = DISCOMS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.region.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <ArrowLeft size={20} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <ThemedText style={s.headerTitle}>Select DISCOM</ThemedText>
            <ThemedText style={s.headerSub}>Link your energy distributor node</ThemedText>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
          <ThemedText style={s.skipTxt}>Skip</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={s.searchWrap}>
        <View style={s.searchContainer}>
          <Search size={18} color="#94a3b8" />
          <TextInput
            style={s.searchInput}
            placeholder="Search provider..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {filtered.map(d => {
          const isSelected = selected === d.id;
          return (
            <TouchableOpacity key={d.id} style={[s.card, isSelected && s.cardActive]} onPress={() => setSelected(d.id)}>
              <View style={[s.iconBox, isSelected && { backgroundColor: '#f0fdf4', borderColor: '#22c55e' }]}>
                <Zap size={16} color={isSelected ? "#22c55e" : "#64748b"} />
              </View>
              <View style={s.cardTextGroup}>
                <ThemedText style={s.cardTitle}>{d.name}</ThemedText>
                <ThemedText style={s.cardRegion}>{d.region}</ThemedText>
              </View>
              {/* Radio Circle */}
              <View style={[s.radio, isSelected && s.radioSelected]} />
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Proceed Button */}
      <View style={s.bottomWrap}>
        <TouchableOpacity 
          style={[s.proceedBtn, !selected && { opacity: 0.5 }]} 
          disabled={!selected}
          onPress={() => router.push('/(tabs)/home')}
        >
          <Link size={16} color="#fff" />
          <ThemedText style={s.proceedTxt}>Link Provider</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s: any = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  headerSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  skipTxt: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  searchWrap: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14, height: 46, gap: 10 },
  searchInput: { flex: 1, height: '100%', fontSize: 15, color: '#0f172a', outlineStyle: 'none' },
  list: { padding: 20, alignItems: 'center', gap: 14 },
  card: { width: '100%', maxWidth: 640, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5 },
  cardActive: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardTextGroup: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  cardRegion: { fontSize: 11, color: '#64748b' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#cbd5e1', marginLeft: 16 },
  radioSelected: { borderColor: '#22c55e', borderWidth: 6 },
  bottomWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center' },
  proceedBtn: { width: '100%', maxWidth: 500, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 12, backgroundColor: '#22c55e', gap: 8 },
  proceedTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
