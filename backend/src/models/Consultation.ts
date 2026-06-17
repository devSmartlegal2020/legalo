import mongoose, { Schema, Document } from 'mongoose';
import { IConsultation } from '../types';

export interface IConsultationDocument extends Omit<IConsultation, '_id'>, Document {}

const consultationSchema = new Schema<IConsultationDocument>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
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
      required: [true, 'Phone number is required'],
      trim: true,
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
consultationSchema.index({ email: 1 });
consultationSchema.index({ status: 1 });
consultationSchema.index({ createdAt: -1 });

export default mongoose.model<IConsultationDocument>('Consultation', consultationSchema);
