import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to log request details
 */
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip logging for health check endpoint to reduce noise
  if (req.path === '/health') {
    return next();
  }
  
  // Log request details
  console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl} | IP: ${req.ip}`);
  
  // For POST/PUT requests, log the body (but sanitize sensitive data)
  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    // Create sanitized copy of body (e.g., remove passwords)
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';
    
    console.log('Request Body:', JSON.stringify(sanitizedBody));
  }
  
  next();
};