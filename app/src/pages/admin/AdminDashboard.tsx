import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Users,
  FolderOpen,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  Calendar,
  Tag,
  BookOpen,
  Mail,
} from 'lucide-react';
import { blogAPI, categoryAPI, userAPI, eventAPI, promotionAPI, ebookAPI, newsletterAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalCategories: number;
  totalUsers: number;
  totalViews: number;
  totalEvents: number;
  totalPromotions: number;
  totalEbooks: number;
  totalSubscribers: number;
}

interface RecentBlog {
  _id: string;
  title: string;
  status: string;
  views: number;
  createdAt: string;
  category: { name: string };
}

const AdminDashboard = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalViews: 0,
    totalEvents: 0,
    totalPromotions: 0,
    totalEbooks: 0,
    totalSubscribers: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch data when auth is ready and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchDashboardData();
    }
  }, [authLoading, isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch blogs
      const blogsResponse = await blogAPI.getAll({ limit: 1000 });
      const blogs = blogsResponse.data.data.blogs;
      
      // Fetch categories
      const categoriesResponse = await categoryAPI.getAllAdmin();
      const categories = categoriesResponse.data.data.categories;

      // Fetch events
      const eventsResponse = await eventAPI.getAll({ limit: 1000 });
      const events = eventsResponse.data.data.events;

      // Fetch promotions
      const promotionsResponse = await promotionAPI.getAll({ limit: 1000 });
      const promotions = promotionsResponse.data.data.promotions;

      // Fetch ebooks
      const ebooksResponse = await ebookAPI.getAll({ limit: 1000 });
      const ebooks = ebooksResponse.data.data.ebooks;

      // Fetch newsletter subscribers
      const newsletterResponse = await newsletterAPI.getStats();
      const totalSubscribers = newsletterResponse.data.data?.totalSubscribers || 0;

      // Calculate stats
      const publishedBlogs = blogs.filter((b: any) => b.status === 'published');
      const totalViews = blogs.reduce((sum: number, b: any) => sum + (b.views || 0), 0);

      setStats({
        totalBlogs: blogs.length,
        publishedBlogs: publishedBlogs.length,
        draftBlogs: blogs.length - publishedBlogs.length,
        totalCategories: categories.length,
        totalUsers: 0, // Will be fetched separately for admin
        totalViews,
        totalEvents: events.length,
        totalPromotions: promotions.length,
        totalEbooks: ebooks.length,
        totalSubscribers,
      });

      // Get recent blogs
      setRecentBlogs(blogs.slice(0, 5));

      // Fetch users if admin
      if (user?.role === 'admin') {
        const usersResponse = await userAPI.getAll();
        setStats((prev) => ({
          ...prev,
          totalUsers: usersResponse.data.data.users.length,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/blogs',
    },
    {
      title: 'Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-green-500',
      link: '/admin/events',
    },
    {
      title: 'Promotions',
      value: stats.totalPromotions,
      icon: Tag,
      color: 'bg-red-500',
      link: '/admin/promotions',
    },
    {
      title: 'E-books',
      value: stats.totalEbooks,
      icon: BookOpen,
      color: 'bg-purple-500',
      link: '/admin/ebooks',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'bg-yellow-500',
      link: '/admin/categories',
    },
    {
      title: 'Subscribers',
      value: stats.totalSubscribers,
      icon: Mail,
      color: 'bg-pink-500',
      link: '/admin/newsletter-subscribers',
    },
    ...(user?.role === 'admin'
      ? [
          {
            title: 'Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-orange-500',
            link: '/admin/users',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name}! Here's what's happening with your blog.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/blogs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Blog
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">
                      {isLoading ? '-' : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    {React.createElement(stat.icon, { className: "h-6 w-6 text-white" })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Blogs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Blogs</CardTitle>
              <CardDescription>
                Your latest blog posts and their performance
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/blogs">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentBlogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No blogs yet. Create your first blog post!
            </div>
          ) : (
            <div className="space-y-4">
              {recentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{blog.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {blog.category?.name} • {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {blog.views}
                    </div>
                    <Badge
                      variant={blog.status === 'published' ? 'default' : 'secondary'}
                    >
                      {blog.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Views Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Total Views
          </CardTitle>
          <CardDescription>
            Combined views across all your published blogs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {isLoading ? '-' : stats.totalViews.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
