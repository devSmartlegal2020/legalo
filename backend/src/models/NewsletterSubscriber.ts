import mongoose, { Schema } from 'mongoose';
import { INewsletterSubscriber } from '../types';

export interface INewsletterSubscriberDocument extends INewsletterSubscriber, Document {}

const newsletterSubscriberSchema = new Schema<INewsletterSubscriberDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'unsubscribed'],
      default: 'pending',
    },
    confirmationToken: {
      type: String,
      required: [true, 'Confirmation token is required'],
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    signupSource: {
      type: String,
      required: [true, 'Signup source is required'],
      default: 'general',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate subscriptions from same source
newsletterSubscriberSchema.index({ email: 1, signupSource: 1 });
newsletterSubscriberSchema.index({ confirmationToken: 1 });
newsletterSubscriberSchema.index({ status: 1 });
newsletterSubscriberSchema.index({ signupSource: 1 });

export default mongoose.model<INewsletterSubscriberDocument>('NewsletterSubscriber', newsletterSubscriberSchema);
