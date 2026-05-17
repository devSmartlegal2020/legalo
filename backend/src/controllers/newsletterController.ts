import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { NewsletterSubscriber } from '../models';
import crypto from 'crypto';
import { buildSearchQuery } from '../utils/regex';

// Generate confirmation token
const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Subscribe to newsletter (public)
export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, signupSource = 'general' } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed to this source
    const existingSubscriber = await NewsletterSubscriber.findOne({
      email: normalizedEmail,
      signupSource,
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'confirmed') {
        res.status(400).json({
          success: false,
          message: 'You are already subscribed to our newsletter',
        });
        return;
      } else if (existingSubscriber.status === 'pending') {
        res.status(400).json({
          success: false,
          message: 'Please check your email to confirm your subscription',
        });
        return;
      } else if (existingSubscriber.status === 'unsubscribed') {
        // Resubscribe
        existingSubscriber.status = 'pending';
        existingSubscriber.confirmationToken = generateToken();
        existingSubscriber.unsubscribedAt = undefined;
        await existingSubscriber.save();

        // TODO: Send confirmation email

        res.json({
          success: true,
          message: 'Please check your email to confirm your subscription',
          data: {
            email: normalizedEmail,
            status: 'pending',
          },
        });
        return;
      }
    }

    // Create new subscriber
    const subscriber = new NewsletterSubscriber({
      email: normalizedEmail,
      name: name || '',
      status: 'pending',
      confirmationToken: generateToken(),
      signupSource,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    });

    await subscriber.save();

    // TODO: Send confirmation email
    console.log(`Confirmation token for ${normalizedEmail}: ${subscriber.confirmationToken}`);

    res.json({
      success: true,
      message: 'Please check your email to confirm your subscription',
      data: {
        email: normalizedEmail,
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Confirm subscription (public)
export const confirmSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const subscriber = await NewsletterSubscriber.findOne({
      confirmationToken: token,
      status: 'pending',
    });

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Invalid or expired confirmation token',
      });
      return;
    }

    subscriber.status = 'confirmed';
    subscriber.confirmedAt = new Date();
    await subscriber.save();

    res.json({
      success: true,
      message: 'Your subscription has been confirmed!',
      data: {
        email: subscriber.email,
        status: 'confirmed',
      },
    });
  } catch (error) {
    console.error('Confirm subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Unsubscribe (public)
export const unsubscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const subscriber = await NewsletterSubscriber.findOne({
      email: normalizedEmail,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
      return;
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      success: true,
      message: 'You have been unsubscribed successfully',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get all subscribers (admin)
export const getAllSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      signupSource,
      search,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (signupSource) query.signupSource = signupSource;
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['email', 'name']);
      if (searchQuery) {
        Object.assign(query, searchQuery);
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [subscribers, total] = await Promise.all([
      NewsletterSubscriber.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      NewsletterSubscriber.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get all subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get subscriber statistics (admin)
export const getSubscriberStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalSubscribers = await NewsletterSubscriber.countDocuments();
    const confirmedSubscribers = await NewsletterSubscriber.countDocuments({ status: 'confirmed' });
    const pendingSubscribers = await NewsletterSubscriber.countDocuments({ status: 'pending' });
    const unsubscribed = await NewsletterSubscriber.countDocuments({ status: 'unsubscribed' });

    // Get stats by source
    const sourceStats = await NewsletterSubscriber.aggregate([
      {
        $group: {
          _id: '$signupSource',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get stats by status
    const statusStats = await NewsletterSubscriber.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          total: totalSubscribers,
          confirmed: confirmedSubscribers,
          pending: pendingSubscribers,
          unsubscribed: unsubscribed,
        },
        bySource: sourceStats,
        byStatus: statusStats,
      },
    });
  } catch (error) {
    console.error('Get subscriber stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update subscriber (admin)
export const updateSubscriber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const subscriber = await NewsletterSubscriber.findById(id);

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
      return;
    }

    if (name !== undefined) subscriber.name = name;
    if (status) {
      subscriber.status = status;
      if (status === 'confirmed' && !subscriber.confirmedAt) {
        subscriber.confirmedAt = new Date();
      }
      if (status === 'unsubscribed') {
        subscriber.unsubscribedAt = new Date();
      }
    }

    await subscriber.save();

    res.json({
      success: true,
      data: { subscriber },
    });
  } catch (error) {
    console.error('Update subscriber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete subscriber (admin)
export const deleteSubscriber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const subscriber = await NewsletterSubscriber.findById(id);

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
      return;
    }

    await NewsletterSubscriber.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Bulk delete subscribers (admin)
export const bulkDeleteSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide an array of IDs',
      });
      return;
    }

    await NewsletterSubscriber.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${ids.length} subscribers deleted successfully`,
    });
  } catch (error) {
    console.error('Bulk delete subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Export subscribers to CSV (admin)
export const exportSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status = 'confirmed' } = req.query;

    const query: any = {};
    if (status !== 'all') query.status = status;

    const subscribers = await NewsletterSubscriber.find(query)
      .select('email name status signupSource confirmedAt createdAt')
      .sort({ createdAt: -1 });

    // Create CSV content
    const headers = ['Email', 'Name', 'Status', 'Source', 'Confirmed At', 'Subscribed At'];
    const rows = subscribers.map((sub) => [
      sub.email,
      sub.name || '',
      sub.status,
      sub.signupSource,
      sub.confirmedAt ? sub.confirmedAt.toISOString() : '',
      sub.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Export subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
