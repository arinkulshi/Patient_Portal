const cacheConfig = {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes default
    checkPeriod: 60, // Check for expired items every 60 seconds
    maxItems: 1000, // Maximum number of items in cache
    
    // Specific cache settings for different endpoints
    endpoints: {
      getAllReports: {
        enabled: true,
        ttl: 300, // 5 minutes
      },
      getReportById: {
        enabled: true,
        ttl: 600, // 10 minutes
      },
    },
  };
  
  export default cacheConfig;