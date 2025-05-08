import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch, 
  TouchableOpacity,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Moon, Key, CircleUser as UserCircle, BellRing, CloudOff, Download, Trash2, Info as InfoIcon, ExternalLink } from 'lucide-react-native';
import { useSettings } from '../_layout';

type SettingKey = 'darkMode' | 'saveHistory' | 'highQuality' | 'notifications' | 'offlineMode';

export default function SettingsScreen() {
  const settings = useSettings();
  
  const renderSwitch = (
    key: SettingKey,
    title: string,
    description: string,
    icon: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[key] as boolean}
        onValueChange={(value) => settings.setSetting(key, value)}
        trackColor={{ false: '#e0e0e0', true: 'rgba(138, 43, 226, 0.4)' }}
        thumbColor={settings[key] ? '#8A2BE2' : '#f5f5f5'}
      />
    </View>
  );
  
  const renderAction = (
    title: string,
    description: string,
    icon: React.ReactNode,
    onPress: () => void,
    textColor: string = '#333'
  ) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSwitch(
            'darkMode',
            'Dark Mode',
            'Use dark theme throughout the app',
            settings.darkMode ? (
              <Moon size={24} color="#8A2BE2" />
            ) : (
              <Sun size={24} color="#8A2BE2" />
            )
          )}
          {renderSwitch(
            'saveHistory',
            'Save History',
            'Keep a record of your generated images',
            <UserCircle size={24} color="#8A2BE2" />
          )}
          {renderSwitch(
            'highQuality',
            'High Quality Generation',
            'Generate higher resolution images (uses more credits)',
            <Download size={24} color="#8A2BE2" />
          )}
          {renderSwitch(
            'notifications',
            'Notifications',
            'Receive updates when images are generated',
            <BellRing size={24} color="#8A2BE2" />
          )}
          {renderSwitch(
            'offlineMode',
            'Offline Mode',
            'Cache images for offline viewing',
            <CloudOff size={24} color="#8A2BE2" />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderAction(
            'API Settings',
            'Configure Replicate API and credentials',
            <Key size={24} color="#8A2BE2" />,
            () => console.log('API settings')
          )}
          {renderAction(
            'Clear History',
            'Delete all generated images from your account',
            <Trash2 size={24} color="#ff6b6b" />,
            () => console.log('Clear history'),
            '#ff6b6b'
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {renderAction(
            'App Version',
            '1.0.0',
            <InfoIcon size={24} color="#8A2BE2" />,
            () => console.log('App version')
          )}
          {renderAction(
            'Visit Replicate',
            'Learn more about the API powering this app',
            <ExternalLink size={24} color="#8A2BE2" />,
            () => Linking.openURL('https://replicate.com')
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cartonify © 2025
          </Text>
          <Text style={styles.footerSubText}>
            Powered by Replicate API
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#666',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  footerSubText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginTop: 4,
  },
});