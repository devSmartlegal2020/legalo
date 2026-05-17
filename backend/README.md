# Legalo CMS Backend

A comprehensive Content Management System backend for managing blog posts, categories, and users.

## Features

- **Authentication**: JWT-based authentication with role-based access control (Admin/Editor)
- **Blog Management**: Full CRUD operations for blog posts with SEO support
- **Categories**: Manage blog categories with slug generation
- **User Management**: Admin can manage users with different roles
- **File Uploads**: Image upload support with local storage
- **SEO Optimization**: Meta tags, Open Graph, canonical URLs support
- **Rich Text Editor Ready**: Backend supports HTML content from TipTap editor

## Tech Stack

- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: Type safety
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication tokens
- **Multer**: File upload handling
- **Slugify**: URL slug generation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legalo-cms
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@legalo.com
ADMIN_PASSWORD=your-secure-password
```

4. Make sure MongoDB is running

5. Start the server:
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Blogs
- `GET /api/blogs/public` - Get published blogs (public)
- `GET /api/blogs/featured` - Get featured blogs (public)
- `GET /api/blogs/popular` - Get popular blogs (public)
- `GET /api/blogs/slug/:slug` - Get blog by slug (public)
- `GET /api/blogs` - Get all blogs (authenticated)
- `POST /api/blogs` - Create blog (authenticated)
- `PUT /api/blogs/:id` - Update blog (authenticated)
- `DELETE /api/blogs/:id` - Delete blog (authenticated)

### Categories
- `GET /api/categories/public` - Get active categories (public)
- `GET /api/categories` - Get all categories (authenticated)
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `PATCH /api/users/:id/toggle-status` - Toggle user status (admin only)

### Uploads
- `POST /api/upload` - Upload image (authenticated)
- `DELETE /api/upload/:filename` - Delete image (authenticated)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── blogController.ts    # Blog CRUD operations
│   │   ├── categoryController.ts # Category management
│   │   ├── userController.ts    # User management
│   │   └── uploadController.ts  # File upload handling
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── errorHandler.ts      # Error handling
│   │   └── upload.ts            # Multer configuration
│   ├── models/
│   │   ├── User.ts              # User model
│   │   ├── Category.ts          # Category model
│   │   └── Blog.ts              # Blog model
│   ├── routes/
│   │   ├── auth.ts              # Auth routes
│   │   ├── blogs.ts             # Blog routes
│   │   ├── categories.ts        # Category routes
│   │   ├── users.ts             # User routes
│   │   └── upload.ts            # Upload routes
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   ├── slug.ts              # Slug generation
│   │   └── readTime.ts          # Read time calculation
│   └── index.ts                 # Main entry point
├── uploads/                      # Uploaded files storage
├── .env                          # Environment variables
├── .env.example                  # Environment example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Default Admin User

The system automatically creates an admin user on first startup:
- **Email**: admin@legalo.com (or from ADMIN_EMAIL env var)
- **Password**: admin123 (or from ADMIN_PASSWORD env var)

**⚠️ Important**: Change the default password in production!

## Database Models

### User
- email (unique, required)
- password (hashed, required)
- name (required)
- role (admin/editor)
- avatar (optional)
- isActive (boolean)
- timestamps

### Category
- name (unique, required)
- slug (unique, required)
- description (optional)
- isActive (boolean)
- timestamps

### Blog
- title (required)
- slug (unique, required)
- excerpt (required)
- content (required, HTML)
- featuredImage (optional)
- category (reference to Category)
- author (reference to User)
- status (draft/published)
- publishedAt (date)
- readTime (number, auto-calculated)
- tags (array)
- views (number)
- SEO fields (metaTitle, metaDescription, metaKeywords, canonicalUrl, ogImage)
- isFeatured (boolean)
- timestamps

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Role-based access control
- Input validation with express-validator
- Helmet.js for security headers
- CORS protection
- File upload validation (type and size)
- MongoDB injection protection
- XSS protection through input sanitization

## License

ISC
