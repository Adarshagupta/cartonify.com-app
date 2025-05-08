import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Pressable
} from 'react-native';
import { X, FileSliders as Sliders } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Button from './Button';

interface AdvancedSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (settings: GenerationSettings) => void;
  initialSettings: GenerationSettings;
}

export interface GenerationSettings {
  width: number;
  height: number;
  samples: number;
  seed?: number;
  guidanceScale: number;
  enhancePrompt: boolean;
}

export default function AdvancedSettingsModal({ 
  visible, 
  onClose, 
  onApply,
  initialSettings
}: AdvancedSettingsModalProps) {
  const [settings, setSettings] = useState<GenerationSettings>(initialSettings);
  
  const updateSetting = <K extends keyof GenerationSettings>(
    key: K, 
    value: GenerationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApply = () => {
    onApply(settings);
    onClose();
  };
  
  const renderSettingItem = (
    title: string, 
    description: string, 
    value: string | number | boolean,
    control: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.settingControl}>
        {control}
      </View>
    </View>
  );
  
  const Backdrop = Platform.OS === 'web' 
    ? (props: { children: React.ReactNode }) => <View style={styles.backdrop}>{props.children}</View>
    : (props: { children: React.ReactNode }) => (
        <BlurView intensity={30} tint="dark" style={styles.backdrop}>
          {props.children}
        </BlurView>
      );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Backdrop>
        <Pressable style={styles.backdropPressable} onPress={onClose}>
          <View 
            style={styles.modalContainer}
            // This prevents the modal from closing when clicking inside
            onStartShouldSetResponder={() => true}
            onTouchEnd={e => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View style={styles.headerTitleContainer}>
                <Sliders size={20} color="#8A2BE2" />
                <Text style={styles.modalTitle}>Advanced Settings</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {renderSettingItem(
                'Image Dimensions',
                'Set the width and height of the generated image',
                `${settings.width} × ${settings.height}`,
                <View style={styles.dimensionsControl}>
                  <Button 
                    title="Square" 
                    variant={settings.width === settings.height ? 'primary' : 'outline'}
                    size="small"
                    onPress={() => {
                      updateSetting('width', 512);
                      updateSetting('height', 512);
                    }}
                    style={styles.dimensionButton}
                  />
                  <Button 
                    title="Portrait" 
                    variant={settings.width < settings.height ? 'primary' : 'outline'}
                    size="small"
                    onPress={() => {
                      updateSetting('width', 512);
                      updateSetting('height', 768);
                    }}
                    style={styles.dimensionButton}
                  />
                  <Button 
                    title="Landscape" 
                    variant={settings.width > settings.height ? 'primary' : 'outline'}
                    size="small"
                    onPress={() => {
                      updateSetting('width', 768);
                      updateSetting('height', 512);
                    }}
                    style={styles.dimensionButton}
                  />
                </View>
              )}
              
              {renderSettingItem(
                'Number of Samples',
                'Generate multiple variations to choose from',
                settings.samples.toString(),
                <View style={styles.sampleControl}>
                  {[1, 2, 4].map(num => (
                    <Button
                      key={num}
                      title={num.toString()}
                      variant={settings.samples === num ? 'primary' : 'outline'}
                      size="small"
                      onPress={() => updateSetting('samples', num)}
                      style={styles.sampleButton}
                    />
                  ))}
                </View>
              )}
              
              {renderSettingItem(
                'Enhance Prompt',
                'Automatically enhance your prompt with additional details',
                settings.enhancePrompt ? 'On' : 'Off',
                <Button
                  title={settings.enhancePrompt ? 'On' : 'Off'}
                  variant={settings.enhancePrompt ? 'primary' : 'outline'}
                  size="small"
                  onPress={() => updateSetting('enhancePrompt', !settings.enhancePrompt)}
                />
              )}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button
                title="Reset to Defaults"
                variant="outline"
                onPress={() => setSettings(initialSettings)}
                style={styles.resetButton}
              />
              <Button
                title="Apply Settings"
                variant="primary"
                gradient
                onPress={handleApply}
                style={styles.applyButton}
              />
            </View>
          </View>
        </Pressable>
      </Backdrop>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropPressable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Platform.OS === 'web' ? '80%' : '90%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginLeft: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  modalContent: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  settingControl: {
    minWidth: 100,
    alignItems: 'flex-end',
  },
  dimensionsControl: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
  dimensionButton: {
    marginBottom: 4,
  },
  sampleControl: {
    flexDirection: 'row',
    gap: 8,
  },
  sampleButton: {
    width: 40,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
});