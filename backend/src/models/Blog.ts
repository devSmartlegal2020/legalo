import mongoose, { Schema } from 'mongoose';
import { IBlog } from '../types';

export interface IBlogDocument extends IBlog, Document {}

const blogSchema = new Schema<IBlogDocument>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    scheduledPublishAt: {
      type: Date,
      default: null,
    },
    readTime: {
      type: Number,
      default: 5,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    views: {
      type: Number,
      default: 0,
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    metaKeywords: [{
      type: String,
      trim: true,
    }],
    canonicalUrl: {
      type: String,
      default: '',
    },
    ogImage: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    cta: {
      type: Schema.Types.ObjectId,
      ref: 'CTA',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ status: 1, scheduledPublishAt: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ isFeatured: 1 });

export default mongoose.model<IBlogDocument>('Blog', blogSchema);
