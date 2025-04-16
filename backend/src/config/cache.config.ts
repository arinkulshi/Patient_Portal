const cacheConfig = {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), 
    checkPeriod: 60, 
    maxItems: 1000, 
    
    
    endpoints: {
      getAllReports: {
        enabled: true,
        ttl: 300, 
      },
      getReportById: {
        enabled: true,
        ttl: 600, 
    },
  };
  
  export default cacheConfig;