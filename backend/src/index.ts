import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import connectDB from './config/database';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { generalRateLimiter } from './middleware/rateLimit';
import { validateOrigin } from './middleware/security';
import { User } from './models';
import { startBlogScheduler } from './services/scheduler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (required for Cloudflare/reverse proxy to get correct client IPs)
app.set('trust proxy', 1);

// Global error handlers to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Connect to database
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Security: Prevent parameter pollution
app.use(hpp());

// Security: Sanitize MongoDB operators from user input
app.use(mongoSanitize());

// Helmet with security headers and CSP
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "http:", "https:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: [
        "'self'",
        "https://www.youtube.com",
        "https://youtube.com",
        "https://www.youtube-nocookie.com",
        "https://twitter.com",
        "https://x.com",
        "https://player.vimeo.com",
      ],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(compression());

// Logging: only in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsing with reasonable limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
} else {
  console.log('📁 Uploads directory exists:', uploadsDir);
}

// Static files with security headers
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('X-Content-Type-Options', 'nosniff');
    // Force download for PDFs
    if (filePath.endsWith('.pdf')) {
      res.set('Content-Disposition', 'attachment');
    }
  }
}));
console.log('📁 Serving static files from:', uploadsDir);

// General rate limiting
app.use(generalRateLimiter);

// CSRF origin validation defense-in-depth
app.use(validateOrigin);

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Create initial admin user
const createInitialAdmin = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping initial admin creation');
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        name: 'Admin',
        role: 'admin',
        isActive: true,
      });
      console.log('Initial admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}/api`);

  await createInitialAdmin();

  // Start the blog scheduler for automatic publishing
  startBlogScheduler();
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', error);
  }
});

export default app;
