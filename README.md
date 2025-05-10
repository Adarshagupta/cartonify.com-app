# Cartonify

A React Native/Expo app for AI image generation using Replicate's Flux model.

## Features

- Text-to-image generation with Replicate's Flux model
- Various style presets (photorealistic, cinematic, anime, etc.)
- Customizable generation parameters
- Save generated images to your device
- Share images directly from the app

## Developer Guide

### 1. Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or newer recommended)
- npm or yarn
- Git
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS development)
- Android Studio (for Android development)

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd cartonify

# Install dependencies
npm install
```

### 3. Environment Setup

You need to set up environment variables for the API integration:

```bash
# Create a .env file in the project root
cp .env.example .env  # If .env.example exists, otherwise create a new file

# Edit the .env file and add your Replicate API key
echo "REPLICATE_API_KEY=your_api_key_here" > .env
```

To get a Replicate API key:
1. Create an account on [Replicate](https://replicate.com/)
2. Go to your account settings and create an API token

### 4. Running the App

```bash
# Start the development server
npm run dev

# Run on iOS
npm run ios

# Run on Android
npm run android
```

When you run the development server, you'll get a QR code. You can:
- Scan the QR code with the Expo Go app on your physical device
- Press 'i' to open in iOS simulator
- Press 'a' to open in Android emulator

### 5. Code Structure

- `/app`: Contains the main app screens and navigation (using Expo Router)
- `/components`: Reusable UI components
- `/hooks`: Custom React hooks
- `/utils`: Utility functions and API integration
- `/assets`: Images, fonts, and other static assets

### 6. Making Changes

1. **Code Editing**:
   - Use your preferred code editor (VS Code recommended)
   - Follow the existing code style and patterns
   - Fix React imports where needed (e.g., `import React from 'react'`)

2. **Component Structure**:
   - Components should be modular and reusable
   - Place new components in `/components`
   - Page-specific components can be co-located with their page

3. **Styling**:
   - Use StyleSheet for defining styles
   - Follow the existing styling patterns
   - Keep styles with their respective components

### 7. Building for Production

```bash
# Build for web
npm run build:web

# Build for iOS/Android using EAS
npx eas build --platform ios
npx eas build --platform android
```

For EAS builds, you'll need to configure your `eas.json` file and have an Expo account.

### 8. Testing

1. **Manual Testing**:
   - Test on multiple devices and screen sizes
   - Test all user flows and features
   - Verify API integration works correctly

2. **Troubleshooting**:
   - Check the Metro bundler logs for errors
   - Use `console.log()` for debugging (remove before production)
   - For iOS-specific issues, check Xcode logs
   - For Android-specific issues, check logcat

### 9. Common Issues and Solutions

- **Metro bundler issues**: Try clearing the cache with `expo start --clear`
- **Dependency issues**: Ensure all dependencies are properly installed with `npm install`
- **Build errors**: Check that your environment variables are correctly set
- **API connection issues**: Verify your Replicate API key is valid

### 10. Deployment

1. **App Store/Play Store**:
   - Configure app.json with appropriate values
   - Use EAS Build to create distribution builds
   - Follow the respective store guidelines for submission

2. **Web Deployment**:
   - Build for web with `npm run build:web`
   - Deploy the resulting build to your preferred hosting service

## API Integration

The app uses Replicate's Flux model for image generation. The integration can be found in `utils/api.ts`. 

Parameters that can be adjusted include:
- width/height
- guidance_scale (how closely to follow the prompt)
- num_inference_steps (more steps = higher quality but slower)
- negative_prompt (what to avoid in the image)

## Platform Support

- iOS
- Android
- Web (with some limitations)

## License

MIT
