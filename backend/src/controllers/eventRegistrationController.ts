import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Event, EventRegistration } from '../models';
import { buildSearchQuery } from '../utils/regex';

// Register for an event (public)
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
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

    const { slug } = req.params;
    const { name, email, phone, company, message } = req.body;

    // Find the event
    const event = await Event.findOne({ slug, status: 'published' });
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found or is no longer active',
      });
      return;
    }

    // Check seat availability if applicable
    if (event.seatsAvailable !== undefined && event.seatsAvailable !== null) {
      if (event.seatsAvailable <= 0) {
        res.status(400).json({
          success: false,
          message: 'Maaf, kuota kursi untuk event ini sudah penuh',
        });
        return;
      }
      event.seatsAvailable -= 1;
    }
    
    event.attendees = (event.attendees || 0) + 1;
    await event.save();

    // Create the registration
    const registration = new EventRegistration({
      eventId: event._id,
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      company: company || '',
      message: message || '',
    });

    await registration.save();

    // Log the registration alert (email simulation)
    console.log(`[EMAIL SIMULATION] New Event Registration:
    - Event: ${event.title} (${event.type})
    - Attendee Name: ${name}
    - Email: ${email}
    - Phone: ${phone || '(none)'}
    - Company: ${company || '(none)'}
    - Message: ${message || '(none)'}`);

    res.status(201).json({
      success: true,
      message: 'Pendaftaran event berhasil dilakukan',
      data: {
        id: registration._id,
        eventName: event.title,
        name: registration.name,
        email: registration.email,
      },
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get all registrations (admin)
export const getAllRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      eventId,
      search,
    } = req.query;

    const query: any = {};

    if (eventId) query.eventId = eventId;
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['name', 'email', 'phone', 'company', 'message']);
      if (searchQuery) {
        Object.assign(query, searchQuery);
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [registrations, total] = await Promise.all([
      EventRegistration.find(query)
        .populate('eventId', 'title slug date time location venue isOnline')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      EventRegistration.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get all registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete registration (admin)
export const deleteRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const registration = await EventRegistration.findById(id);
    if (!registration) {
      res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
      return;
    }

    // Optionally restore seats if registration is deleted
    const event = await Event.findById(registration.eventId);
    if (event) {
      event.seatsAvailable = (event.seatsAvailable || 0) + 1;
      event.attendees = Math.max(0, (event.attendees || 1) - 1);
      await event.save();
    }

    await EventRegistration.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Registration deleted successfully',
    });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
