import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

// Get the Replicate API key from environment variables or constants
const REPLICATE_API_KEY = Constants.expoConfig?.extra?.replicateApiKey || '';
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

// Debug function to verify API key
export function verifyApiKey(): string {
  const key = Constants.expoConfig?.extra?.replicateApiKey;
  console.log('API Key found:', key ? 'Yes (length: ' + key.length + ')' : 'No');
  // Only show first and last few characters for security
  if (key && key.length > 8) {
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  }
  return 'Not found';
}

/**
 * Interface for image generation settings
 */
interface GenerationSettings {
  width?: number;
  height?: number;
  samples?: number;
  guidanceScale?: number;
  enhancePrompt?: boolean;
  seed?: number;
  [key: string]: any; // Allow additional properties
}

/**
 * Generates an image using Replicate's image generation models
 * @param prompt The text prompt for image generation
 * @param preset The style preset to use
 * @param settings Optional additional generation settings
 */
export async function generateImage(
  prompt: string, 
  preset: string,
  settings: GenerationSettings = {}
): Promise<string> {
  console.log(`Generating image with prompt: ${prompt} and preset: ${preset}`);
  console.log('API key status:', verifyApiKey());
  
  if (!REPLICATE_API_KEY) {
    console.error('Missing Replicate API key');
    throw new Error('Missing Replicate API key');
  }

  // Map the preset to style prompts that work well with models
  const stylePrompt = getStylePromptForPreset(preset);
  const finalPrompt = stylePrompt ? `${prompt}, ${stylePrompt}` : prompt;
  
  // Try with SDXL model which has more reliable output format
  // We can switch back to Flux once we understand the output format better
  const modelVersion = "stability-ai/sdxl:8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f";
  
  const modelParams = {
    prompt: finalPrompt,
    negative_prompt: "blurry, low quality, distorted, deformed, disfigured",
    width: settings.width || 1024,
    height: settings.height || 1024,
    num_outputs: settings.samples || 1,
    guidance_scale: settings.guidanceScale || 7.5,
  };
  
  console.log('Using model:', modelVersion);
  console.log('Settings:', JSON.stringify(modelParams));
  
  try {
    // Create the prediction
    console.log('Sending request to Replicate API...');
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: modelVersion,
        input: modelParams
      })
    });
    
    const responseText = await response.text();
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('Replicate API error response:', responseText);
      throw new Error(`Replicate API error: ${response.status}`);
    }
    
    const prediction = JSON.parse(responseText);
    console.log('Prediction created, ID:', prediction.id);
    
    // Poll for the result
    return await pollForResult(prediction.id);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

/**
 * Poll the Replicate API for the prediction result
 */
