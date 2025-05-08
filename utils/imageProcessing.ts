import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export interface ImageEnhancementOptions {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  sharpness?: number;
}

export interface ExportOptions {
  format: 'jpeg' | 'png';
  quality?: number;
  width?: number;
  height?: number;
}

export async function enhanceImage(
  imageUri: string,
  options: ImageEnhancementOptions
): Promise<string> {
  const actions: any[] = [];

  if (options.brightness !== undefined) {
    actions.push({ adjust: { brightness: options.brightness } });
  }
  if (options.contrast !== undefined) {
    actions.push({ adjust: { contrast: options.contrast } });
  }
  if (options.saturation !== undefined) {
    actions.push({ adjust: { saturation: options.saturation } });
  }

  const result = await ImageManipulator.manipulateAsync(
    imageUri,
    actions,
    { compress: 1, format: ImageManipulator.SaveFormat.PNG }
  );

  return result.uri;
}

export async function exportImage(
  imageUri: string,
  options: ExportOptions
): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    imageUri,
    [
      {
        resize: {
          width: options.width,
          height: options.height,
        },
      },
    ],
    {
      compress: options.quality || 1,
      format: options.format === 'jpeg' ? 
        ImageManipulator.SaveFormat.JPEG : 
        ImageManipulator.SaveFormat.PNG,
    }
  );

  return result.uri;
}

export async function saveToGallery(imageUri: string): Promise<void> {
  if (Platform.OS === 'web') {
    // Web implementation: trigger download
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } else {
    // Native implementation
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(imageUri);
    } else {
      throw new Error('Permission to access media library was denied');
    }
  }
}

export async function shareImage(imageUri: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Generated Image',
          text: 'Check out this AI-generated image!',
          url: imageUri,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      throw new Error('Web Share API not supported');
    }
  } else {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(imageUri);
    } else {
      throw new Error('Sharing is not available on this platform');
    }
  }
}

export async function applyArtisticStyle(
  imageUri: string,
  stylePreset: string
): Promise<string> {
  // This would integrate with your AI service for style transfer
  // For now, we'll simulate the process
  await new Promise(resolve => setTimeout(resolve, 2000));
  return imageUri;
}

export async function batchProcess(
  prompts: string[],
  onProgress: (progress: number) => void
): Promise<string[]> {
  const results: string[] = [];
  
  for (let i = 0; i < prompts.length; i++) {
    // This would integrate with your image generation service
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 1000));
    results.push(`https://source.unsplash.com/random/800x800?${encodeURIComponent(prompts[i])}`);
    onProgress((i + 1) / prompts.length);
  }
  
  return results;
}