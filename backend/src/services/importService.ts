import { Blog, Category, User, ImportLog } from '../models';
import { WordPressExport, WordPressPost } from '../types';
import { parseWordPressXML, validateWordPressExport } from './xmlParser';
import {
  extractImageUrls,
  downloadImages,
  replaceImageUrls,
  deleteDownloadedImages,
} from './imageDownloader';
import slugify from 'slugify';
import path from 'path';
import fs from 'fs';

// Import configuration
const IMPORT_CONFIG = {
  UPLOAD_DIR: path.join(process.cwd(), 'uploads', 'imported'),
  BATCH_SIZE: 10,
};

// Active imports Map to track progress
const activeImports = new Map<string, {
  abort: boolean;
  progress: number;
}>();

export interface ImportOptions {
  defaultStatus: 'draft' | 'published';
  defaultUserId: string;
}

export interface ImportResult {
  success: boolean;
  importId?: string;
  error?: string;
  totalPosts: number;
  importedPosts: number;
  failedPosts: number;
}

export interface ImportProgress {
  importId: string;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  totalPosts: number;
  processedPosts: number;
  successCount: number;
  errorCount: number;
  currentOperation: string;
  currentPostTitle?: string;
  percentComplete: number;
  errors: Array<{
    postTitle: string;
    error: string;
    timestamp: Date;
  }>;
}

/**
 * Start a new WordPress import
 */
export async function startWordPressImport(
  xmlContent: string,
  filename: string,
  userId: string,
  options: ImportOptions
): Promise<ImportResult> {
  try {
    // Parse XML
    const exportData = parseWordPressXML(xmlContent);
    
    // Validate
    const validation = validateWordPressExport(exportData);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
        totalPosts: 0,
        importedPosts: 0,
        failedPosts: 0,
      };
    }

    // Create import log
    const importLog = await ImportLog.create({
      filename,
      status: 'processing',
      totalPosts: exportData.posts.length,
      processedPosts: 0,
      successCount: 0,
      errorCount: 0,
      createdBlogs: [],
      createdCategories: [],
      downloadedImages: [],
      errors: [],
      metadata: {
        sourceWordPressUrl: exportData.baseBlogUrl,
        exportDate: exportData.pubDate,
        version: exportData.wxrVersion,
      },
    });

    // Initialize active import tracking
    activeImports.set(importLog._id.toString(), {
      abort: false,
      progress: 0,
    });

    // Process import asynchronously
    processImport(importLog._id.toString(), exportData, userId, options).catch((error) => {
      console.error('Import processing error:', error);
      updateImportStatus(importLog._id.toString(), 'failed', error.message);
    });

    return {
      success: true,
      importId: importLog._id.toString(),
      totalPosts: exportData.posts.length,
      importedPosts: 0,
      failedPosts: 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      totalPosts: 0,
      importedPosts: 0,
      failedPosts: 0,
    };
  }
}

/**
 * Process the import
 */
