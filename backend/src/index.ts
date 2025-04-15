// backend/src/index.ts
import app, { initializeApp } from './app';
import http from 'http';
import serverConfig from './config/server.config';
import { reportRepository } from './repositories/report.repository';

/**
 * Normalize port into a number, string, or false.
 */
function normalizePort(val: string | number): number | string | boolean {
  const port = parseInt(val as string, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Get port from environment and store in Express
const port = normalizePort(serverConfig.port);
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + (addr?.port || port);
  console.log(`Server listening on ${bind} in ${serverConfig.nodeEnv} mode`);
}

// Initialize the application first, then start the server
initializeApp()
  .then(() => {
    // Listen on provided port, on all network interfaces
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

// Handle graceful shutdown
const gracefulShutdown = async () => {
  console.log('Starting graceful shutdown...');
  
  // Close repositories to ensure data is persisted
  try {
    await reportRepository.close();
    console.log('Repositories closed successfully');
  } catch (error) {
    console.error('Error closing repositories:', error);
  }
  
  // Close server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  
  // Force close if graceful shutdown fails
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default server;