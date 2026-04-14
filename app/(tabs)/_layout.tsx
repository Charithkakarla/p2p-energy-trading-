import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Wallet, ArrowRightLeft, User } from 'lucide-react-native';

export default function TabLayout() {
  const activeColor = '#22c55e'; // Sustainability Green
  const inactiveColor = '#94a3b8'; // Slate Gray for inactive

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
          href: null, // Hide from tab bar
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
