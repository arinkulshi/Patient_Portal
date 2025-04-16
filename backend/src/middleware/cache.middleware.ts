// backend/src/middleware/cache.middleware.ts
import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';
import cacheConfig from '../config/cache.config';


const cache = new NodeCache({
  stdTTL: cacheConfig.ttl,
  checkperiod: cacheConfig.checkPeriod,
  maxKeys: cacheConfig.maxItems,
  useClones: false  
});


export const generateCacheKey = (req: Request): string => {

  const baseKey = `${req.method}:${req.originalUrl}`;
  
  if (Object.keys(req.query).length > 0) {
    const queryString = JSON.stringify(req.query);
    return `${baseKey}:${queryString}`;
  }
  
  return baseKey;
};

/**
 * Cache middleware for API responses
 * @param ttl Time to live in seconds
 */
export const cacheMiddleware = (ttl: number = cacheConfig.ttl) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET' || !cacheConfig.enabled) {
      return next();
    }
    
    const key = generateCacheKey(req);
    
    // Try to get from cache
    const cachedData = cache.get(key);
    
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return res.json(cachedData);
    }
    
    // Cache miss, capture the response
    console.log(`Cache miss for key: ${key}`);
    
    // Store original send function
    const originalSend = res.json;
    
    // Override res.json method to intercept and cache response
    res.json = function(body: any): Response {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body, ttl);
        console.log(`Cached response for key: ${key} with TTL: ${ttl}s`);
      }
      
      // Call original method
      return originalSend.call(this, body);
    };
    
    next();
  };
};

/**
 * Invalidate cache for a specific pattern
 * @param pattern Pattern to match (e.g., "GET:/api/v1/reports")
 */
export const invalidateCache = (pattern: string): number => {
  const keys = cache.keys();
  let deletedCount = 0;
  
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
      deletedCount++;
    }
  });
  
  console.log(`Invalidated ${deletedCount} cache entries matching pattern: ${pattern}`);
  return deletedCount;
};

/**
 * Clear entire cache
 */
export const clearCache = (): void => {
  cache.flushAll();
  console.log('Cache cleared completely');
};

/**
 * Get cache stats
 */
export const getCacheStats = (): any => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    ksize: cache.getStats().ksize,
    vsize: cache.getStats().vsize
  };
};

// Add middleware to display cache stats
export const cacheStatsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/stats/cache') {
    res.json({
      enabled: cacheConfig.enabled,
      stats: getCacheStats(),
      config: {
        ttl: cacheConfig.ttl,
        checkPeriod: cacheConfig.checkPeriod,
        maxItems: cacheConfig.maxItems
      }
    });
  } else {
    next();
  }
};