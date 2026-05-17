import { Request, Response } from 'express';
import { Event } from '../models';
import { AuthRequest } from '../types';
import slugify from 'slugify';
import { buildSearchQuery } from '../utils/regex';
import { sanitizeHtml } from '../utils/sanitize';

// Generate unique slug
const generateUniqueSlug = async (title: string): Promise<string> => {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await Event.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// Get all events (admin)
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      category,
      search,
      featured,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      const searchQuery = buildSearchQuery(search as string, ['title', 'description', 'fullDescription']);
      if (searchQuery) {
        Object.assign(query, searchQuery);
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Event.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get published events (public)
export const getPublishedEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      featured,
    } = req.query;

    const query: any = { status: 'published' };

    if (type) query.type = type;
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Event.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get published events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get event by slug (public)
export const getEventBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const event = await Event.findOne({ slug, status: 'published' });

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { event },
    });
  } catch (error) {
    console.error('Get event by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get event by ID (admin)
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { event },
    });
  } catch (error) {
    console.error('Get event by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create event
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      fullDescription,
      whatYoullLearn,
      targetAudience,
      startDateTime,
      endDateTime,
      location,
      isOnline,
      platform,
      venue,
      venueAddress,
      type,
      category,
      price,
      currency,
      originalPrice,
      attendees,
      seatsAvailable,
      speakers,
      agenda,
      registrationLink,
      prerequisites,
      materials,
      featured,
      status,
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

    // Only title is required, all other fields are optional with defaults
    const slug = await generateUniqueSlug(title);
    
    // Set default status to 'draft' if not provided
    const eventStatus = status || 'draft';
    const publishedAt = eventStatus === 'published' ? new Date() : null;

    // Handle image: either from file upload or from body (URL)
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image;
    }

    // Parse JSON arrays from form data
    let parsedSpeakers = [];
    let parsedAgenda = [];
    let parsedWhatYoullLearn = [];
    let parsedTargetAudience = [];
    let parsedPrerequisites = [];
    let parsedMaterials = [];

    try {
      parsedSpeakers = speakers ? JSON.parse(speakers) : [];
      parsedAgenda = agenda ? JSON.parse(agenda) : [];
      parsedWhatYoullLearn = whatYoullLearn ? JSON.parse(whatYoullLearn) : [];
      parsedTargetAudience = targetAudience ? JSON.parse(targetAudience) : [];
      parsedPrerequisites = prerequisites ? JSON.parse(prerequisites) : [];
      parsedMaterials = materials ? JSON.parse(materials) : [];
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      res.status(400).json({
        success: false,
        message: 'Invalid JSON format in array fields (speakers, agenda, etc.)',
      });
      return;
    }

    // Parse datetime fields
    const parsedStartDateTime = startDateTime ? new Date(startDateTime) : null;
    const parsedEndDateTime = endDateTime ? new Date(endDateTime) : null;
    
    // Calculate duration from start and end datetimes
    let calculatedDuration = '';
    if (parsedStartDateTime && parsedEndDateTime) {
      const diffMs = parsedEndDateTime.getTime() - parsedStartDateTime.getTime();
      if (diffMs > 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours === 0) {
          calculatedDuration = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
        } else if (diffMinutes === 0) {
          calculatedDuration = `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
        } else {
          calculatedDuration = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
        }
      }
    }
    
    // Format legacy date and time fields for backward compatibility
    let legacyDate = '';
    let legacyTime = '';
    if (parsedStartDateTime) {
      legacyDate = parsedStartDateTime.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      if (parsedEndDateTime) {
        const startTime = parsedStartDateTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        const endTime = parsedEndDateTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        legacyTime = `${startTime} - ${endTime} WIB`;
      } else {
        legacyTime = parsedStartDateTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
    }

    const event = await Event.create({
      slug,
      title,
      description: sanitizeHtml(description || ''),
      fullDescription: sanitizeHtml(fullDescription || ''),
      whatYoullLearn: parsedWhatYoullLearn,
      targetAudience: parsedTargetAudience,
      startDateTime: parsedStartDateTime,
      endDateTime: parsedEndDateTime,
      date: legacyDate,
      time: legacyTime,
      duration: calculatedDuration,
      location: location || '',
      isOnline: isOnline === 'true' || isOnline === true,
      platform: platform || '',
      venue: venue || '',
      venueAddress: venueAddress || '',
      type: type || 'Webinar',
      category: category || '',
      price: parseInt(price) || 0,
      currency: currency || 'IDR',
      originalPrice: originalPrice ? parseInt(originalPrice) : null,
      attendees: parseInt(attendees) || 0,
      seatsAvailable: parseInt(seatsAvailable) || 0,
      speakers: parsedSpeakers,
      agenda: parsedAgenda,
      image: imagePath,
      registrationLink: registrationLink || '',
      prerequisites: parsedPrerequisites,
      materials: parsedMaterials,
      featured: featured === 'true' || featured === true,
      status: eventStatus,
      publishedAt,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event },
    });
  } catch (error) {
    console.error('❌ Create event error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};

// Update event
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      fullDescription,
      whatYoullLearn,
      targetAudience,
      startDateTime,
      endDateTime,
      location,
      isOnline,
      platform,
      venue,
      venueAddress,
      type,
      category,
      price,
      currency,
      originalPrice,
      attendees,
      seatsAvailable,
      speakers,
      agenda,
      registrationLink,
      prerequisites,
      materials,
      featured,
      status,
    } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }

    // If status changes from draft to published, set publishedAt
    let publishedAt = event.publishedAt;
    if (event.status === 'draft' && status === 'published') {
      publishedAt = new Date();
    }

    // Parse datetime fields
    let parsedStartDateTime: Date | null = event.startDateTime;
    let parsedEndDateTime: Date | null = event.endDateTime;
    
    if (startDateTime !== undefined) {
      parsedStartDateTime = startDateTime ? new Date(startDateTime) : null;
    }
    if (endDateTime !== undefined) {
      parsedEndDateTime = endDateTime ? new Date(endDateTime) : null;
    }
    
    // Calculate duration from start and end datetimes
    let calculatedDuration = event.duration;
    if (parsedStartDateTime && parsedEndDateTime) {
      const diffMs = parsedEndDateTime.getTime() - parsedStartDateTime.getTime();
      if (diffMs > 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours === 0) {
          calculatedDuration = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
        } else if (diffMinutes === 0) {
          calculatedDuration = `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
        } else {
          calculatedDuration = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
        }
      }
    }
    
    // Format legacy date and time fields for backward compatibility
    let legacyDate = event.date;
    let legacyTime = event.time;
    if (parsedStartDateTime) {
      legacyDate = parsedStartDateTime.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      if (parsedEndDateTime) {
        const startTime = parsedStartDateTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        const endTime = parsedEndDateTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        legacyTime = `${startTime} - ${endTime} WIB`;
      } else {
        legacyTime = parsedStartDateTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
    }

    const updateData: any = {
      title: title !== undefined ? title : event.title,
      description: description !== undefined ? sanitizeHtml(description) : event.description,
      fullDescription: fullDescription !== undefined ? sanitizeHtml(fullDescription) : event.fullDescription,
      startDateTime: parsedStartDateTime,
      endDateTime: parsedEndDateTime,
      date: legacyDate,
      time: legacyTime,
      duration: calculatedDuration,
      location: location !== undefined ? location : event.location,
      isOnline: isOnline !== undefined ? (isOnline === 'true' || isOnline === true) : event.isOnline,
      platform: platform !== undefined ? platform : event.platform,
      venue: venue !== undefined ? venue : event.venue,
      venueAddress: venueAddress !== undefined ? venueAddress : event.venueAddress,
      type: type !== undefined ? type : event.type,
      category: category !== undefined ? category : event.category,
      price: price !== undefined ? parseInt(price) : event.price,
      currency: currency !== undefined ? currency : event.currency,
      originalPrice: originalPrice !== undefined ? (originalPrice ? parseInt(originalPrice) : null) : event.originalPrice,
      attendees: attendees !== undefined ? parseInt(attendees) : event.attendees,
      seatsAvailable: seatsAvailable !== undefined ? parseInt(seatsAvailable) : event.seatsAvailable,
      registrationLink: registrationLink !== undefined ? registrationLink : event.registrationLink,
      featured: featured !== undefined ? (featured === 'true' || featured === true) : event.featured,
      status: status !== undefined ? status : event.status,
      publishedAt,
    };

    // Handle image update
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    // Parse JSON arrays from form data
    try {
      if (speakers) updateData.speakers = JSON.parse(speakers);
      if (agenda) updateData.agenda = JSON.parse(agenda);
      if (whatYoullLearn) updateData.whatYoullLearn = JSON.parse(whatYoullLearn);
      if (targetAudience) updateData.targetAudience = JSON.parse(targetAudience);
      if (prerequisites) updateData.prerequisites = JSON.parse(prerequisites);
      if (materials) updateData.materials = JSON.parse(materials);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      res.status(400).json({
        success: false,
        message: 'Invalid JSON format in array fields (speakers, agenda, etc.)',
      });
      return;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log('✅ Event updated successfully:', updatedEvent?.title);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent },
    });
  } catch (error) {
    console.error('❌ Update event error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};

// Delete event
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }

    await Event.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get featured events (public)
export const getFeaturedEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 3;

    const events = await Event.find({
      status: 'published',
      featured: true,
    })
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { events },
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get upcoming events (public - non-featured)
export const getUpcomingEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const events = await Event.find({
      status: 'published',
      featured: false,
    })
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { events },
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get related events (public)
export const getRelatedEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit as string) || 3;

    const currentEvent = await Event.findOne({ slug, status: 'published' });
    if (!currentEvent) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }

    const events = await Event.find({
      slug: { $ne: slug },
      status: 'published',
      type: currentEvent.type,
    })
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { events },
    });
  } catch (error) {
    console.error('Get related events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get schedule events (public - ALL published events for next 3 months)
export const getScheduleEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    const events = await Event.find({
      status: 'published',
      startDateTime: { 
        $exists: true,
        $ne: null,
        $gte: today,
        $lte: threeMonthsFromNow,
      },
    })
      .sort({ startDateTime: 1 })
      .limit(50);

    res.json({
      success: true,
      data: { events },
    });
  } catch (error) {
    console.error('Get schedule events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
