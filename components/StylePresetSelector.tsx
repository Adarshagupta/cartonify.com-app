import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';

const presets = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard balanced style',
    thumbnail: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Movie-like quality with dramatic lighting',
    thumbnail: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Japanese animation style',
    thumbnail: 'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Non-representational artistic style',
    thumbnail: 'https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    description: 'Highly detailed realistic images',
    thumbnail: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

interface StylePresetSelectorProps {
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
}

export function StylePresetSelector({ selectedPreset, onSelectPreset }: StylePresetSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Style Preset</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetsContainer}
      >
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={[
              styles.presetItem,
              selectedPreset === preset.id && styles.selectedPreset
            ]}
            onPress={() => onSelectPreset(preset.id)}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: preset.thumbnail }} 
              style={styles.presetImage}
            />
            <View style={styles.presetInfo}>
              <Text style={styles.presetName}>{preset.name}</Text>
              <Text style={styles.presetDescription} numberOfLines={1}>
                {preset.description}
              </Text>
            </View>
            {selectedPreset === preset.id && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  presetsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  presetItem: {
    width: 150,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  selectedPreset: {
    borderColor: '#8A2BE2',
    borderWidth: 2,
  },
  presetImage: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  presetInfo: {
    padding: 10,
  },
  presetName: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  presetDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8A2BE2',
    borderWidth: 2,
    borderColor: '#fff',
  },
});