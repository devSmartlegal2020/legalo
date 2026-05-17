import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import BlogForm from '@/components/admin/BlogForm';
import { blogAPI } from '@/services/api';

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const response = await blogAPI.getById(id!);
      const blogData = response.data.data.blog;
      
      setBlog({
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        category: blogData.category._id,
        status: blogData.status,
        tags: blogData.tags?.join(', ') || '',
        isFeatured: blogData.isFeatured,
        metaTitle: blogData.metaTitle || '',
        metaDescription: blogData.metaDescription || '',
        metaKeywords: blogData.metaKeywords?.join(', ') || '',
        canonicalUrl: blogData.canonicalUrl || '',
        featuredImage: blogData.featuredImage,
        scheduledPublishAt: blogData.scheduledPublishAt,
        cta: blogData.cta,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load blog');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/admin/blogs')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go back to blogs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Blog</h1>
        <p className="text-gray-500 mt-1">Update your blog post</p>
      </div>

      <BlogForm blogId={id} initialData={blog} />
    </div>
  );
};

export default EditBlog;
