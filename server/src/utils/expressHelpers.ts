import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest } from '../middleware/auth';

// Helper function to wrap controller functions for Express compatibility
export const asyncHandler = (fn: Function): RequestHandler => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Helper function to wrap auth controller functions for Express compatibility
export const asyncAuthHandler = (fn: Function): RequestHandler => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req as AuthRequest, res, next)).catch(next);
  }; 