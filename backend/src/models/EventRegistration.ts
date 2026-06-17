import mongoose, { Schema, Document } from 'mongoose';
import { IEventRegistration } from '../types';

export interface IEventRegistrationDocument extends Omit<IEventRegistration, '_id'>, Document {}

const eventRegistrationSchema = new Schema<IEventRegistrationDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Attendee name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
eventRegistrationSchema.index({ eventId: 1 });
eventRegistrationSchema.index({ email: 1 });
eventRegistrationSchema.index({ createdAt: -1 });

export default mongoose.model<IEventRegistrationDocument>('EventRegistration', eventRegistrationSchema);
