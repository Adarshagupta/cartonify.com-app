import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, LogOut, Edit } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { authAPI, userAPI, imageAPI } from '@/utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user from storage or API
      const userJson = await AsyncStorage.getItem('user');
      let userData = userJson ? JSON.parse(userJson) : null;
      
      if (!userData) {
        const response = await authAPI.getCurrentUser();
        userData = response.user;
      }
      
      setUser(userData);
      
      // Fetch user's images
      if (userData && userData.id) {
        fetchUserImages(userData.id);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchUserImages = async (userId: string) => {
    try {
      setIsLoadingImages(true);
      const response = await imageAPI.getAllImages({ userId });
      setImages(response.images || []);
    } catch (error) {
      console.error('Error fetching user images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };
  
  const handleImagePress = (imageId: string) => {
    router.push(`/image/${imageId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Not logged in</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/auth/login')}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <LogOut size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{user.username?.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.name || user.username}</Text>
              <Text style={styles.username}>@{user.username}</Text>
            </View>
            
            <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/edit' as never)}>
              <Edit size={20} color="#8A2BE2" />
            </TouchableOpacity>
          </View>
          
          {user.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{images.length}</Text>
              <Text style={styles.statLabel}>Images</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>My Images</Text>
          
          {isLoadingImages ? (
            <ActivityIndicator style={styles.loadingIndicator} color="#8A2BE2" />
          ) : images.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No images yet</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => router.push('/generate')}
              >
                <Text style={styles.createButtonText}>Create your first image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={images}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.imageContainer}
                  onPress={() => handleImagePress(item.id)}
                >
                  <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.image} 
                    resizeMode="cover"
                  />
                  <Text style={styles.imagePrompt} numberOfLines={1}>
                    {item.prompt}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  iconButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  editButton: {
    padding: 8,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#444',
    marginTop: 16,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  stat: {
    alignItems: 'center',
    marginRight: 24,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  imagesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 16,
  },
  imageContainer: {
    flex: 1,
    margin: 4,
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
  imagePrompt: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    padding: 8,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  emptyState: {
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
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
}); 