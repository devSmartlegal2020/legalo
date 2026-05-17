import mongoose, { Schema } from 'mongoose';

export interface ISpeaker {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface IAgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface IEvent {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  whatYoullLearn: string[];
  targetAudience: string[];
  startDateTime: Date;
  endDateTime: Date;
  date: string; // Legacy field for backward compatibility
  time: string; // Legacy field for backward compatibility
  duration: string; // Auto-calculated
  location: string;
  isOnline: boolean;
  platform?: string;
  venue?: string;
  venueAddress?: string;
  type: 'Webinar' | 'Workshop' | 'Networking' | 'Clinic';
  category: string;
  price: number;
  currency: string;
  originalPrice?: number;
  attendees: number;
  seatsAvailable: number;
  speakers: ISpeaker[];
  agenda: IAgendaItem[];
  image: string;
  registrationLink?: string;
  prerequisites?: string[];
  materials?: string[];
  featured: boolean;
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventDocument extends IEvent, Document {}

const speakerSchema = new Schema<ISpeaker>({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  bio: { type: String, default: '' },
  image: { type: String, default: '' },
}, { _id: false });

const agendaItemSchema = new Schema<IAgendaItem>({
  time: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: false });

const eventSchema = new Schema<IEventDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    fullDescription: {
      type: String,
      default: '',
    },
    whatYoullLearn: [{
      type: String,
      trim: true,
    }],
    targetAudience: [{
      type: String,
      trim: true,
    }],
    startDateTime: {
      type: Date,
      default: null,
    },
    endDateTime: {
      type: Date,
      default: null,
    },
    date: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    platform: {
      type: String,
      default: '',
    },
    venue: {
      type: String,
      default: '',
    },
    venueAddress: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['Webinar', 'Workshop', 'Networking', 'Clinic'],
      default: 'Webinar',
    },
    category: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'IDR',
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    attendees: {
      type: Number,
      default: 0,
    },
    seatsAvailable: {
      type: Number,
      default: 0,
    },
    speakers: [speakerSchema],
    agenda: [agendaItemSchema],
    image: {
      type: String,
      default: '',
    },
    registrationLink: {
      type: String,
      default: '',
    },
    prerequisites: [{
      type: String,
      trim: true,
    }],
    materials: [{
      type: String,
      trim: true,
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ slug: 1 });
eventSchema.index({ status: 1, publishedAt: -1 });
eventSchema.index({ type: 1 });
eventSchema.index({ featured: 1 });
eventSchema.index({ category: 1 });

export default mongoose.model<IEventDocument>('Event', eventSchema);
