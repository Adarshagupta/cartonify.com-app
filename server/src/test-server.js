// Simple Express test server without database
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock database
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    name: 'Test User',
    avatarUrl: null,
    bio: 'This is a test user',
    createdAt: new Date().toISOString()
  }
];

const mockImages = [
  {
    id: '1',
    prompt: 'A beautiful sunset over mountains',
    imageUrl: 'https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106',
    preset: 'default',
    width: 800,
    height: 600,
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: '1',
      username: 'testuser',
      name: 'Test User',
      avatarUrl: null
    }
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Test server is running' });
});

// Public routes
app.get('/api/images', (req, res) => {
  res.status(200).json({
    images: mockImages,
    pagination: {
      total: mockImages.length,
      page: 1,
      limit: 10,
      pages: 1
    }
  });
});

app.get('/api/images/:id', (req, res) => {
  const image = mockImages.find(img => img.id === req.params.id);
  if (!image) {
    return res.status(404).json({ error: 'Image not found' });
  }
  res.status(200).json({ image });
});

app.get('/api/users/profile/:username', (req, res) => {
  const user = mockUsers.find(u => u.username === req.params.username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userImages = mockImages.filter(img => img.userId === user.id);
  
  res.status(200).json({
    user: {
      ...user,
      images: userImages,
      totalImages: userImages.length
    }
  });
});

// Authentication routes
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({
    user: {
      id: '2',
      email: req.body.email,
      username: req.body.username,
      name: req.body.name || req.body.username,
      avatarUrl: null
    },
    token: 'mock-jwt-token-for-testing'
  });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({
    user: {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      avatarUrl: null
    },
    token: 'mock-jwt-token-for-testing'
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(200).json({
    user: {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      bio: 'This is a test user',
      avatarUrl: null,
      createdAt: new Date().toISOString()
    }
  });
});

// Protected routes (no actual authentication in test server)
app.post('/api/images', (req, res) => {
  const newImage = {
    id: Date.now().toString(),
    prompt: req.body.prompt,
    imageUrl: req.body.imageUrl,
    preset: req.body.preset || 'default',
    width: req.body.width || 512,
    height: req.body.height || 512,
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockImages.push(newImage);
  
  res.status(201).json({ image: newImage });
});

app.delete('/api/images/:id', (req, res) => {
  const imageIndex = mockImages.findIndex(img => img.id === req.params.id);
  if (imageIndex === -1) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  mockImages.splice(imageIndex, 1);
  
  res.status(200).json({ message: 'Image deleted successfully' });
});

app.put('/api/users/profile', (req, res) => {
  res.status(200).json({
    user: {
      id: '1',
      email: 'test@example.com',
      username: req.body.username || 'testuser',
      name: req.body.name || 'Test User',
      bio: req.body.bio || 'This is a test user',
      avatarUrl: null,
      createdAt: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 