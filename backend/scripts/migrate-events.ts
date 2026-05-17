/**
 * Migration script to import static events from eventsData.ts into MongoDB
 * 
 * Usage:
 * 1. Make sure MongoDB is running
 * 2. Run: npx tsx scripts/migrate-events.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from '../src/models';
import slugify from 'slugify';

// Load environment variables
dotenv.config();

// Static events data (copied from app/src/data/eventsData.ts)
const eventsData = [
  {
    slug: 'startup-legal-bootcamp-2024',
    title: 'Startup Legal Bootcamp 2024',
    description: 'A comprehensive 2-day intensive workshop covering everything from company incorporation to investor agreements.',
    fullDescription: 'Join us for an intensive 2-day bootcamp designed specifically for startup founders and entrepreneurs. This hands-on workshop will guide you through the essential legal foundations every startup needs, from choosing the right business structure to preparing for investor meetings.',
    whatYoullLearn: [
      'How to choose between PT, CV, and Firma for your startup',
      'Essential legal documents every startup needs',
      'Founder agreements and equity distribution',
      'Investor agreement basics and term sheet fundamentals',
    ],
    targetAudience: [
      'Startup founders and co-founders',
      'Early-stage entrepreneurs',
      'Small business owners planning to scale',
    ],
    date: '15-16 Maret 2024',
    time: '09:00 - 17:00 WIB',
    duration: '2 Days',
    location: 'Jakarta Selatan',
    isOnline: false,
    venue: 'Legalo.id Office - Meeting Room A',
    venueAddress: 'Jl. Sudirman No. 123, Jakarta Selatan 12190',
    type: 'Workshop' as const,
    category: 'Startup Legal',
    price: 2500000,
    currency: 'IDR',
    originalPrice: 3500000,
    attendees: 50,
    seatsAvailable: 12,
    image: '/images/event_startup_legal.jpg',
    registrationLink: 'https://forms.legalo.id/startup-bootcamp',
    prerequisites: [
      'Basic understanding of business structures',
      'Laptop with Microsoft Office/Google Docs',
    ],
    materials: [
      'Comprehensive workshop handbook',
      'Legal document templates',
    ],
    featured: true,
    speakers: [
      {
        name: 'Budi Santoso',
        role: 'Managing Partner, Legalo.id',
        bio: '15+ years experience in corporate law and startup advisory.',
        image: '/images/speakers/budi-santoso.jpg'
      },
    ],
    agenda: [
      {
        time: '09:00 - 09:30',
        title: 'Registration & Coffee',
        description: 'Check-in, networking, and light refreshments'
      },
    ],
    status: 'published' as const,
  },
  // Add more events here as needed...
];

const migrateEvents = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/legalo-cms';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if events already exist
    const existingCount = await Event.countDocuments();
    console.log(`📊 Found ${existingCount} existing events in database`);

    if (existingCount > 0) {
      console.log('⚠️  Events already exist. Skipping migration.');
      console.log('   Use --force flag to overwrite existing events');
      process.exit(0);
    }

    // Insert events
    console.log(`🚀 Migrating ${eventsData.length} events...`);
    
    for (const eventData of eventsData) {
      // Generate slug if not exists
      if (!eventData.slug) {
        eventData.slug = slugify(eventData.title, { lower: true, strict: true });
      }

      // Set publishedAt if published
      const publishedAt = eventData.status === 'published' ? new Date() : null;

      await Event.create({
        ...eventData,
        publishedAt,
      });

      console.log(`  ✅ Created: ${eventData.title}`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log(`   Total events migrated: ${eventsData.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

// Run migration
migrateEvents();
