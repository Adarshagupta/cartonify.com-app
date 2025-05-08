import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { 
  Wand2, 
  Image as ImageIcon, 
  Sparkles, 
  Grid, 
  Clock, 
  Palette, 
  Zap,
  Users
} from 'lucide-react-native';
import AnimatedImage from '@/components/AnimatedImage';
import { imageAPI } from '@/utils/apiClient';
import { SvgXml } from 'react-native-svg';

// SVG content for the hero image
const heroSvg = `<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with gradient -->
  <rect width="400" height="400" rx="20" fill="url(#paint0_radial)" />
  
  <!-- Decorative circles -->
  <circle cx="200" cy="200" r="120" stroke="rgba(255, 255, 255, 0.8)" stroke-width="4" stroke-dasharray="4 6" />
  <circle cx="200" cy="200" r="80" stroke="rgba(255, 255, 255, 0.6)" stroke-width="3" />
  
  <!-- Magic wand -->
  <g transform="translate(200, 200) rotate(-30) translate(-200, -200)">
    <rect x="190" y="130" width="20" height="140" rx="10" fill="white" />
    <path d="M200 120 L220 90 L180 90 Z" fill="white" />
    
    <!-- Sparkles -->
    <circle cx="240" cy="100" r="8" fill="white" opacity="0.9" />
    <circle cx="260" cy="130" r="6" fill="white" opacity="0.7" />
    <circle cx="230" cy="150" r="5" fill="white" opacity="0.8" />
    <circle cx="250" cy="170" r="4" fill="white" opacity="0.6" />
    <circle cx="160" cy="110" r="7" fill="white" opacity="0.8" />
    <circle cx="140" cy="140" r="5" fill="white" opacity="0.7" />
    <circle cx="170" cy="160" r="4" fill="white" opacity="0.9" />
  </g>
  
  <!-- Gradient definitions -->
  <defs>
    <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 200) rotate(90) scale(200)">
      <stop offset="0" stop-color="#9F5EFF" />
      <stop offset="0.6" stop-color="#8A2BE2" />
      <stop offset="1" stop-color="#4B0082" />
    </radialGradient>
  </defs>
</svg>`;

// SVG content for the action cards
const generateSvg = `<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="25" fill="url(#generate_grad)" />
  <path d="M30 15V21M30 39V45M45 30H39M21 30H15M40.5 19.5L36.5 23.5M23.5 36.5L19.5 40.5M40.5 40.5L36.5 36.5M23.5 23.5L19.5 19.5" stroke="white" stroke-width="2" stroke-linecap="round" />
  <circle cx="30" cy="30" r="6" fill="white" />
  <defs>
    <linearGradient id="generate_grad" x1="5" y1="5" x2="55" y2="55" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#9F5EFF" />
      <stop offset="1" stop-color="#4B0082" />
    </linearGradient>
  </defs>
</svg>`;

const gallerySvg = `<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="40" height="40" rx="8" fill="#5D3FD3" />
  <rect x="14" y="14" width="14" height="14" rx="2" fill="white" />
  <rect x="32" y="14" width="14" height="14" rx="2" fill="white" />
  <rect x="14" y="32" width="14" height="14" rx="2" fill="white" />
  <rect x="32" y="32" width="14" height="14" rx="2" fill="white" />
</svg>`;

const profileSvg = `<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="25" fill="#5D3FD3" />
  <circle cx="30" cy="23" r="8" fill="white" />
  <path d="M15 45C15 36.7157 21.7157 30 30 30C38.2843 30 45 36.7157 45 45" stroke="white" stroke-width="4" stroke-linecap="round" />
</svg>`;

// SVG content for stats section
const imagesCreatedSvg = `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="30" height="30" rx="6" fill="#8A2BE2" opacity="0.2" />
  <rect x="10" y="10" width="30" height="30" rx="6" stroke="#8A2BE2" stroke-width="2" />
  <circle cx="18" cy="18" r="3" fill="#8A2BE2" />
  <path d="M10 32L19 26L28 33L40 24" stroke="#8A2BE2" stroke-width="2" stroke-linecap="round" />
</svg>`;

