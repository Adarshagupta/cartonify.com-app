import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Share,
  Platform,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Heart, 
  Trash2,
  Clock,
  Palette
} from 'lucide-react-native';
import AnimatedImage from '@/components/AnimatedImage';
import { getGenerationHistory, shareImage } from '@/utils/api';
import Button from '@/components/Button';

export default function ImageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  const imageWidth = Math.min(width - 32, 500);
  
  useEffect(() => {
    loadImageDetails();
  }, [id]);
  
  const loadImageDetails = async () => {
    setLoading(true);
    try {
      // In a real app, we would load the specific image by ID
      const history = await getGenerationHistory();
      const foundImage = history.find(img => img.id === id);
      
      if (foundImage) {
        setImage(foundImage);
      }
    } catch (error) {
      console.error('Failed to load image details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleShare = async () => {
    if (!image) return;
    
    try {
      if (Platform.OS === 'web') {
        // Web implementation
        if (navigator.share) {
          await navigator.share({
            title: 'Generated Image',
            text: image.prompt,
            url: image.imageUrl,
          });
        } else {
          alert('Web Share API not supported on this browser');
        }
      } else {
        // Native implementation
        await shareImage(image.imageUrl);
        const result = await Share.share({
          title: 'Generated Image',
          message: `Check out this AI-generated image: ${image.prompt}`,
          url: image.imageUrl,
        });
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };
  
  const handleDelete = () => {
    // In a real app, this would delete the image
    alert('Delete functionality would be implemented here');
    router.back();
  };
  
  const handleDownload = () => {
    // In a real app, this would download the image
    alert('Download functionality would be implemented here');
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={styles.loadingText}>Loading image details...</Text>
      </SafeAreaView>
    );
  }
  
  if (!image) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Image not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()}
          variant="primary"
          style={styles.goBackButton}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={toggleFavorite}
          >
            <Heart 
              size={24} 
              color={isFavorite ? '#ff6b6b' : '#666'} 
              fill={isFavorite ? '#ff6b6b' : 'transparent'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Trash2 size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <AnimatedImage 
            source={{ uri: image.imageUrl }} 
            style={[styles.image, { width: imageWidth, height: imageWidth }]}
          />
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.promptTitle}>Prompt</Text>
          <Text style={styles.promptText}>{image.prompt}</Text>
          
          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Clock size={16} color="#666" style={styles.metadataIcon} />
              <Text style={styles.metadataText}>
                {new Date(image.timestamp).toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.metadataItem}>
              <Palette size={16} color="#666" style={styles.metadataIcon} />
              <Text style={styles.metadataText}>
                Style: {image.preset.charAt(0).toUpperCase() + image.preset.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <Button
              title="Download"
              icon={<Download size={20} color="#fff" />}
              onPress={handleDownload}
              variant="primary"
              style={styles.actionButtonWide}
              fullWidth={true}
            />
            
            <Button
              title="Share"
              icon={<Share2 size={20} color="#8A2BE2" />}
              onPress={handleShare}
              variant="outline"
              style={styles.actionButtonWide}
              fullWidth={true}
            />
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerRight: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  image: {
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  detailsContainer: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  promptTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 24,
  },
  metadataContainer: {
    marginTop: 16,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataIcon: {
    marginRight: 8,
  },
  metadataText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  actionsContainer: {
    marginTop: 8,
    flexDirection: 'column',
    gap: 8,
  },
  actionButtonWide: {
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#666',
    marginBottom: 24,
  },
  goBackButton: {
    minWidth: 120,
  },
});