import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Home, Wallet, ArrowRightLeft, User, Store, ChevronLeft, ChevronRight, Zap } from 'lucide-react-native';
import { useUserStore } from '../../constants/userStore';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ThemedText } from '../../components/ThemedText';

const SIDEBAR_EXPANDED_WIDTH = 232;
const SIDEBAR_COLLAPSED_WIDTH = 76;

function SidebarTabBar({
  state,
  descriptors,
  navigation,
  activeColor,
  inactiveColor,
  collapsed,
  onToggle,
}: BottomTabBarProps & {
  activeColor: string;
  inactiveColor: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <View style={[s.sidebar, { width: sidebarWidth }]}> 
      <View style={s.sidebarHeader}>
        {!collapsed ? (
          <View style={s.brandRow}>
            <Zap size={16} color={activeColor} fill={activeColor} />
            <ThemedText style={s.brandText}>Yagami</ThemedText>
          </View>
        ) : <View />}

        <Pressable onPress={onToggle} style={({ hovered }: any) => [s.toggleBtn, hovered && { backgroundColor: '#f1f5f9' }]}> 
          {collapsed ? <ChevronRight size={16} color="#0f172a" /> : <ChevronLeft size={16} color="#0f172a" />}
        </Pressable>
      </View>

      <View style={s.sidebarLinks}>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const options = descriptor.options;

          if (options.href === null) {
            return null;
          }

          const isFocused = state.index === index;
          const color = isFocused ? activeColor : inactiveColor;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const tabIcon =
            typeof options.tabBarIcon === 'function'
              ? options.tabBarIcon({ focused: isFocused, color, size: 20 })
              : null;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ hovered }: any) => [
                s.sidebarItem,
                isFocused && s.sidebarItemActive,
                hovered && !isFocused && { backgroundColor: '#f8fafc' },
                collapsed && s.sidebarItemCollapsed,
              ]}
            >
              <View style={[s.iconWrap, isFocused && s.iconWrapActive]}>{tabIcon}</View>
              {!collapsed ? (
                <ThemedText style={[s.sidebarItemText, isFocused && s.sidebarItemTextActive]}>{String(label)}</ThemedText>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const activeColor = '#22c55e'; // Sustainability Green
  const inactiveColor = '#94a3b8'; // Slate Gray for inactive
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = useUserStore();
  const role = user.onboarding.selectedRole;

  const sceneLeftOffset = isDesktop
    ? (sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH)
    : 0;

  return (
    <Tabs
      tabBar={(props) =>
        isDesktop ? (
          <SidebarTabBar
            {...props}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((value) => !value)}
          />
        ) : undefined
      }
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          marginLeft: sceneLeftOffset,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          height: 78,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: focused ? '#ecfdf3' : 'transparent' }}>
              <Home size={20} color={color} fill={focused ? color : 'transparent'} strokeWidth={focused ? 2 : 1.7} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="buy"
        options={{
          title: 'Buy',
          tabBarLabel: 'Buy',
          href: role === 'buyer' ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: focused ? '#ecfdf3' : 'transparent' }}>
              <Store size={20} color={color} strokeWidth={1.7} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Sell',
          tabBarLabel: 'Sell',
          href: role === 'seller' ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: focused ? '#ecfdf3' : 'transparent' }}>
              <Store size={20} color={color} strokeWidth={1.7} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: focused ? '#ecfdf3' : 'transparent' }}>
              <Wallet size={20} color={color} strokeWidth={1.7} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: 'Trades',
          tabBarLabel: 'Trades',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: focused ? '#ecfdf3' : 'transparent' }}>
              <ArrowRightLeft size={20} color={color} strokeWidth={1.7} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: focused ? '#ecfdf3' : 'transparent' }}>
              <User size={20} color={color} strokeWidth={1.7} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingTop: 14,
    zIndex: 30,
  },
  sidebarHeader: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.4,
  },
  toggleBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  sidebarLinks: {
    gap: 6,
  },
  sidebarItem: {
    minHeight: 44,
    borderRadius: 11,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sidebarItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  sidebarItemActive: {
    backgroundColor: '#ecfdf3',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapActive: {
    backgroundColor: '#ffffff',
  },
  sidebarItemText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700',
  },
  sidebarItemTextActive: {
    color: '#16a34a',
  },
});
