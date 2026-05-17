import { Request, Response } from 'express';
import { Promotion } from '../models';
import { AuthRequest } from '../types';
import slugify from 'slugify';
import { buildSearchQuery } from '../utils/regex';
import { sanitizeHtml } from '../utils/sanitize';

// Generate unique slug
const generateUniqueSlug = async (title: string): Promise<string> => {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await Promotion.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// Get all promotions (admin)
export const getAllPromotions = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      showInPopup,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (showInPopup === 'true') query.showInPopup = true;
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['title', 'description', 'subtitle']);
      if (searchQuery) {
        Object.assign(query, searchQuery);
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [promotions, total] = await Promise.all([
      Promotion.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Promotion.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        promotions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get all promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get active promotions (public)
export const getActivePromotions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const now = new Date();
    const query: any = {
      status: 'published',
      startDate: { $lte: now },
      endDate: { $gte: now },
    };

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [promotions, total] = await Promise.all([
      Promotion.find(query)
        .sort({ priority: -1, startDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Promotion.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        promotions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get active promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get promotion for popup (public)
export const getPopupPromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const { path, categoryId } = req.query;

    const promotions = await Promotion.find({
      status: 'published',
      showInPopup: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ priority: -1, createdAt: -1 });

    let promotion = null;

    if (path && typeof path === 'string') {
      for (const promo of promotions) {
        const hasPageTargeting = promo.targetPages && promo.targetPages.length > 0;
        const hasCategoryTargeting = promo.targetCategories && promo.targetCategories.length > 0;

        // If no targeting is set, show everywhere
        if (!hasPageTargeting && !hasCategoryTargeting) {
          promotion = promo;
          break;
        }

        // Check page targeting
        const pageMatches = hasPageTargeting && promo.targetPages!.includes(path);

        // Check category targeting (only on blog pages)
        let categoryMatches = false;
        if (hasCategoryTargeting && path.startsWith('/artikel')) {
          if (!categoryId) {
            // On blog list or blog detail without category check, match all category-targeted promotions
            categoryMatches = true;
          } else {
            categoryMatches = promo.targetCategories!.some(
              (cat: any) => cat.toString() === categoryId
            );
          }
        }

        if (pageMatches || categoryMatches) {
          promotion = promo;
          break;
        }
      }
    } else {
      // No path provided, return highest priority with no targeting or fallback to first
      promotion = promotions.find((promo) => {
        const hasPageTargeting = promo.targetPages && promo.targetPages.length > 0;
        const hasCategoryTargeting = promo.targetCategories && promo.targetCategories.length > 0;
        return !hasPageTargeting && !hasCategoryTargeting;
      }) || promotions[0] || null;
    }

    if (!promotion) {
      res.json({
        success: true,
        data: { promotion: null },
      });
      return;
    }

    res.json({
      success: true,
      data: { promotion },
    });
  } catch (error) {
    console.error('Get popup promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get promotion by slug (public)
export const getPromotionBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const now = new Date();

    const promotion = await Promotion.findOne({
      slug,
      status: 'published',
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!promotion) {
      res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { promotion },
    });
  } catch (error) {
    console.error('Get promotion by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get promotion by ID (admin)
export const getPromotionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);

    if (!promotion) {
      res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { promotion },
    });
  } catch (error) {
    console.error('Get promotion by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create promotion
export const createPromotion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      subtitle,
      description,
      fullDescription,
      startDate,
      endDate,
      terms,
      benefits,
      ctaText,
      ctaLink,
      priority,
      showInPopup,
      popupDelay,
      popupDuration,
      status,
      discountType,
      discountValue,
      discountCode,
      targetPages,
      targetCategories,
    } = req.body;

    // Manual validation - only title is required
    if (!title || title.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Validation failed: Title is required',
        errors: [{ field: 'title', message: 'Title is required' }],
      });
      return;
    }

    const slug = await generateUniqueSlug(title);
    const promotionStatus = status || 'draft';
    const publishedAt = promotionStatus === 'published' ? new Date() : null;

    // Handle images
    let imagePath = '';
    let bannerImagePath = '';

    if (req.files && Array.isArray(req.files)) {
      const files = req.files as Express.Multer.File[];
      const imageFile = files.find(f => f.fieldname === 'image');
      const bannerFile = files.find(f => f.fieldname === 'bannerImage');

      if (imageFile) {
        imagePath = `/uploads/${imageFile.filename}`;
      }
      if (bannerFile) {
        bannerImagePath = `/uploads/${bannerFile.filename}`;
      }
    } else if (req.body.image) {
      imagePath = req.body.image;
    }

    // Parse JSON arrays
    let parsedTerms: string[] = [];
    let parsedBenefits: string[] = [];
    let parsedTargetPages: string[] = [];
    let parsedTargetCategories: string[] = [];

    try {
      parsedTerms = terms ? JSON.parse(terms) : [];
      parsedBenefits = benefits ? JSON.parse(benefits) : [];
      parsedTargetPages = targetPages ? JSON.parse(targetPages) : [];
      parsedTargetCategories = targetCategories ? JSON.parse(targetCategories) : [];
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      res.status(400).json({
        success: false,
        message: 'Invalid JSON format in array fields',
      });
      return;
    }

    // Build discount object
    let discount = undefined;
    if (discountType && discountValue) {
      discount = {
        type: discountType,
        value: parseFloat(discountValue),
        code: discountCode || undefined,
      };
    }

    const promotion = await Promotion.create({
      slug,
      title,
      subtitle: sanitizeHtml(subtitle || ''),
      description: sanitizeHtml(description),
      fullDescription: sanitizeHtml(fullDescription || ''),
      image: imagePath,
      bannerImage: bannerImagePath,
      discount,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      terms: parsedTerms,
      benefits: parsedBenefits,
      ctaText: sanitizeHtml(ctaText || 'Claim Offer'),
      ctaLink: ctaLink || '/promo',
      priority: parseInt(priority) || 0,
      showInPopup: showInPopup === 'true' || showInPopup === true,
      popupDelay: parseInt(popupDelay) || 2000,
      popupDuration: parseInt(popupDuration) || 7000,
      targetPages: parsedTargetPages,
      targetCategories: parsedTargetCategories,
      status: promotionStatus,
      publishedAt,
    });

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: { promotion },
    });
  } catch (error) {
    console.error('❌ Create promotion error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};

// Update promotion
export const updatePromotion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      fullDescription,
      startDate,
      endDate,
      terms,
      benefits,
      ctaText,
      ctaLink,
      priority,
      showInPopup,
      popupDelay,
      popupDuration,
      status,
      discountType,
      discountValue,
      discountCode,
      targetPages,
      targetCategories,
    } = req.body;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
      return;
    }

    // If status changes from draft to published, set publishedAt
    let publishedAt = promotion.publishedAt;
    if (promotion.status === 'draft' && status === 'published') {
      publishedAt = new Date();
    }

    const updateData: any = {
      title: title !== undefined ? title : promotion.title,
      subtitle: subtitle !== undefined ? sanitizeHtml(subtitle) : promotion.subtitle,
      description: description !== undefined ? sanitizeHtml(description) : promotion.description,
      fullDescription: fullDescription !== undefined ? sanitizeHtml(fullDescription) : promotion.fullDescription,
      startDate: startDate !== undefined ? new Date(startDate) : promotion.startDate,
      endDate: endDate !== undefined ? new Date(endDate) : promotion.endDate,
      ctaText: ctaText !== undefined ? sanitizeHtml(ctaText) : promotion.ctaText,
      ctaLink: ctaLink !== undefined ? ctaLink : promotion.ctaLink,
      priority: priority !== undefined ? parseInt(priority) : promotion.priority,
      showInPopup: showInPopup !== undefined ? (showInPopup === 'true' || showInPopup === true) : promotion.showInPopup,
      popupDelay: popupDelay !== undefined ? parseInt(popupDelay) : promotion.popupDelay,
      popupDuration: popupDuration !== undefined ? parseInt(popupDuration) : promotion.popupDuration,
      status: status !== undefined ? status : promotion.status,
      publishedAt,
    };

    // Handle image updates
    if (req.files && Array.isArray(req.files)) {
      const files = req.files as Express.Multer.File[];
      const imageFile = files.find(f => f.fieldname === 'image');
      const bannerFile = files.find(f => f.fieldname === 'bannerImage');

      if (imageFile) {
        updateData.image = `/uploads/${imageFile.filename}`;
      }
      if (bannerFile) {
        updateData.bannerImage = `/uploads/${bannerFile.filename}`;
      }
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }
    if (req.body.bannerImage) {
      updateData.bannerImage = req.body.bannerImage;
    }

    // Parse JSON arrays
    try {
      if (terms) updateData.terms = JSON.parse(terms);
      if (benefits) updateData.benefits = JSON.parse(benefits);
      if (targetPages !== undefined) updateData.targetPages = targetPages ? JSON.parse(targetPages) : [];
      if (targetCategories !== undefined) updateData.targetCategories = targetCategories ? JSON.parse(targetCategories) : [];
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      res.status(400).json({
        success: false,
        message: 'Invalid JSON format in array fields',
      });
      return;
    }

    // Build discount object
    if (discountType && discountValue) {
      updateData.discount = {
        type: discountType,
        value: parseFloat(discountValue),
        code: discountCode || undefined,
      };
    } else if (discountType === '') {
      updateData.discount = undefined;
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log('✅ Promotion updated successfully:', updatedPromotion?.title);

    res.json({
      success: true,
      message: 'Promotion updated successfully',
      data: { promotion: updatedPromotion },
    });
  } catch (error) {
    console.error('❌ Update promotion error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};

// Delete promotion
export const deletePromotion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
      return;
    }

    await Promotion.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Promotion deleted successfully',
    });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
