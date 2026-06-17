import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Consultation } from '../models';
import { buildSearchQuery } from '../utils/regex';

// Create consultation (public)
export const createConsultation = async (req: Request, res: Response): Promise<void> => {
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

    const { fullName, email, phone, serviceType, message } = req.body;

    const consultation = new Consultation({
      fullName,
      email: email.toLowerCase().trim(),
      phone,
      serviceType,
      message: message || '',
      status: 'pending',
    });

    await consultation.save();

    // Log the consultation alert (email simulation)
    console.log(`[EMAIL SIMULATION] New Consultation Request received:
    - Name: ${fullName}
    - Email: ${email}
    - Phone: ${phone}
    - Service: ${serviceType}
    - Message: ${message || '(none)'}`);

    res.status(201).json({
      success: true,
      message: 'Permohonan konsultasi berhasil dikirim',
      data: {
        id: consultation._id,
        fullName: consultation.fullName,
        email: consultation.email,
        status: consultation.status,
      },
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get all consultations (admin)
export const getAllConsultations = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      serviceType,
      search,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['fullName', 'email', 'phone', 'message']);
      if (searchQuery) {
        Object.assign(query, searchQuery);
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [consultations, total] = await Promise.all([
      Consultation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Consultation.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        consultations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get all consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update consultation status (admin)
export const updateConsultationStatus = async (req: Request, res: Response): Promise<void> => {
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
    const { status } = req.body;

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation request not found',
      });
      return;
    }

    consultation.status = status;
    await consultation.save();

    res.json({
      success: true,
      message: 'Consultation status updated successfully',
      data: { consultation },
    });
  } catch (error) {
    console.error('Update consultation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete consultation (admin)
export const deleteConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation request not found',
      });
      return;
    }

    await Consultation.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Consultation request deleted successfully',
    });
  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
