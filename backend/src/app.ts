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


const app = express();


app.use(helmet()); 
app.use(cors(serverConfig.cors)); 


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


if (serverConfig.nodeEnv !== 'test') {
  app.use(morgan('dev')); 
}
app.use(requestLoggerMiddleware); 


app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: serverConfig.nodeEnv
  });
});


let isInitialized = false;


export const initializeApp = async () => {
  if (isInitialized) {
    return;
  }
  
  try {
    console.log('Initializing repositories and services...');
    
    
    await reportRepository.initialize();
    
    
    await reportService.initialize();
    
    isInitialized = true;
    console.log('Application initialization complete.');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    throw error;
  }
};


app.use('/api', routes);


app.use(notFoundMiddleware); 
app.use(errorMiddleware);

export default app;