async function pollForResult(predictionId: string): Promise<string> {
  const maxAttempts = 60; // 5 minutes with 5-second intervals
  let attempts = 0;
  
  console.log('Polling for result, ID:', predictionId);
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Poll attempt ${attempts + 1}/${maxAttempts}`);
      const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching prediction:', errorText);
        throw new Error(`Error fetching prediction: ${response.status}`);
      }
      
      const prediction = await response.json();
      console.log('Prediction status:', prediction.status);
      console.log('Prediction data:', JSON.stringify(prediction));
      
      if (prediction.status === 'succeeded') {
        // Properly handle the output based on the structure
        if (Array.isArray(prediction.output) && prediction.output.length > 0) {
          const imageUrl = prediction.output[0];
          // Verify that we have a valid URL
          if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
            console.log('Generation succeeded, URL:', imageUrl);
            return imageUrl;
          } else {
            console.error('Invalid image URL returned:', imageUrl);
            throw new Error('Invalid image URL returned from API');
          }
        } else {
          console.error('Unexpected output format:', prediction.output);
          throw new Error('Unexpected output format from API');
        }
      } else if (prediction.status === 'failed') {
        console.error('Generation failed:', prediction.error);
        throw new Error('Image generation failed: ' + (prediction.error || 'Unknown error'));
      }
      
      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    } catch (error) {
      console.error('Error polling for result:', error);
      throw error;
    }
  }
  
  throw new Error('Image generation timed out');
}

/**
 * Get default Flux model parameters
 */
function getDefaultFluxSettings() {
  return {
    num_inference_steps: 25,
    guidance_scale: 7.5,
    width: 1024,
    height: 1024,
    scheduler: "dpmpp_2m",
    negative_prompt: "blurry, low quality, distorted, deformed, disfigured"
  };
}

/**
 * Map application settings to Flux API parameters
 */
function mapSettingsToFluxParams(settings: any) {
  const mappedSettings: any = {};
  
  if (settings.width) mappedSettings.width = settings.width;
  if (settings.height) mappedSettings.height = settings.height;
  if (settings.guidanceScale) mappedSettings.guidance_scale = settings.guidanceScale;
  if (settings.samples) mappedSettings.num_outputs = settings.samples;
  
  return mappedSettings;
}

/**
 * Map style presets to effective prompt additions
 */
function getStylePromptForPreset(preset: string): string {
  const presetMap: Record<string, string> = {
    'photorealistic': 'highly detailed, photorealistic, professional photography, 8k, high resolution',
    'cinematic': 'cinematic film still, dramatic lighting, shallow depth of field, 35mm film',
    'anime': 'anime style, vibrant colors, 2D illustration, studio ghibli inspired',
    'abstract': 'abstract art, expressionist style, vibrant colors, creative composition',
    'watercolor': 'watercolor painting, artistic, traditional media, soft edges, flowing colors',
    'digital': 'digital art, crisp details, vivid colors, modern design, highly detailed',
    'vintage': 'vintage photograph, retro, nostalgic, film grain, desaturated colors',
    'default': ''
  };
  
  return presetMap[preset] || presetMap.default;
}

/**
 * Gets the user's generation history
 * In a real app, this would fetch from a database or API
 */
export async function getGenerationHistory(): Promise<Array<{
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  preset: string;
}>> {
  // This would normally fetch from a database or API
  // For demonstration, return mock data
  return [
    {
      id: '1',
      prompt: 'A futuristic city with flying cars and neon lights',
      imageUrl: 'https://images.pexels.com/photos/1809644/pexels-photo-1809644.jpeg?auto=compress&cs=tinysrgb&w=800',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      preset: 'cinematic',
    },
    {
      id: '2',
      prompt: 'A serene mountain landscape at sunset',
      imageUrl: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      preset: 'photorealistic',
    },
    {
      id: '3',
      prompt: 'An abstract representation of human emotions',
      imageUrl: 'https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg?auto=compress&cs=tinysrgb&w=800',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      preset: 'abstract',
    },
  ];
}

/**
 * Save an image to the gallery
 * Downloads the image from URL and saves it to device (if on native)
 */
export async function saveImageToGallery(imageData: {
  prompt: string;
  imageUrl: string;
  preset: string;
}): Promise<boolean> {
  console.log('Saving image:', imageData);
  
  // Validate URL
  if (!imageData.imageUrl || typeof imageData.imageUrl !== 'string' || !imageData.imageUrl.startsWith('http')) {
    console.error('Invalid image URL:', imageData.imageUrl);
    throw new Error('Invalid image URL provided');
  }
  
  if (Platform.OS === 'web') {
    // For web, trigger download
    window.open(imageData.imageUrl, '_blank');
  return true;
  } else {
    // For native, download and save to media library
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Media library permission not granted');
        return false;
      }
      
      console.log('Downloading image from:', imageData.imageUrl);
      
      // Create a unique filename based on timestamp
      const timestamp = new Date().getTime();
      const fileUri = `${FileSystem.documentDirectory}cartonify_${timestamp}.jpg`;
      
      // Download the image
      const downloadResult = await FileSystem.downloadAsync(
        imageData.imageUrl,
        fileUri
      );
      
      console.log('Download result:', downloadResult);
      
      if (downloadResult.status !== 200) {
        console.error('Download failed with status:', downloadResult.status);
        return false;
      }
      
      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      console.log('Asset created:', asset);
      return !!asset;
    } catch (error) {
      console.error('Error saving image:', error);
      return false;
    }
  }
}

/**
 * Share an image
 */
export async function shareImage(imageUrl: string): Promise<boolean> {
  console.log('Sharing image:', imageUrl);
  
  if (Platform.OS === 'web') {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this image!',
          url: imageUrl
        });
        return true;
      } else {
        // Fallback for browsers that don't support Web Share API
        window.open(imageUrl, '_blank');
        return true;
      }
    } catch (error) {
      console.error('Error sharing on web:', error);
    return false;
    }
  } else {
    try {
      // First download the image
      const fileUri = FileSystem.documentDirectory + 'cartonify_share.jpg';
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (downloadResult.status === 200) {
        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri);
    return true;
        } else {
          console.log('Sharing is not available on this device');
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error sharing image:', error);
      return false;
    }
  }
}