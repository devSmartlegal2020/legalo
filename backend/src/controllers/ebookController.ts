import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Ebook, EbookDownload } from '../models';
import { AuthRequest } from '../types';
import slugify from 'slugify';
import crypto from 'crypto';
import { buildSearchQuery } from '../utils/regex';

// Generate unique slug
const generateUniqueSlug = async (title: string): Promise<string> => {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await Ebook.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// Get all ebooks (admin)
export const getAllEbooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['title', 'summary', 'category']);
      if (searchQuery) {
        Object.assign(query, searchQuery);
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [ebooks, total] = await Promise.all([
      Ebook.find(query)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Ebook.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        ebooks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get all ebooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get published ebooks (public)
export const getPublishedEbooks = async (req: Request, res: Response): Promise<void> => {
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
      const searchQuery = buildSearchQuery(search as string, ['title', 'summary']);
      if (searchQuery) {
        Object.assign(query, searchQuery);
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [ebooks, total] = await Promise.all([
      Ebook.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Ebook.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        ebooks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get published ebooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get single ebook by ID (admin)
export const getEbookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ebook = await Ebook.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!ebook) {
      res.status(404).json({
        success: false,
        message: 'E-book not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { ebook },
    });
  } catch (error) {
    console.error('Get ebook by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get single ebook by slug (public)
export const getEbookBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const ebook = await Ebook.findOne({ slug, status: 'published' });

    if (!ebook) {
      res.status(404).json({
        success: false,
        message: 'E-book not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { ebook },
    });
  } catch (error) {
    console.error('Get ebook by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create new ebook
export const createEbook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      summary,
      category,
      pages,
      coverColor,
      iconName,
      downloadType,
      externalUrl,
      metaTitle,
      metaDescription,
      status,
    } = req.body;

    // Generate unique slug
    const slug = await generateUniqueSlug(title);

    // Handle file upload
    let fileUrl = '';
    let fileName = '';
    let fileSize = 0;
    let mimeType = '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;
      mimeType = req.file.mimetype;
    }

    const ebook = new Ebook({
      title,
      slug,
      summary,
      category,
      pages: parseInt(pages),
      coverColor,
      iconName,
      downloadType,
      fileUrl,
      externalUrl: externalUrl || '',
      fileName,
      fileSize,
      mimeType,
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
      status: status || 'draft',
      createdBy: req.user!._id,
      updatedBy: req.user!._id,
    });

    await ebook.save();

    res.status(201).json({
      success: true,
      data: { ebook },
    });
  } catch (error) {
    console.error('Create ebook error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update ebook
export const updateEbook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      category,
      pages,
      coverColor,
      iconName,
      downloadType,
      externalUrl,
      metaTitle,
      metaDescription,
      status,
    } = req.body;

    const ebook = await Ebook.findById(id);

    if (!ebook) {
      res.status(404).json({
        success: false,
        message: 'E-book not found',
      });
      return;
    }

    // Update fields
    if (title) ebook.title = title;
    if (summary) ebook.summary = summary;
    if (category) ebook.category = category;
    if (pages) ebook.pages = parseInt(pages);
    if (coverColor) ebook.coverColor = coverColor;
    if (iconName) ebook.iconName = iconName;
    if (downloadType) ebook.downloadType = downloadType;
    if (externalUrl !== undefined) ebook.externalUrl = externalUrl;
    if (metaTitle !== undefined) ebook.metaTitle = metaTitle;
    if (metaDescription !== undefined) ebook.metaDescription = metaDescription;
    if (status) ebook.status = status;

    // Handle file upload
    if (req.file) {
      ebook.fileUrl = `/uploads/${req.file.filename}`;
      ebook.fileName = req.file.originalname;
      ebook.fileSize = req.file.size;
      ebook.mimeType = req.file.mimetype;
    }

    ebook.updatedBy = req.user!._id;

    await ebook.save();

    res.json({
      success: true,
      data: { ebook },
    });
  } catch (error) {
    console.error('Update ebook error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete ebook
export const deleteEbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ebook = await Ebook.findById(id);

    if (!ebook) {
      res.status(404).json({
        success: false,
        message: 'E-book not found',
      });
      return;
    }

    await Ebook.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'E-book deleted successfully',
    });
  } catch (error) {
    console.error('Delete ebook error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Bulk delete ebooks
export const bulkDeleteEbooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide an array of IDs',
      });
      return;
    }

    await Ebook.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${ids.length} e-books deleted successfully`,
    });
  } catch (error) {
    console.error('Bulk delete ebooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get ebook statistics
export const getEbookStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ebook = await Ebook.findById(id);

    if (!ebook) {
      res.status(404).json({
        success: false,
        message: 'E-book not found',
      });
      return;
    }

    // Get download history
    const downloads = await EbookDownload.find({ ebookId: id })
      .sort({ downloadedAt: -1 })
      .limit(100);

    // Get total downloads count
    const totalDownloads = await EbookDownload.countDocuments({ ebookId: id });

    // Get unique downloaders count
    const uniqueDownloaders = await EbookDownload.distinct('email', { ebookId: id });

    res.json({
      success: true,
      data: {
        ebook: {
          id: ebook._id,
          title: ebook.title,
          downloadCount: ebook.downloadCount,
        },
        stats: {
          totalDownloads,
          uniqueDownloaders: uniqueDownloaders.length,
        },
        recentDownloads: downloads,
      },
    });
  } catch (error) {
    console.error('Get ebook stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Record ebook download (public)
export const recordDownload = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, name, company, consent } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    if (!consent) {
      res.status(400).json({
        success: false,
        message: 'Consent is required',
      });
      return;
    }

    const ebook = await Ebook.findById(id);

    if (!ebook) {
      res.status(404).json({
        success: false,
        message: 'E-book not found',
      });
      return;
    }

    if (ebook.status !== 'published') {
      res.status(404).json({
        success: false,
        message: 'E-book not found',
      });
      return;
    }

    // Record download
    const download = new EbookDownload({
      ebookId: id,
      email: email.toLowerCase().trim(),
      name: name || '',
      company: company || '',
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    });

    await download.save();

    // Update download count
    ebook.downloadCount += 1;
    await ebook.save();

    // Determine download URL
    let downloadUrl = '';
    if (ebook.downloadType === 'upload' && ebook.fileUrl) {
      downloadUrl = ebook.fileUrl;
    } else if (ebook.downloadType === 'external' && ebook.externalUrl) {
      downloadUrl = ebook.externalUrl;
    }

    res.json({
      success: true,
      data: {
        message: 'Download recorded successfully',
        downloadUrl,
      },
    });
  } catch (error) {
    console.error('Record download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get all downloads (admin)
export const getAllDownloads = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      ebookId,
      email,
    } = req.query;

    const query: any = {};

    if (ebookId) query.ebookId = ebookId;
    if (email) query.email = { $regex: email, $options: 'i' };

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [downloads, total] = await Promise.all([
      EbookDownload.find(query)
        .populate('ebookId', 'title slug')
        .sort({ downloadedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      EbookDownload.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        downloads,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get all downloads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
