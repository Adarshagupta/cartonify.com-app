import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';

interface ImagePlaceholderProps {
  message?: string;
  width?: number;
  height?: number;
}

export default function ImagePlaceholder({ 
  message = "Enter a prompt to generate an image", 
  width = 300, 
  height = 300 
}: ImagePlaceholderProps) {
  return (
    <View style={[
      styles.container, 
      { width, height }
    ]}>
      <ImageIcon size={48} color="#ccc" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: '80%',
  },
});