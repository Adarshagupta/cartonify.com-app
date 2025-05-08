import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Wand as Wand2, Layers, Palette, Sparkles, Brush } from 'lucide-react-native';

const filters = [
  {
    id: 'enhance',
    name: 'Enhance',
    icon: <Wand2 size={24} color="#8A2BE2" />,
    description: 'Automatically enhance image quality'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    icon: <Palette size={24} color="#8A2BE2" />,
    description: 'Apply artistic style transfer'
  },
  {
    id: 'composition',
    name: 'Composition',
    icon: <Layers size={24} color="#8A2BE2" />,
    description: 'Improve image composition'
  },
  {
    id: 'details',
    name: 'Details',
    icon: <Sparkles size={24} color="#8A2BE2" />,
    description: 'Enhance fine details'
  },
  {
    id: 'style',
    name: 'Style',
    icon: <Brush size={24} color="#8A2BE2" />,
    description: 'Apply custom style presets'
  }
];

interface ImageFiltersProps {
  onSelectFilter: (filterId: string) => void;
  selectedFilter: string | null;
}

export default function ImageFilters({ onSelectFilter, selectedFilter }: ImageFiltersProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enhancement Filters</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterItem,
              selectedFilter === filter.id && styles.selectedFilter
            ]}
            onPress={() => onSelectFilter(filter.id)}
          >
            <View style={styles.iconContainer}>
              {filter.icon}
            </View>
            <Text style={styles.filterName}>{filter.name}</Text>
            <Text style={styles.filterDescription}>{filter.description}</Text>
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
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterItem: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedFilter: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderColor: '#8A2BE2',
    borderWidth: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  filterDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});