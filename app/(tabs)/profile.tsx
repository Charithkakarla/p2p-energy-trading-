import React from 'react';
import { StyleSheet, ScrollView, View, Pressable, Switch, useWindowDimensions, TextInput } from 'react-native';
import { User, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, Zap, MapPin, ShieldCheck } from 'lucide-react-native';
import { ThemedText } from '../../components/ThemedText';
import { router } from 'expo-router';
import { resetUserState, useUserStore, updatePreferences, updateProfile } from '../../constants/userStore';

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 900;
  const isPhone = width < 640;
  const user = useUserStore();

  return (
    <ScrollView style={s.container} contentContainerStyle={[styles.scrollContent, isPhone && { paddingBottom: 130 }]} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <ThemedText style={s.title}>Settings</ThemedText>
        <ThemedText style={s.subtitle}>Identity, grid profile, and personalized trade preferences.</ThemedText>
      </View>

      <View style={[s.userSection, isWide && { flexDirection: 'row', alignItems: 'center', gap: 32, backgroundColor: '#fff', padding: 26, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb' }]}>
        <View style={s.avatarLarge}>
          <User size={44} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={s.userName}>{user.profile.name}</ThemedText>
          <ThemedText style={s.userEmail}>{user.profile.email}</ThemedText>
          <View style={s.badgeRow}>
            <View style={s.badge}>
              <MapPin size={12} color="#64748b" />
              <ThemedText style={s.badgeTxt}>{user.profile.city}</ThemedText>
            </View>
            <View style={[s.badge, { backgroundColor: '#f0fdf4' }]}> 
              <ShieldCheck size={12} color="#16a34a" />
              <ThemedText style={[s.badgeTxt, { color: '#16a34a' }]}>{user.profile.verified ? 'Verified Node' : 'Unverified Node'}</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={s.section}>
        <ThemedText style={s.sectionTitle}>Personal Details</ThemedText>
        <View style={s.formCard}>
          <Field label="Full Name" value={user.profile.name} onChangeText={(text) => updateProfile({ name: text })} />
          <Field label="City" value={user.profile.city} onChangeText={(text) => updateProfile({ city: text })} />
          <Field label="Email" value={user.profile.email} onChangeText={(text) => updateProfile({ email: text })} keyboardType="email-address" />
        </View>
      </View>

      <View style={s.section}>
        <ThemedText style={s.sectionTitle}>Smart Grid Control</ThemedText>
        <View style={s.preferenceCard}>
          <ToggleRow
            icon={<Zap size={18} color="#22c55e" />}
            title="Auto-sell surplus"
            subtitle="Sell excess solar units automatically."
            value={user.preferences.autoSell}
            onChange={(value) => updatePreferences({ autoSell: value })}
          />
          <ToggleRow
            icon={<Bell size={18} color="#3b82f6" />}
            title="Market notifications"
            subtitle="Price spike and match alerts on your device."
            value={user.preferences.notifications}
            onChange={(value) => updatePreferences({ notifications: value })}
          />
          <ToggleRow
            icon={<Shield size={18} color="#f97316" />}
            title="Fast settlement"
            subtitle="Prioritize faster clearing with higher fees."
            value={user.preferences.fastSettlement}
            onChange={(value) => updatePreferences({ fastSettlement: value })}
            isLast
          />
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

      <Pressable
        style={({ hovered }: any) => [s.logoutBtn, hovered && { backgroundColor: '#fef2f2' }]}
        onPress={() => {
          resetUserState();
          router.push('/');
        }}
      >
        <LogOut size={18} color="#ef4444" />
        <ThemedText style={s.logoutText}>Sign Out from Grid</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, keyboardType }: { label: string; value: string; onChangeText: (text: string) => void; keyboardType?: 'default' | 'email-address' }) {
  return (
    <View style={s.fieldWrap}>
      <ThemedText style={s.fieldLabel}>{label}</ThemedText>
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={label === 'Email' ? 'none' : 'words'}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onChange,
  isLast,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[s.settingsRow, isLast && { borderBottomWidth: 0, paddingBottom: 0 }]}> 
      <View style={s.settingLabelGroup}>
        <View style={s.settingIcon}>{icon}</View>
        <View style={{ flexShrink: 1 }}>
          <ThemedText style={s.settingTitle}>{title}</ThemedText>
          <ThemedText style={s.settingSub}>{subtitle}</ThemedText>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
        thumbColor={'#fff'}
      />
    </View>
  );
}

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Pressable style={({ hovered }: any) => [s.menuItem, hovered && { backgroundColor: '#fafafa' }]}> 
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
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20 },
  header: { marginBottom: 24, marginTop: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748b' },

  userSection: { alignItems: 'center', marginBottom: 24, gap: 12 },
  avatarLarge: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15 },
  userName: { fontSize: 24, fontWeight: '800', color: '#0f172a', textAlign: 'center' },
  userEmail: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  badgeTxt: { fontSize: 11, fontWeight: '700', color: '#64748b' },

  section: { marginBottom: 26 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 10 },

  formCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 14, gap: 10 },
  fieldWrap: { gap: 6 },
  fieldLabel: { fontSize: 12, color: '#64748b', fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#dbe2ea', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0f172a', backgroundColor: '#f8fafc' },

  preferenceCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  settingLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#eef2f7' },
  settingTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  settingSub: { fontSize: 12, color: '#94a3b8' },

  menuList: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '700', color: '#0f172a' },

  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#fee2e2', marginTop: 8 },
  logoutText: { color: '#ef4444', fontWeight: '800', fontSize: 14 },
});
