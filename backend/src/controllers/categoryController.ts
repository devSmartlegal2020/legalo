import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Category, Blog } from '../models';
import { generateUniqueSlug } from '../utils';
import { AuthRequest } from '../types';
import { escapeRegex } from '../utils/regex';
import { sanitizeHtml } from '../utils/sanitize';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('defaultCta')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getAllCategoriesAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find()
      .populate('defaultCta')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error('Get all categories admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true })
      .populate('defaultCta');

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { name, description, defaultCta } = req.body;

    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') } });
    if (existingCategory) {
      res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
      return;
    }

    const slug = await generateUniqueSlug(name, async (s) => {
      const exists = await Category.findOne({ slug: s });
      return !!exists;
    });

    const categoryData: any = {
      name,
      slug,
      description: sanitizeHtml(description || ''),
    };

    if (defaultCta !== undefined && defaultCta !== '' && defaultCta !== null) {
      categoryData.defaultCta = defaultCta;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
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
    const { name, description, isActive, defaultCta } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    // Check if name is already taken by another category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') },
        _id: { $ne: id }
      });
      if (existingCategory) {
        res.status(400).json({
          success: false,
          message: 'Category with this name already exists',
        });
        return;
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = sanitizeHtml(description);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (defaultCta !== undefined) {
      if (defaultCta === '' || defaultCta === null) {
        updateData.defaultCta = null;
      } else {
        updateData.defaultCta = defaultCta;
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('defaultCta');

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category: updatedCategory },
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    // Check if category has blogs
    const blogCount = await Blog.countDocuments({ category: id });
    if (blogCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${blogCount} blog(s) associated with it.`,
      });
      return;
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getCategoryStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    
    const stats = await Promise.all(
      categories.map(async (category) => {
        const blogCount = await Blog.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          blogCount,
        };
      })
    );

    res.json({
      success: true,
      data: { categories: stats },
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
