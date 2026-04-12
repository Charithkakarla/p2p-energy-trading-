import React from 'react';
import { Tabs } from 'expo-router';
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
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={26} color={color} fill={color === activeColor ? color : 'transparent'} strokeWidth={color === activeColor ? 2 : 1.5} />,
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
          tabBarIcon: ({ color, size }) => <Wallet size={26} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: 'Trades',
          tabBarLabel: 'Trades',
          tabBarIcon: ({ color, size }) => <ArrowRightLeft size={26} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={26} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>
  );
}