async function processImport(
  importId: string,
  exportData: WordPressExport,
  userId: string,
  options: ImportOptions
): Promise<void> {
  const importRecord = await ImportLog.findById(importId);
  if (!importRecord) return;

  const createdBlogs: string[] = [];
  const createdCategories: string[] = [];
  const downloadedImages: string[] = [];
  const errors: Array<{ postTitle: string; error: string; timestamp: Date }> = [];

  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  // Ensure upload directory exists
  if (!fs.existsSync(IMPORT_CONFIG.UPLOAD_DIR)) {
    fs.mkdirSync(IMPORT_CONFIG.UPLOAD_DIR, { recursive: true });
  }

  try {
    for (let i = 0; i < exportData.posts.length; i++) {
      const wpPost = exportData.posts[i];
      
      // Check if import was cancelled
      const activeImport = activeImports.get(importId);
      if (activeImport?.abort) {
        await updateImportStatus(importId, 'cancelled');
        return;
      }

      // Update current operation
      await updateImportProgress(importId, {
        currentOperation: `Processing post ${i + 1} of ${exportData.posts.length}`,
        currentPostTitle: wpPost.postTitle,
        processedPosts: processedCount,
      });

      try {
        // Process single post
        const result = await processSinglePost(
          wpPost,
          exportData,
          userId,
          options,
          createdCategories
        );

        if (result.success && result.blogId) {
          createdBlogs.push(result.blogId);
          if (result.downloadedImages) {
            downloadedImages.push(...result.downloadedImages);
          }
          successCount++;
        } else {
          errors.push({
            postTitle: wpPost.postTitle,
            error: result.error || 'Unknown error',
            timestamp: new Date(),
          });
          errorCount++;
        }
      } catch (error) {
        errors.push({
          postTitle: wpPost.postTitle,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
        });
        errorCount++;
      }

      processedCount++;

      // Update progress periodically
      if (i % IMPORT_CONFIG.BATCH_SIZE === 0 || i === exportData.posts.length - 1) {
        await ImportLog.findByIdAndUpdate(importId, {
          processedPosts: processedCount,
          successCount,
          errorCount,
          errors,
          currentOperation: `Processed ${processedCount} of ${exportData.posts.length} posts`,
        });
      }
    }

    // Mark as completed
    await ImportLog.findByIdAndUpdate(importId, {
      status: 'completed',
      processedPosts: processedCount,
      successCount,
      errorCount,
      errors,
      createdBlogs,
      createdCategories,
      downloadedImages,
      completedAt: new Date(),
      currentOperation: 'Import completed',
    });

  } catch (error) {
    console.error('Import processing error:', error);
    await ImportLog.findByIdAndUpdate(importId, {
      status: 'failed',
      processedPosts: processedCount,
      successCount,
      errorCount,
      errors,
      createdBlogs,
      createdCategories,
      downloadedImages,
      currentOperation: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  } finally {
    activeImports.delete(importId);
  }
}

/**
 * Process a single WordPress post
 */
async function processSinglePost(
  wpPost: WordPressPost,
  exportData: WordPressExport,
  userId: string,
  options: ImportOptions,
  createdCategories: string[]
): Promise<{ success: boolean; blogId?: string; downloadedImages?: string[]; error?: string }> {
  try {
    // Resolve category
    let categoryId = '';
    if (wpPost.categories.length > 0) {
      categoryId = await resolveCategory(wpPost.categories[0], createdCategories);
    } else {
      // Use default category or create one
      categoryId = await resolveCategory('Uncategorized', createdCategories);
    }

    // Resolve author
    const authorId = await resolveAuthor(wpPost.postAuthor, exportData.authors, userId);

    // Process slug
    const baseSlug = wpPost.postName || slugify(wpPost.postTitle, { lower: true, strict: true });
    const slug = await resolveSlugConflict(baseSlug);

    // Process images
    const contentImages = extractImageUrls(wpPost.postContent);
    let processedContent = wpPost.postContent;
    const downloadedImagePaths: string[] = [];

    if (contentImages.length > 0) {
      const imageResults = await downloadImages(contentImages, IMPORT_CONFIG.UPLOAD_DIR);
      
      const urlMap = new Map<string, { localPath: string; filename: string }>();
      imageResults.forEach((result) => {
        if (result.success) {
          urlMap.set(result.originalUrl, {
            localPath: result.localPath,
            filename: result.filename,
          });
          downloadedImagePaths.push(result.localPath);
        }
      });

      processedContent = replaceImageUrls(wpPost.postContent, urlMap);
    }

    // Calculate excerpt if not provided
    let excerpt = wpPost.postExcerpt;
    if (!excerpt) {
      // Strip HTML and take first 150 characters
      excerpt = wpPost.postContent.replace(/<[^>]*>/g, '').substring(0, 150);
      if (wpPost.postContent.replace(/<[^>]*>/g, '').length > 150) {
        excerpt += '...';
      }
    }

    // Determine status
    const status = wpPost.postStatus === 'publish' ? options.defaultStatus : 'draft';

    // Create blog post
    const blog = await Blog.create({
      title: wpPost.postTitle,
      slug,
      excerpt: excerpt.substring(0, 500),
      content: processedContent,
      category: categoryId,
      author: authorId,
      status,
      publishedAt: status === 'published' ? wpPost.postDate : null,
      readTime: calculateReadTime(processedContent),
      tags: wpPost.tags,
      metaTitle: wpPost.postTitle,
      metaDescription: excerpt.substring(0, 160),
      isFeatured: wpPost.isSticky,
    });

    return {
      success: true,
      blogId: blog._id.toString(),
      downloadedImages: downloadedImagePaths,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Resolve or create category
 */
async function resolveCategory(
  categoryName: string,
  createdCategories: string[]
): Promise<string> {
  // Try to find existing category (case-insensitive)
  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${categoryName}$`, 'i') },
  });

  if (existingCategory) {
    return existingCategory._id.toString();
  }

  // Create new category
  const category = await Category.create({
    name: categoryName,
    slug: slugify(categoryName, { lower: true, strict: true }),
    description: '',
    isActive: true,
  });

  createdCategories.push(category._id.toString());
  return category._id.toString();
}

/**
 * Resolve author
 */
async function resolveAuthor(
  authorId: string,
  authors: any[],
  defaultUserId: string
): Promise<string> {
  // Find author details from WordPress export
  const wpAuthor = authors.find((a) => a.authorId === authorId);
  
  if (wpAuthor) {
    // Try to match by email
    if (wpAuthor.authorEmail) {
      const userByEmail = await User.findOne({ email: wpAuthor.authorEmail });
      if (userByEmail) {
        return userByEmail._id.toString();
      }
    }

    // Try to match by name
    if (wpAuthor.authorDisplayName) {
      const userByName = await User.findOne({
        name: { $regex: new RegExp(`^${wpAuthor.authorDisplayName}$`, 'i') },
      });
      if (userByName) {
        return userByName._id.toString();
      }
    }
  }

  // Fallback to default user
  return defaultUserId;
}

/**
 * Resolve slug conflict by appending timestamp
 */
async function resolveSlugConflict(baseSlug: string): Promise<string> {
  const existingBlog = await Blog.findOne({ slug: baseSlug });
  
  if (!existingBlog) {
    return baseSlug;
  }

  // Append timestamp to make it unique
  const timestamp = Date.now();
  return `${baseSlug}-imported-${timestamp}`;
}

/**
 * Calculate read time in minutes
 */
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Update import progress
 */
async function updateImportProgress(
  importId: string,
  updates: Partial<{
    currentOperation: string;
    currentPostTitle: string;
    processedPosts: number;
  }>
): Promise<void> {
  await ImportLog.findByIdAndUpdate(importId, updates);
}

/**
 * Update import status
 */
async function updateImportStatus(
  importId: string,
  status: 'processing' | 'completed' | 'failed' | 'cancelled',
  errorMessage?: string
): Promise<void> {
  const update: any = { status };
  
  if (status === 'completed') {
    update.completedAt = new Date();
  } else if (status === 'cancelled') {
    update.cancelledAt = new Date();
  } else if (status === 'failed' && errorMessage) {
    update.currentOperation = `Failed: ${errorMessage}`;
  }

  await ImportLog.findByIdAndUpdate(importId, update);
}

/**
 * Get import progress
 */
export async function getImportProgress(importId: string): Promise<ImportProgress | null> {
  const importLog = await ImportLog.findById(importId);
  
  if (!importLog) {
    return null;
  }

  const percentComplete = importLog.totalPosts > 0
    ? Math.round((importLog.processedPosts / importLog.totalPosts) * 100)
    : 0;

  return {
    importId: importLog._id.toString(),
    status: importLog.status,
    totalPosts: importLog.totalPosts,
    processedPosts: importLog.processedPosts,
    successCount: importLog.successCount,
    errorCount: importLog.errorCount,
    currentOperation: importLog.currentOperation || 'Processing...',
    currentPostTitle: importLog.currentPostTitle,
    percentComplete,
    errors: importLog.errors || [],
  };
}

/**
 * Cancel an import
 */
export async function cancelImport(importId: string, userId: string): Promise<boolean> {
  const importRecord = await ImportLog.findById(importId);
  
  if (!importRecord || importRecord.status !== 'processing') {
    return false;
  }

  // Mark for abortion
  const activeImport = activeImports.get(importId);
  if (activeImport) {
    activeImport.abort = true;
  }

  // Update status
  await ImportLog.findByIdAndUpdate(importId, {
    status: 'cancelled',
    cancelledAt: new Date(),
    cancelledBy: userId,
  });

  return true;
}

/**
 * Undo an import
 */
export async function undoImport(importId: string, userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const importRecord = await ImportLog.findById(importId);
    
    if (!importRecord) {
      return { success: false, message: 'Import not found' };
    }

    if (importRecord.status === 'cancelled') {
      return { success: false, message: 'Import already cancelled' };
    }

    // Delete created blogs
    if (importRecord.createdBlogs.length > 0) {
      await Blog.deleteMany({
        _id: { $in: importRecord.createdBlogs },
      });
    }

    // Delete created categories (only if they were created during this import)
    if (importRecord.createdCategories.length > 0) {
      await Category.deleteMany({
        _id: { $in: importRecord.createdCategories },
      });
    }

    // Delete downloaded images
    if (importRecord.downloadedImages.length > 0) {
      await deleteDownloadedImages(importRecord.downloadedImages);
    }

    // Mark as cancelled
    await ImportLog.findByIdAndUpdate(importId, {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelledBy: userId,
    });

    return {
      success: true,
      message: `Import undone successfully. Deleted ${importRecord.createdBlogs.length} posts, ${importRecord.createdCategories.length} categories, and ${importRecord.downloadedImages.length} images.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to undo import',
    };
  }
}

/**
 * Get all imports
 */
export async function getAllImports(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const [imports, total] = await Promise.all([
    ImportLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ImportLog.countDocuments(),
  ]);

  return {
    imports,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get import details
 */
export async function getImportDetails(importId: string) {
  const importLog = await ImportLog.findById(importId)
    .populate('createdBlogs', 'title slug status')
    .populate('createdCategories', 'name slug')
    .populate('cancelledBy', 'name email');
  
  return importLog;
}

/**
 * Preview WordPress export (first 5 posts)
 */
export async function previewWordPressImport(xmlContent: string): Promise<{
  success: boolean;
  posts?: Array<{
    title: string;
    date: string;
    author: string;
    categories: string[];
    status: string;
  }>;
  totalPosts?: number;
  error?: string;
}> {
  try {
    const exportData = parseWordPressXML(xmlContent);
    const validation = validateWordPressExport(exportData);
    
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }

    const preview = exportData.posts.slice(0, 5).map((post) => ({
      title: post.postTitle,
      date: post.postDate.toISOString(),
      author: exportData.authors.find((a) => a.authorId === post.postAuthor)?.authorDisplayName || 'Unknown',
      categories: post.categories,
      status: post.postStatus,
    }));

    return {
      success: true,
      posts: preview,
      totalPosts: exportData.posts.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to preview import',
    };
  }
}
