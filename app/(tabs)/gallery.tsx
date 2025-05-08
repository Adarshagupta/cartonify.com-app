import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Filter, Search } from 'lucide-react-native';
import { imageAPI, authAPI } from '@/utils/apiClient';

export default function GalleryScreen() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await imageAPI.getAllImages({ page, limit: 12 });
      
      setImages(response.images || []);
      setTotalPages(response.pagination?.pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Error', 'Failed to load images');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchImages(1);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || currentPage >= totalPages) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await imageAPI.getAllImages({ page: nextPage, limit: 12 });
      
      setImages([...images, ...(response.images || [])]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more images:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleImagePress = (imageId: string) => {
    router.push(`/image/${imageId}`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.imageContainer}
      onPress={() => handleImagePress(item.id)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.imageInfo}>
        <Text style={styles.imagePrompt} numberOfLines={1}>
          {item.prompt}
        </Text>
        <Text style={styles.imageAuthor} numberOfLines={1}>
          @{item.user?.username || 'anonymous'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#8A2BE2" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
        </View>
      ) : images.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No images found</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/generate')}
          >
            <Text style={styles.createButtonText}>Create an image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.imageGrid}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#8A2BE2']}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  imageGrid: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  imageInfo: {
    padding: 8,
  },
  imagePrompt: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  imageAuthor: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
});