import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

/**
 * Middleware to handle 404 Not Found errors
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(`Resource not found: ${req.originalUrl}`, 404, 'RESOURCE_NOT_FOUND'));
};
