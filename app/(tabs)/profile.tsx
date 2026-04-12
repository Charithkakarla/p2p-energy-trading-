import React from 'react';
import { StyleSheet, ScrollView, View, Pressable, Switch, useWindowDimensions } from 'react-native';
import { User, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, Zap, MapPin, ShieldCheck } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 800;
  const [isAutoSell, setIsAutoSell] = React.useState(true);

  return (
    <ScrollView style={s.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <ThemedText style={s.title}>Settings</ThemedText>
        <ThemedText style={s.subtitle}>Personal identity & grid preferences.</ThemedText>
      </View>

      <View style={[s.userSection, isWide && { flexDirection: 'row', alignItems: 'center', gap: 32, backgroundColor: '#fff', padding: 32, borderRadius: 24, borderWidth: 1, borderColor: '#e5e7eb' }]}>
        <View style={s.avatarLarge}>
           <User size={44} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={s.userName}>Kakarla Charith</ThemedText>
          <ThemedText style={s.userEmail}>charith.k@yagami.energy</ThemedText>
          <View style={s.badgeRow}>
             <View style={s.badge}>
                <MapPin size={12} color="#64748b" />
                <ThemedText style={s.badgeTxt}>Hyderabad, TS</ThemedText>
             </View>
             <View style={[s.badge, { backgroundColor: '#f0fdf4' }]}>
                <ShieldCheck size={12} color="#16a34a" />
                <ThemedText style={[s.badgeTxt, { color: '#16a34a' }]}>Verified Node</ThemedText>
             </View>
          </View>
        </View>
      </View>

      <View style={s.section}>
        <ThemedText style={s.sectionTitle}>Smart Grid Control</ThemedText>
        <View style={s.preferenceCard}>
          <View style={s.settingsRow}>
             <View style={s.settingLabelGroup}>
                <View style={[s.settingIcon, { backgroundColor: '#f0fdf4' }]}><Zap size={18} color="#22c55e" /></View>
                <View>
                  <ThemedText style={s.settingTitle}>Auto-sell surplus</ThemedText>
                  <ThemedText style={s.settingSub}>Sell excess solar units automatically.</ThemedText>
                </View>
             </View>
             <Switch 
              value={isAutoSell} 
              onValueChange={setIsAutoSell}
              trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
              thumbColor={'#fff'}
             />
          </View>
        </View>
      </View>

      <View style={s.section}>
        <ThemedText style={s.sectionTitle}>Account & Privacy</ThemedText>
        <View style={s.menuList}>
           <MenuItem icon={<Settings size={18} color="#64748b" />} label="General Preferences" />
           <MenuItem icon={<Shield size={18} color="#64748b" />} label="Security & Private Keys" />
           <MenuItem icon={<Bell size={18} color="#64748b" />} label="Market Notifications" />
           <MenuItem icon={<HelpCircle size={18} color="#64748b" />} label="Support Center" />
        </View>
      </View>

      <Pressable style={({hovered}: any) => [s.logoutBtn, hovered && { backgroundColor: '#fef2f2' }]} onPress={() => router.push('/')}>
         <LogOut size={18} color="#ef4444" />
         <ThemedText style={s.logoutText}>Sign Out from Grid</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

function MenuItem({ icon, label }: { icon: any, label: string }) {
  return (
    <Pressable style={({hovered}: any) => [s.menuItem, hovered && { backgroundColor: '#fafafa' }]}>
       <View style={s.menuLabelGroup}>
          <View style={s.menuIconBox}>{icon}</View>
          <ThemedText style={s.menuLabel}>{label}</ThemedText>
       </View>
       <ChevronRight size={18} color="#cbd5e1" />
    </Pressable>
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

  userSection: { alignItems: 'center', marginBottom: 40, gap: 12 },
  avatarLarge: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.1, shadowRadius: 15 },
  userName: { fontSize: 24, fontWeight: '800', color: '#0f172a', textAlign: 'center' },
  userEmail: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 12, justifyContent: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  badgeTxt: { fontSize: 11, fontWeight: '700', color: '#64748b' },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  
  preferenceCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  settingIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  settingTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  settingSub: { fontSize: 12, color: '#94a3b8' },

  menuList: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '700', color: '#0f172a' },

  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: '#fee2e2', marginTop: 8 },
  logoutText: { color: '#ef4444', fontWeight: '800', fontSize: 15 },
});
