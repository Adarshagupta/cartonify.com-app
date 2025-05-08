import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const suggestions = [
  'A serene mountain landscape at sunset',
  'A cyberpunk city with neon lights',
  'An astronaut riding a horse on Mars',
  'A peaceful Japanese garden in autumn',
  'An ancient temple hidden in a lush jungle',
  'A futuristic space station orbiting Earth',
  'A magical library with floating books',
];

interface PromptSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

export default function PromptSuggestions({ onSelectSuggestion }: PromptSuggestionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prompt Ideas</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsContainer}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionChip}
            onPress={() => onSelectSuggestion(suggestion)}
            activeOpacity={0.7}
          >
            <Text style={styles.suggestionText} numberOfLines={1}>
              {suggestion}
            </Text>
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
  suggestionsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  suggestionChip: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    maxWidth: 200,
  },
  suggestionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8A2BE2',
  },
});