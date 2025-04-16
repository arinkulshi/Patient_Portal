import { Request, Response, NextFunction } from 'express';


export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
  if (req.path === '/health') {
    return next();
  }
  
  
  console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl} | IP: ${req.ip}`);
  
  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';
    
    console.log('Request Body:', JSON.stringify(sanitizedBody));
  }
  
  next();
};