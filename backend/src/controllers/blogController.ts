import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Blog, Category } from '../models';
import { AuthRequest } from '../types';
import { generateUniqueSlug, calculateReadTime } from '../utils';
import { buildSearchQuery } from '../utils/regex';
import { sanitizeHtml } from '../utils/sanitize';

export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      featured,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['title', 'excerpt', 'content']);
      if (searchQuery) {
        Object.assign(query, searchQuery);
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('category', '_id name slug')
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getPublishedBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
    } = req.query;

    const query: any = { status: 'published' };

    if (category) query.category = category;
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['title', 'excerpt']);
      if (searchQuery) {
        Object.assign(query, searchQuery);
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('category', '_id name slug')
        .populate('author', 'name email avatar')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get published blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, status: 'published' })
      .populate('category', 'name slug defaultCta')
      .populate('author', 'name email avatar')
      .populate('cta');

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    // Resolve CTA: blog-specific CTA > category default CTA > null
    let resolvedCta = null;
    if (blog.cta) {
      resolvedCta = blog.cta;
    } else if ((blog.category as any)?.defaultCta) {
      const categoryCta = await Category.findById((blog.category as any)._id)
        .populate('defaultCta');
      if (categoryCta?.defaultCta && (categoryCta.defaultCta as any).isActive) {
        resolvedCta = categoryCta.defaultCta;
      }
    }

    res.json({
      success: true,
      data: { blog, resolvedCta },
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .populate('category', 'name slug defaultCta')
      .populate('author', 'name email avatar')
      .populate('cta');

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { blog },
    });
  } catch (error) {
    console.error('Get blog by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const createBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const {
      title,
      excerpt,
      content,
      category,
      status,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      isFeatured,
      scheduledPublishAt,
    } = req.body;

    const slug = await generateUniqueSlug(title, async (s) => {
      const exists = await Blog.findOne({ slug: s });
      return !!exists;
    });

    const readTime = calculateReadTime(content);

    // Determine publish state
    let blogStatus = status || 'draft';
    let publishedAt: Date | null = null;
    let scheduledAt: Date | null = null;

    if (scheduledPublishAt) {
      const scheduleDate = new Date(scheduledPublishAt);
      if (scheduleDate > new Date()) {
        blogStatus = 'scheduled';
        scheduledAt = scheduleDate;
      } else {
        blogStatus = 'published';
        publishedAt = new Date();
      }
    } else if (blogStatus === 'published') {
      publishedAt = new Date();
    }

    // Handle image: either from file upload or from body (URL)
    let featuredImagePath = '';
    if (req.file) {
      featuredImagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.featuredImage) {
      featuredImagePath = req.body.featuredImage;
    }

    const blog = await Blog.create({
      title,
      slug,
      excerpt: sanitizeHtml(excerpt),
      content: sanitizeHtml(content),
      featuredImage: featuredImagePath,
      category,
      author: req.user?._id,
      status: blogStatus,
      publishedAt,
      scheduledPublishAt: scheduledAt,
      readTime,
      tags: tags || [],
      metaTitle: sanitizeHtml(metaTitle || title),
      metaDescription: sanitizeHtml(metaDescription || excerpt),
      metaKeywords: metaKeywords || [],
      canonicalUrl: canonicalUrl || '',
      ogImage: featuredImagePath,
      isFeatured: isFeatured || false,
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate('category', 'name slug defaultCta')
      .populate('author', 'name email avatar')
      .populate('cta');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog: populatedBlog },
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      category,
      status,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      isFeatured,
      scheduledPublishAt,
      cta,
    } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    const readTime = content ? calculateReadTime(content) : blog.readTime;

    // Determine new status and dates
    let newStatus = status || blog.status;
    let publishedAt: Date | undefined = blog.publishedAt || undefined;
    let scheduledAt: Date | undefined = blog.scheduledPublishAt || undefined;

    if (scheduledPublishAt !== undefined) {
      if (scheduledPublishAt) {
        const scheduleDate = new Date(scheduledPublishAt);
        if (scheduleDate > new Date()) {
          newStatus = 'scheduled';
          scheduledAt = scheduleDate;
          publishedAt = undefined;
        } else {
          newStatus = 'published';
          scheduledAt = undefined;
          publishedAt = new Date();
        }
      } else {
        // Unscheduling: clear scheduled date and revert to draft
        scheduledAt = undefined;
        if (newStatus === 'scheduled') {
          newStatus = 'draft';
        }
      }
    } else if (newStatus === 'published' && blog.status !== 'published') {
      // Publishing now
      publishedAt = new Date();
      scheduledAt = undefined;
    } else if (newStatus === 'draft' && blog.status === 'scheduled') {
      // Unscheduling via status change
      scheduledAt = undefined;
    }

    const updateData: any = {
      title: title || blog.title,
      excerpt: excerpt ? sanitizeHtml(excerpt) : blog.excerpt,
      content: content ? sanitizeHtml(content) : blog.content,
      category: category || blog.category,
      status: newStatus,
      publishedAt,
      scheduledPublishAt: scheduledAt,
      readTime,
      tags: tags || blog.tags,
      metaTitle: metaTitle ? sanitizeHtml(metaTitle) : blog.metaTitle,
      metaDescription: metaDescription ? sanitizeHtml(metaDescription) : blog.metaDescription,
      metaKeywords: metaKeywords || blog.metaKeywords,
      canonicalUrl: canonicalUrl || blog.canonicalUrl,
      isFeatured: isFeatured !== undefined ? isFeatured : blog.isFeatured,
    };

    if (cta !== undefined) {
      if (cta === '' || cta === null) {
        updateData.cta = null;
      } else {
        updateData.cta = cta;
      }
    }

    if (req.file) {
      updateData.featuredImage = `/uploads/${req.file.filename}`;
      updateData.ogImage = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name slug defaultCta')
      .populate('author', 'name email avatar')
      .populate('cta');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog: updatedBlog },
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    await Blog.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Bulk delete blogs (permanent deletion)
export const bulkDeleteBlogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;
    
    // Validation
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide an array of blog IDs',
      });
      return;
    }

    // Best practice: Limit bulk operations to prevent timeout issues
    const MAX_BULK_LIMIT = 100;
    if (ids.length > MAX_BULK_LIMIT) {
      res.status(400).json({
        success: false,
        message: `Cannot delete more than ${MAX_BULK_LIMIT} blogs at once. Please select fewer blogs.`,
      });
      return;
    }

    // Validate all IDs are valid MongoDB ObjectIds
    const validIds = ids.filter(id => /^[0-9a-fA-F]{24}$/.test(id));
    if (validIds.length !== ids.length) {
      res.status(400).json({
        success: false,
        message: 'Some IDs are invalid',
      });
      return;
    }

    // Perform bulk delete
    const result = await Blog.deleteMany({ _id: { $in: validIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} blog(s) deleted successfully`,
      data: {
        deletedCount: result.deletedCount,
        requestedCount: ids.length,
      },
    });
  } catch (error) {
    console.error('Bulk delete blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const recommendKeywords = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
      return;
    }

    const { title, content, country, maxKeywords } = req.body;

    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
      return;
    }

    // Check if API keys are configured
    const { Setting } = require('../models');
    const ahrefsKey = await Setting.getValue('AHREFS_API_KEY');
    const openaiKey = await Setting.getValue('OPENAI_API_KEY');

    if (!openaiKey) {
      res.status(400).json({
        success: false,
        message: 'OpenAI API key is not configured. Please configure it in Settings.',
      });
      return;
    }

    const { generateRecommendations } = require('../services/keywordService');

    const recommendations = await generateRecommendations(
      title,
      content,
      country || 'id',
      maxKeywords || 10
    );

    res.json({
      success: true,
      data: {
        keywords: recommendations,
        source: ahrefsKey ? 'ahrefs' : 'openai-estimated',
        totalResults: recommendations.length,
      },
    });
  } catch (error: any) {
    console.error('Recommend keywords error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate keyword recommendations',
    });
  }
};

// Bulk archive blogs (soft delete - change status to draft)
export const bulkArchiveBlogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;
    
    // Validation
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide an array of blog IDs',
      });
      return;
    }

    // Best practice: Limit bulk operations to prevent timeout issues
    const MAX_BULK_LIMIT = 100;
    if (ids.length > MAX_BULK_LIMIT) {
      res.status(400).json({
        success: false,
        message: `Cannot archive more than ${MAX_BULK_LIMIT} blogs at once. Please select fewer blogs.`,
      });
      return;
    }

    // Validate all IDs are valid MongoDB ObjectIds
    const validIds = ids.filter(id => /^[0-9a-fA-F]{24}$/.test(id));
    if (validIds.length !== ids.length) {
      res.status(400).json({
        success: false,
        message: 'Some IDs are invalid',
      });
      return;
    }

    // Perform bulk archive - set status to draft and remove featured status
    const result = await Blog.updateMany(
      { _id: { $in: validIds } },
      { 
        $set: { 
          status: 'draft',
          isFeatured: false,
        } 
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} blog(s) archived successfully`,
      data: {
        archivedCount: result.modifiedCount,
        requestedCount: ids.length,
      },
    });
  } catch (error) {
    console.error('Bulk archive blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk archive',
    });
  }
};

export const getFeaturedBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 3;

    const blogs = await Blog.find({ 
      status: 'published', 
      isFeatured: true 
    })
      .populate('category', 'name slug')
      .populate('author', 'name email avatar')
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { blogs },
    });
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getPopularBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const blogs = await Blog.find({ status: 'published' })
      .populate('category', 'name slug')
      .populate('author', 'name email avatar')
      .sort({ views: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { blogs },
    });
  } catch (error) {
    console.error('Get popular blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
