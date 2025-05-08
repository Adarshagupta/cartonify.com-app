import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Files, Play, Pause, X } from 'lucide-react-native';
import Button from './Button';

interface BatchProcessorProps {
  onProcess: (prompts: string[]) => Promise<void>;
  onCancel: () => void;
}

export default function BatchProcessor({ onProcess, onCancel }: BatchProcessorProps) {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addPrompt = (prompt: string) => {
    setPrompts([...prompts, prompt]);
  };

  const removePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      await onProcess(prompts);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Files size={24} color="#8A2BE2" />
        <Text style={styles.title}>Batch Processing</Text>
      </View>

      <ScrollView style={styles.promptList}>
        {prompts.map((prompt, index) => (
          <View key={index} style={styles.promptItem}>
            <Text style={styles.promptText} numberOfLines={2}>
              {prompt}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePrompt(index)}
            >
              <X size={20} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.controls}>
        <Button
          title={isProcessing ? "Processing..." : "Start Processing"}
          icon={isProcessing ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
          onPress={handleProcess}
          disabled={prompts.length === 0 || isProcessing}
          loading={isProcessing}
          variant="primary"
          gradient
          fullWidth
        />
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={styles.cancelButton}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginLeft: 8,
  },
  promptList: {
    maxHeight: 200,
  },
  promptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  promptText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  controls: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
});