import rateLimit from 'express-rate-limit';

// Trust proxy headers (required for Cloudflare/reverse proxy)
export const applyTrustProxy = (): void => {
  // This will be applied to the express app in index.ts
};

// Strict limit for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
  skip: () => {
    return false;
  },
});

// General API rate limiter
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

// Stricter limit for file upload endpoints
export const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 uploads per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many file uploads. Please try again later.',
  },
});

// Stricter limit for import endpoints (memory intensive)
export const importRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 imports per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many import requests. Please try again later.',
  },
});

// Rate limiter for keyword recommendations (API intensive)
export const keywordRecommendationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 recommendations per window per user
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many keyword analysis requests. Please try again in 15 minutes.',
  },
  keyGenerator: (req) => {
    // Use user ID if available, otherwise IP
    return (req as any).user?._id || req.ip || 'anonymous';
  },
  validate: { default: false },
});
