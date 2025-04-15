import path from 'path';

/**
 * Database configuration
 * Currently using file-based storage, but can be extended for other databases
 */
const dbConfig = {
  // In-memory storage initially, with file persistence
  storage: {
    type: 'file',
    dataDir: process.env.DATA_DIR || path.join(__dirname, '../../src/data'),
    persistenceEnabled: true,
    persistInterval: 60000, // 1 minute
  },
  
  // Future database configuration (for extensibility)
  database: {
    // Could be configured for MongoDB, PostgreSQL, etc. in the future
    type: process.env.DB_TYPE || 'none',
    url: process.env.DB_URL || '',
    name: process.env.DB_NAME || 'patient_portal',
  },
  
  // Entity configurations
  entities: {
    reports: {
      filename: 'reports.json',
      idField: 'id',
    },
  },
};

export default dbConfig;