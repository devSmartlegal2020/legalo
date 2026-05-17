import { Request, Response } from 'express';
import { CTA } from '../models';
import { AuthRequest } from '../types';
import { sanitizeHtml } from '../utils/sanitize';

export const getAllCTAs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 50, isActive } = req.query;
    const query: any = {};

    if (isActive !== undefined) query.isActive = isActive === 'true';

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [ctas, total] = await Promise.all([
      CTA.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      CTA.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        ctas,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get all CTAs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getActiveCTAs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const ctas = await CTA.find({ isActive: true })
      .sort({ title: 1 });

    res.json({
      success: true,
      data: { ctas },
    });
  } catch (error) {
    console.error('Get active CTAs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getCTAById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const cta = await CTA.findById(id);

    if (!cta) {
      res.status(404).json({
        success: false,
        message: 'CTA not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { cta },
    });
  } catch (error) {
    console.error('Get CTA by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const createCTA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      buttonText,
      buttonUrl,
      backgroundColor,
      textColor,
      buttonBackgroundColor,
      buttonTextColor,
      isActive,
    } = req.body;

    const cta = await CTA.create({
      title,
      description: sanitizeHtml(description),
      buttonText: buttonText || 'Learn More',
      buttonUrl: buttonUrl || '#',
      backgroundColor: backgroundColor || '#1a1a2e',
      textColor: textColor || '#ffffff',
      buttonBackgroundColor: buttonBackgroundColor || '#D93A3A',
      buttonTextColor: buttonTextColor || '#ffffff',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'CTA created successfully',
      data: { cta },
    });
  } catch (error) {
    console.error('Create CTA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateCTA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      buttonText,
      buttonUrl,
      backgroundColor,
      textColor,
      buttonBackgroundColor,
      buttonTextColor,
      isActive,
    } = req.body;

    const cta = await CTA.findById(id);
    if (!cta) {
      res.status(404).json({
        success: false,
        message: 'CTA not found',
      });
      return;
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = sanitizeHtml(description);
    if (buttonText !== undefined) updateData.buttonText = buttonText;
    if (buttonUrl !== undefined) updateData.buttonUrl = buttonUrl;
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor;
    if (textColor !== undefined) updateData.textColor = textColor;
    if (buttonBackgroundColor !== undefined) updateData.buttonBackgroundColor = buttonBackgroundColor;
    if (buttonTextColor !== undefined) updateData.buttonTextColor = buttonTextColor;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedCTA = await CTA.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'CTA updated successfully',
      data: { cta: updatedCTA },
    });
  } catch (error) {
    console.error('Update CTA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const deleteCTA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const cta = await CTA.findById(id);
    if (!cta) {
      res.status(404).json({
        success: false,
        message: 'CTA not found',
      });
      return;
    }

    await CTA.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'CTA deleted successfully',
    });
  } catch (error) {
    console.error('Delete CTA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const toggleCTAStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const cta = await CTA.findById(id);
    if (!cta) {
      res.status(404).json({
        success: false,
        message: 'CTA not found',
      });
      return;
    }

    cta.isActive = !cta.isActive;
    await cta.save();

    res.json({
      success: true,
      message: `CTA ${cta.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { cta },
    });
  } catch (error) {
    console.error('Toggle CTA status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