const artStylesSvg = `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="15" fill="#8A2BE2" opacity="0.2" />
  <circle cx="25" cy="25" r="15" stroke="#8A2BE2" stroke-width="2" />
  <circle cx="25" cy="18" r="3" fill="#8A2BE2" />
  <circle cx="18" cy="28" r="3" fill="#8A2BE2" />
  <circle cx="32" cy="28" r="3" fill="#8A2BE2" />
</svg>`;

const freeToUseSvg = `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="20" fill="#8A2BE2" opacity="0.2" />
  <circle cx="25" cy="25" r="20" stroke="#8A2BE2" stroke-width="2" />
  <path d="M16 25H34" stroke="#8A2BE2" stroke-width="2" stroke-linecap="round" />
  <path d="M16 20H30" stroke="#8A2BE2" stroke-width="2" stroke-linecap="round" />
  <path d="M16 30H26" stroke="#8A2BE2" stroke-width="2" stroke-linecap="round" />
  <path d="M32 15L37 20L32 25" stroke="#8A2BE2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

// Sample data type definition
interface ImageItem {
  id: string;
  prompt: string;
  imageUrl: string;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.4 > 160 ? 160 : width * 0.4;
const isSmallDevice = width < 375;

export default function HomeScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const [recentImages, setRecentImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animations
  const heroAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchRecentImages();
    Animated.timing(heroAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
    setTimeout(() => {
      Animated.timing(cardsAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }).start();
    }, 200);
  }, []);

  const fetchRecentImages = async () => {
    try {
      setLoading(true);
      const response = await imageAPI.getAllImages({ limit: 5 });
      setRecentImages(response.images || []);
    } catch (error) {
      console.error('Error fetching recent images:', error);
      setRecentImages(sampleImages);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecentImages();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#8A2BE2", "#5D3FD3"]}
            progressBackgroundColor="#fff"
          />
        }
      >
        {/* Hero Section with Gradient */}
        <Animated.View style={{
          opacity: heroAnim,
          transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        }}>
          <LinearGradient
            colors={['#8A2BE2', '#5D3FD3', '#4B0082']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.hero}
          >
            <View style={styles.heroContent}>
              <Text style={styles.greeting}>Welcome to</Text>
              <Text style={styles.appName}>Cartonify</Text>
              <Text style={styles.subtitle}>Turn your imagination into stunning visuals with AI</Text>
              <TouchableOpacity 
                style={styles.heroButton}
                onPress={() => router.push('/generate')}
                activeOpacity={0.85}
              >
                <Wand2 size={20} color="#8A2BE2" style={{ marginRight: 8 }} />
                <Text style={styles.heroButtonText}>Start Creating</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heroImageContainer}>
              <SvgXml xml={heroSvg} width="100%" height="100%" />
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* Stats Section */}
        <Animated.View style={{
          opacity: cardsAnim,
          transform: [{ translateY: cardsAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        }}>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <SvgXml xml={stat.icon} width={50} height={50} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        
        {/* Quick Actions */}
        <Animated.View style={{
          opacity: cardsAnim,
          transform: [{ translateY: cardsAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        }}>
          <View style={styles.actionCardsContainer}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.primaryActionCard]}
              onPress={() => router.push('/generate')}
            >
              <LinearGradient
                colors={['rgba(138, 43, 226, 0.8)', 'rgba(93, 63, 211, 0.9)']}
                style={styles.actionCardGradient}
              >
                <SvgXml xml={generateSvg} width={36} height={36} />
                <Text style={styles.actionCardText}>Generate</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/gallery')}
            >
              <View style={styles.actionCardContent}>
                <SvgXml xml={gallerySvg} width={36} height={36} />
                <Text style={styles.actionCardSecondaryText}>Gallery</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/profile')}
            >
              <View style={styles.actionCardContent}>
                <SvgXml xml={profileSvg} width={36} height={36} />
                <Text style={styles.actionCardSecondaryText}>Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Recent Generations */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Creations</Text>
            <TouchableOpacity onPress={() => router.push('/gallery')}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8A2BE2" />
            </View>
          ) : recentImages.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.recentImagesContainer}
            >
              {recentImages.map((image, index) => (
                <TouchableOpacity 
                  key={image.id || index.toString()} 
                  style={styles.recentImageCard}
                  onPress={() => router.push(`/image/${image.id}`)}
                >
                  <AnimatedImage 
                    source={{ uri: image.imageUrl }} 
                    style={styles.recentImage}
                  />
                  <View style={styles.recentImageOverlay}>
                    <Text numberOfLines={1} style={styles.recentImageText}>
                      {image.prompt}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <ImageIcon size={40} color="#8A2BE2" style={{ opacity: 0.7 }} />
              <Text style={styles.emptyStateText}>No images created yet</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => router.push('/generate')}
              >
                <Text style={styles.emptyStateButtonText}>Create Your First Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Amazing Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  {feature.icon}
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sample data for when API isn't available
const sampleImages: ImageItem[] = [
  {
    id: '1',
    prompt: 'A beautiful sunset over mountains',
    imageUrl: 'https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106',
  },
  {
    id: '2',
    prompt: 'Futuristic city with flying cars',
    imageUrl: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0',
  },
  {
    id: '3',
    prompt: 'Mystical forest with glowing elements',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
  },
];

const stats = [
  { value: '10K+', label: 'Images Created', icon: imagesCreatedSvg },
  { value: '20+', label: 'Art Styles', icon: artStylesSvg },
  { value: 'Free', label: 'To Use', icon: freeToUseSvg },
];

const features = [
  {
    title: 'Text to Image',
    description: 'Convert your descriptions into stunning visuals',
    icon: <Sparkles size={20} color="#fff" />,
    color: '#8A2BE2',
  },
  {
    title: 'Multiple Styles',
    description: 'Choose from various artistic and photo-realistic styles',
    icon: <Palette size={20} color="#fff" />,
    color: '#20B2AA',
  },
  {
    title: 'Fast Generation',
    description: 'Get your images in seconds with optimized processing',
    icon: <Zap size={20} color="#fff" />,
    color: '#FF6347',
  },
  {
    title: 'History Access',
    description: 'All your creations are saved for future reference',
    icon: <Clock size={20} color="#fff" />,
    color: '#4682B4',
  },
];

// Define type for styles
type Styles = {
  container: ViewStyle;
  scrollContainer: ViewStyle;
  hero: ViewStyle;
  heroContent: ViewStyle;
  heroImageContainer: ViewStyle;
  heroImage: ImageStyle;
  greeting: TextStyle;
  appName: TextStyle;
  subtitle: TextStyle;
  heroButton: ViewStyle;
  heroButtonText: TextStyle;
  statsContainer: ViewStyle;
  statItem: ViewStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
  actionCardsContainer: ViewStyle;
  actionCard: ViewStyle;
  primaryActionCard: ViewStyle;
  actionCardGradient: ViewStyle;
  actionCardContent: ViewStyle;
  actionCardText: TextStyle;
  actionCardSecondaryText: TextStyle;
  recentSection: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  sectionAction: TextStyle;
  loadingContainer: ViewStyle;
  recentImagesContainer: ViewStyle;
  recentImageCard: ViewStyle;
  recentImage: ImageStyle;
  recentImageOverlay: ViewStyle;
  recentImageText: TextStyle;
  emptyState: ViewStyle;
  emptyStateText: TextStyle;
  emptyStateButton: ViewStyle;
  emptyStateButtonText: TextStyle;
  featuresSection: ViewStyle;
  featuresGrid: ViewStyle;
  featureCard: ViewStyle;
  featureIcon: ViewStyle;
  featureTitle: TextStyle;
  featureDescription: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  hero: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: isSmallDevice ? 'column' : 'row',
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
  },
  heroImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: isSmallDevice ? 20 : 0,
    maxHeight: 200,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    maxWidth: 300,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 24,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8A2BE2',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#8A2BE2',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  actionCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 24,
  },
  actionCard: {
    width: '31%',
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryActionCard: {
    height: 100,
  },
  actionCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionCardText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginTop: 8,
  },
  actionCardSecondaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginTop: 8,
  },
  recentSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  sectionAction: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8A2BE2',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentImagesContainer: {
    paddingBottom: 8,
  },
  recentImageCard: {
    width: cardWidth,
    height: cardWidth,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },
  recentImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
  },
  recentImageText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  emptyState: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 43, 226, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginTop: 12,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  featuresSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: -8,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    marginBottom: 16,
    width: Platform.OS === 'web' ? '46%' : '46%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 18,
  },
});