import path from 'path';


const dbConfig = {
  storage: {
    type: 'file',
    dataDir: process.env.DATA_DIR || path.join(__dirname, '../../src/data'),
    persistenceEnabled: true,
    persistInterval: 60000, // 1 minute
  },
  
  database: {
    type: process.env.DB_TYPE || 'none',
    url: process.env.DB_URL || '',
    name: process.env.DB_NAME || 'patient_portal',
  },
  
  entities: {
    reports: {
      filename: 'reports.json',
      idField: 'id',
    },
  },
};

export default dbConfig;