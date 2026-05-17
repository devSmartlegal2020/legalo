import mongoose, { Schema } from 'mongoose';
import { IEbook } from '../types';

export interface IEbookDocument extends IEbook, Document {}

const ebookSchema = new Schema<IEbookDocument>(
  {
    title: {
      type: String,
      required: [true, 'E-book title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    pages: {
      type: Number,
      required: [true, 'Page count is required'],
      min: [1, 'Page count must be at least 1'],
    },
    coverColor: {
      type: String,
      required: [true, 'Cover color is required'],
      default: 'from-blue-600 to-blue-800',
    },
    iconName: {
      type: String,
      required: [true, 'Icon name is required'],
      default: 'FileText',
    },
    // Download options
    fileUrl: {
      type: String,
      default: '',
    },
    externalUrl: {
      type: String,
      default: '',
    },
    downloadType: {
      type: String,
      enum: ['upload', 'external'],
      required: [true, 'Download type is required'],
      default: 'external',
    },
    // File metadata (if upload)
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: '',
    },
    // Statistics
    downloadCount: {
      type: Number,
      default: 0,
    },
    emailCaptureRequired: {
      type: Boolean,
      default: true,
    },
    // SEO
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Updated by is required'],
    },
  },
  {
    timestamps: true,
  }
);

ebookSchema.index({ slug: 1 });
ebookSchema.index({ status: 1, createdAt: -1 });
ebookSchema.index({ category: 1 });

export default mongoose.model<IEbookDocument>('Ebook', ebookSchema);
