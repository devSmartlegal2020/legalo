import { Request, Response, NextFunction } from 'express';

/**
 * Validates Origin/Referer headers for state-changing requests
 * to provide CSRF protection defense-in-depth.
 * 
 * Since JWT is stored in localStorage (CSRF-safe by default),
 * this middleware acts as an additional safeguard.
 */
export const validateOrigin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Only apply to state-changing methods
  const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!stateChangingMethods.includes(req.method)) {
    next();
    return;
  }

  // Skip for local development if origin is not present
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // If no origin/referer (e.g., direct API calls, mobile apps), skip in development
  if (!origin && !referer) {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({
        success: false,
        message: 'Origin header required for this request',
      });
      return;
    }
    next();
    return;
  }

  const checkUrl = origin || referer || '';
  
  const isAllowed = allowedOrigins.some((allowed) => {
    if (allowed === '*') return true;
    return checkUrl.startsWith(allowed);
  });

  if (!isAllowed) {
    res.status(403).json({
      success: false,
      message: 'Invalid origin',
    });
    return;
  }

  next();
};
