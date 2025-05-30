import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';


export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(`Resource not found: ${req.originalUrl}`, 404, 'RESOURCE_NOT_FOUND'));
};
