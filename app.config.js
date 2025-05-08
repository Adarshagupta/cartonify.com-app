const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

// Load environment variables from .env file
const env = dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenvExpand.expand(env);

// For debugging purposes
console.log('ENV loaded, REPLICATE_API_KEY exists:', !!process.env.REPLICATE_API_KEY);
if (process.env.REPLICATE_API_KEY) {
  console.log('API Key length:', process.env.REPLICATE_API_KEY.length);
}

module.exports = ({ config }) => {
  // Get API key from environment variable - hardcode for testing if needed
  // const replicateApiKey = process.env.REPLICATE_API_KEY || '';
  const replicateApiKey = 'r8_6YHgczuNgZBHw8WQRhovRQl5oggTwWq0hGNXi';
  
  return {
    ...config,
    name: "Cartonify",
    slug: "cartonify",
    extra: {
      replicateApiKey,
      eas: {
        projectId: "your-eas-project-id",
      },
    },
  };
}; 