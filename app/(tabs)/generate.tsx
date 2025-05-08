import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
  Keyboard,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Wand as Wand2, Image as ImageIcon, Download, Share2, FileSliders as Sliders } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { StylePresetSelector } from '@/components/StylePresetSelector';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import AnimatedImage from '@/components/AnimatedImage';
import PromptSuggestions from '@/components/PromptSuggestions';
import Button from '@/components/Button';
import AdvancedSettingsModal, { GenerationSettings } from '@/components/AdvancedSettingsModal';
import { generateImage, saveImageToGallery, shareImage } from '@/utils/api';
import { authAPI, imageAPI } from '@/utils/apiClient';

export default function GenerateScreen() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  
  const imageWidth = Math.min(width - 32, 500);
  
  const [settings, setSettings] = useState<GenerationSettings>({
    width: 512,
    height: 512,
    samples: 1,
    guidanceScale: 7.5,
    enhancePrompt: true,
  });

  // Add useEffect for debugging
  useEffect(() => {
    console.log('Generate tab mounted');
    console.log('Prompt:', prompt);
    console.log('Selected preset:', selectedPreset);
    console.log('Is generating:', isGenerating);
    console.log('Has generated image:', !!generatedImage);
  }, [prompt, selectedPreset, isGenerating, generatedImage]);

  const handleGenerate = async () => {
    console.log('Generate button pressed');
    
    if (!prompt || prompt.trim() === '') {
      Alert.alert('Empty Prompt', 'Please enter a description for your image.');
      return;
    }
    
    Keyboard.dismiss();
    setIsGenerating(true);
    setIsSaved(false);
    setGeneratedImage(null);
    
    try {
      console.log('Calling generateImage API...');
      // Call the API with the prompt, preset, and settings
      const imageUrl = await generateImage(prompt, selectedPreset, settings);
      console.log('Image generation successful, URL:', imageUrl);
      setGeneratedImage(imageUrl);
      setIsGenerating(false);
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      Alert.alert(
        'Generation Failed', 
        'There was an error generating your image. Please check your API key and try again.'
      );
    }
  };
  
  const handleSave = async () => {
    if (!generatedImage) return;
    
    try {
      // First, check if user is logged in
      const isAuthenticated = await authAPI.isAuthenticated();
      
      if (!isAuthenticated) {
        Alert.alert(
          'Login Required', 
          'You need to be logged in to save images to your gallery',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => router.push('/auth/login') }
          ]
        );
        return;
      }
      
      // Save to device storage
      const deviceResult = await saveImageToGallery({
        prompt,
        imageUrl: generatedImage,
        preset: selectedPreset
      });
      
      // Save to database
      await imageAPI.createImage({
        prompt,
        imageUrl: generatedImage,
        preset: selectedPreset,
        width: settings.width,
        height: settings.height
      });
      
      setIsSaved(true);
      Alert.alert('Success', 'Image saved to your gallery and account!');
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Save Failed', 'There was an error saving your image. Please try again.');
    }
  };
  
  const handleShare = async () => {
    if (!generatedImage) return;
    
    try {
      await shareImage(generatedImage);
      Alert.alert('Success', 'Image shared successfully!');
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('Share Failed', 'There was an error sharing your image. Please try again.');
    }
  };
  
  const handleClear = () => {
    setPrompt('');
    setGeneratedImage(null);
    setIsSaved(false);
  };
  
  const handleApplySettings = (newSettings: GenerationSettings) => {
    setSettings(newSettings);
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Image</Text>
            <Text style={styles.subtitle}>Describe what you want to create</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Describe your image... (e.g., A futuristic city with flying cars)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={Platform.OS === 'web' ? 1 : 3}
              value={prompt}
              onChangeText={setPrompt}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            {prompt ? (
              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          
          <PromptSuggestions onSelectSuggestion={handleSelectSuggestion} />
          
          <StylePresetSelector 
            selectedPreset={selectedPreset}
            onSelectPreset={setSelectedPreset}
          />
          
          <View style={styles.advancedSettingsRow}>
            <TouchableOpacity 
              style={styles.advancedSettingsButton}
              onPress={() => setShowAdvancedSettings(true)}
            >
              <Sliders size={16} color="#8A2BE2" style={styles.settingsIcon} />
              <Text style={styles.advancedSettingsText}>Advanced Settings</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.imagePreviewContainer}>
            {isGenerating ? (
              <View style={[styles.loadingContainer, { width: imageWidth, height: imageWidth }]}>
                <ActivityIndicator size="large" color="#8A2BE2" />
                <Text style={styles.loadingText}>Generating your image...</Text>
              </View>
            ) : generatedImage ? (
              <AnimatedImage
                source={{ uri: generatedImage }}
                style={[styles.generatedImage, { width: imageWidth, height: imageWidth }]}
              />
            ) : (
              <ImagePlaceholder 
                width={imageWidth} 
                height={imageWidth} 
              />
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Generate"
              icon={<Wand2 size={20} color="#fff" />}
              onPress={handleGenerate}
              disabled={!prompt || isGenerating}
              loading={isGenerating}
              variant="primary"
              gradient
              style={[styles.generateButton, { marginBottom: 16 }]}
              fullWidth
            />
            
            {generatedImage && !isGenerating && (
              <View style={styles.actionButtonsContainer}>
                <Button
                  title="Save"
                  icon={<Download size={20} color={isSaved ? '#fff' : '#8A2BE2'} />}
                  onPress={handleSave}
                  variant={isSaved ? 'primary' : 'outline'}
                  style={styles.actionButton}
                  fullWidth
                />
                <Button
                  title="Share"
                  icon={<Share2 size={20} color="#8A2BE2" />}
                  onPress={handleShare}
                  variant="outline"
                  style={styles.actionButton}
                  fullWidth
                />
              </View>
            )}
          </View>
        </ScrollView>
        
        <AdvancedSettingsModal 
          visible={showAdvancedSettings}
          onClose={() => setShowAdvancedSettings(false)}
          onApply={handleApplySettings}
          initialSettings={settings}
        />
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  inputContainer: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    minHeight: Platform.OS === 'web' ? 56 : 100,
    textAlignVertical: 'top',
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 8,
  },
  clearButtonText: {
    color: '#8A2BE2',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  generatedImage: {
    borderRadius: 12,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    width: '100%',
  },
  generateButton: {
    marginBottom: 16,
    height: 50,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  advancedSettingsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  advancedSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  settingsIcon: {
    marginRight: 8,
  },
  advancedSettingsText: {
    color: '#8A2BE2',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  }
});