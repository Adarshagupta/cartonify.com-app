import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ImageIcon, Settings, History } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const isWeb = Platform.OS === 'web';
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: styles.tabBarLabel,
        // Use custom tab bar background on iOS for blur effect
        tabBarBackground: () => 
          isWeb ? null : (
            <BlurView 
              tint="light"
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <ImageIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    ...(Platform.OS === 'web' 
      ? { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)' } 
      : {}
    ),
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});