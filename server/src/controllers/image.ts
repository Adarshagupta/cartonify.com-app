import { Request, Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';
import * as fs from 'fs';
import * as path from 'path';

// Create a new image record
export const createImage = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, imageUrl, preset, width, height } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!prompt || !imageUrl) {
      return res.status(400).json({ error: 'Prompt and image URL are required' });
    }

    // Create image record in database
    const image = await prisma.image.create({
      data: {
        prompt,
        imageUrl,
        preset: preset || 'default',
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        userId
      }
    });

    res.status(201).json({ image });
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).json({ error: 'Server error creating image' });
  }
};

// Get all images (with optional user filter)
export const getAllImages = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '12');
    const skip = (page - 1) * limit;

    const whereClause = userId ? { userId } : {};

    // Get images with pagination
    const images = await prisma.image.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalImages = await prisma.image.count({
      where: whereClause
    });

    res.status(200).json({
      images,
      pagination: {
        total: totalImages,
        page,
        limit,
        pages: Math.ceil(totalImages / limit)
      }
    });
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ error: 'Server error getting images' });
  }
};

// Get image by ID
export const getImageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const image = await prisma.image.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.status(200).json({ image });
  } catch (error) {
    console.error('Error getting image:', error);
    res.status(500).json({ error: 'Server error getting image' });
  }
};

// Delete image
export const deleteImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the image first to check ownership
    const image = await prisma.image.findUnique({
      where: { id }
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Check if user owns the image
    if (image.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this image' });
    }

    // Delete the image from database
    await prisma.image.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Server error deleting image' });
  }
}; 