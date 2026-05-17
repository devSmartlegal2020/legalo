# Legalo Blog CMS - Frontend Integration

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `app` directory:

```bash
cp .env.example .env
```

Update the `.env` file with your backend URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
cd app
npm install
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd app
npm run dev
```

### 4. Access the Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Login with default credentials:
   - Email: `admin@legalo.com`
   - Password: `admin123`

### 5. First Steps

1. **Create Categories**: Go to Content > Categories and create your blog categories
2. **Create Your First Blog**: Go to Content > Add New to create a blog post
3. **Manage Users** (Admin only): Go to Users to add editors or admins

## Features

### Admin Dashboard
- **Overview**: Statistics, recent blogs, total views
- **Blog Management**: Create, edit, delete, publish/draft blogs
- **Categories**: Organize blogs by category
- **User Management** (Admin only): Manage team members with roles
- **SEO Management**: Meta titles, descriptions, keywords, canonical URLs

### Rich Text Editor (TipTap)
- Bold, Italic, Strikethrough
- Headings (H1, H2, H3)
- Lists (Bulleted & Numbered)
- Links with custom URLs
- Image upload and embed
- Blockquotes and Code blocks
- Horizontal rules
- Undo/Redo

### Image Management
- Drag and drop image upload
- Automatic file naming
- Local storage in backend
- Image preview in editor

### SEO Features
- Custom meta titles
- Meta descriptions
- Meta keywords
- Canonical URLs
- Open Graph image support
- Auto-generated slugs
- Read time calculation

## User Roles

### Admin
- Full access to all features
- Can manage users
- Can create/edit/delete categories
- Can publish/edit/delete all blogs

### Editor
- Can create and edit blogs
- Can manage categories
- Cannot manage users
- Can publish their own blogs

## API Endpoints

See the backend README for detailed API documentation.

### Key Frontend Routes

**Public:**
- `/` - Homepage
- `/artikel` - Blog listing
- `/artikel/:slug` - Individual blog post (to be implemented)

**Admin:**
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard overview
- `/admin/blogs` - Blog list
- `/admin/blogs/new` - Create blog
- `/admin/blogs/edit/:id` - Edit blog
- `/admin/categories` - Category management
- `/admin/users` - User management (Admin only)
- `/admin/settings` - Settings (Admin only)

## File Structure

```
app/src/
├── components/
│   └── admin/
│       ├── AdminLayout.tsx       # Admin dashboard layout
│       ├── BlogForm.tsx          # Blog creation/editing form
│       ├── ProtectedRoute.tsx    # Authentication guard
│       └── RichTextEditor.tsx    # TipTap editor component
├── context/
│   ├── AuthContext.tsx           # Authentication state management
│   └── LoadingContext.tsx        # Loading state (existing)
├── pages/
│   └── admin/
│       ├── AdminLogin.tsx        # Login page
│       ├── AdminDashboard.tsx    # Dashboard overview
│       ├── BlogList.tsx          # Blog management list
│       ├── CreateBlog.tsx        # Create new blog
│       ├── EditBlog.tsx          # Edit existing blog
│       ├── Categories.tsx        # Category management
│       ├── Users.tsx             # User management
│       └── Settings.tsx          # Settings page
├── services/
│   └── api.ts                    # API service functions
└── App.tsx                       # Updated with admin routes
```

## Next Steps

1. **Blog Detail Page**: Create a page to display individual blog posts
2. **Update Blog Sections**: Modify BlogListSection, BlogFeaturedSection to use API
3. **Production Setup**:
   - Set up production MongoDB
   - Configure production backend URL
   - Set up Cloudinary or AWS S3 for image storage
   - Configure SSL/HTTPS
   - Set up environment variables for production

## Troubleshooting

### Backend not connecting
- Ensure MongoDB is running
- Check that `VITE_API_URL` matches your backend URL
- Verify backend is running on port 5000

### Image uploads not working
- Check that the `uploads` folder exists in backend
- Ensure proper file permissions
- Check file size limits (default: 5MB)

### Login issues
- Verify backend is running and accessible
- Check that initial admin user was created
- Look for errors in browser console and backend logs

## Security Considerations

- Change default admin password immediately
- Use strong passwords in production
- Enable HTTPS in production
- Set up proper CORS configuration
- Never commit `.env` files with secrets
- Use environment variables for sensitive data

## Support

For issues or questions, please refer to the backend README or contact the development team.
