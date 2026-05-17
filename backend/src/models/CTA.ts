import mongoose, { Schema, Document } from 'mongoose';
import { ICTA } from '../types';

export interface ICTADocument extends ICTA, Document {}

const ctaSchema = new Schema<ICTADocument>(
  {
    title: {
      type: String,
      required: [true, 'CTA title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'CTA description is required'],
      trim: true,
    },
    buttonText: {
      type: String,
      required: [true, 'Button text is required'],
      trim: true,
      default: 'Learn More',
    },
    buttonUrl: {
      type: String,
      required: [true, 'Button URL is required'],
      trim: true,
      default: '#',
    },
    backgroundColor: {
      type: String,
      default: '#1a1a2e',
      trim: true,
    },
    textColor: {
      type: String,
      default: '#ffffff',
      trim: true,
    },
    buttonBackgroundColor: {
      type: String,
      default: '#D93A3A',
      trim: true,
    },
    buttonTextColor: {
      type: String,
      default: '#ffffff',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICTADocument>('CTA', ctaSchema);
