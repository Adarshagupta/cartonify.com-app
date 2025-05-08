# Cartonify

A React Native/Expo app for AI image generation using Replicate's Flux model.

## Features

- Text-to-image generation with Replicate's Flux model
- Various style presets (photorealistic, cinematic, anime, etc.)
- Customizable generation parameters
- Save generated images to your device
- Share images directly from the app

## Setup

### 1. Installation

```bash
# Install dependencies
npm install
```

### 2. Replicate API Key

You need to get an API key from Replicate to use the Flux image generation:

1. Create an account on [Replicate](https://replicate.com/)
2. Go to your account settings and create an API token
3. Set the API key as an environment variable:

```bash
# For development
export REPLICATE_API_KEY=your_api_key_here

# Or create a .env file (don't commit this to git)
echo "REPLICATE_API_KEY=your_api_key_here" > .env
```

### 3. Run the app

```bash
# Start the development server
npm run dev
```

## Usage

1. Navigate to the "Generate" tab
2. Enter a text prompt describing the image you want to create
3. Select a style preset or use the advanced settings
4. Tap "Generate" to create your image
5. Save or share the generated image

## Style Presets

- **Photorealistic**: High-quality, realistic images
- **Cinematic**: Movie-style images with dramatic lighting
- **Anime**: Anime/manga style illustrations
- **Abstract**: Artistic, abstract compositions
- **Watercolor**: Soft, flowing watercolor style
- **Digital**: Clean, modern digital art
- **Vintage**: Retro, nostalgic imagery

## Advanced Settings

- **Image Dimensions**: Choose from square, portrait, or landscape formats
- **Number of Samples**: Generate multiple variations (1, 2, or 4)
- **Enhance Prompt**: Automatically enhance your prompt with additional details

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