// backend/src/app.ts (update)
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import serverConfig from './config/server.config';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { requestLoggerMiddleware } from './middleware/request-logger.middleware';
import { reportRepository } from './repositories/report.repository';
import { reportService } from './services/report.service';

// Create Express application
const app = express();

// Security middleware
app.use(helmet()); // Set security headers
app.use(cors(serverConfig.cors)); // Configure CORS

// Request parsing middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Logging middleware
if (serverConfig.nodeEnv !== 'test') {
  app.use(morgan('dev')); // HTTP request logger
}
app.use(requestLoggerMiddleware); // Custom request logger

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: serverConfig.nodeEnv
  });
});

// Initialize repositories and services
let isInitialized = false;

/**
 * Initialize the application data stores and services
 */
export const initializeApp = async () => {
  if (isInitialized) {
    return;
  }
  
  try {
    console.log('Initializing repositories and services...');
    
    // Initialize repository (loads data from storage)
    await reportRepository.initialize();
    
    // Initialize service
    await reportService.initialize();
    
    isInitialized = true;
    console.log('Application initialization complete.');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    throw error;
  }
};

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundMiddleware); // 404 handler
app.use(errorMiddleware); // Global error handler

export default app;