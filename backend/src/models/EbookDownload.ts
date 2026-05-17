import mongoose, { Schema } from 'mongoose';
import { IEbookDownload } from '../types';

export interface IEbookDownloadDocument extends IEbookDownload, Document {}

const ebookDownloadSchema = new Schema<IEbookDownloadDocument>(
  {
    ebookId: {
      type: Schema.Types.ObjectId,
      ref: 'Ebook',
      required: [true, 'E-book ID is required'],
    },
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
    company: {
      type: String,
      trim: true,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    downloadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ebookDownloadSchema.index({ ebookId: 1, downloadedAt: -1 });
ebookDownloadSchema.index({ email: 1 });
ebookDownloadSchema.index({ downloadedAt: -1 });

export default mongoose.model<IEbookDownloadDocument>('EbookDownload', ebookDownloadSchema);
