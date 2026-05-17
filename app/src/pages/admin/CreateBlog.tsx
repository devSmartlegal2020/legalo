import React from 'react';
import BlogForm from '@/components/admin/BlogForm';

const CreateBlog = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Blog</h1>
        <p className="text-gray-500 mt-1">Write and publish a new blog post</p>
      </div>

      <BlogForm />
    </div>
  );
};

export default CreateBlog;
