import mongoose, { Schema } from 'mongoose';

export interface IPromotion {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  fullDescription?: string;
  image: string;
  bannerImage?: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    code?: string;
  };
  startDate: Date;
  endDate: Date;
  terms?: string[];
  benefits?: string[];
  ctaText?: string;
  ctaLink?: string;
  priority: number;
  showInPopup: boolean;
  popupDelay?: number;
  popupDuration?: number;
  targetPages?: string[];
  targetCategories?: mongoose.Types.ObjectId[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPromotionDocument extends IPromotion, Document {}

const promotionSchema = new Schema<IPromotionDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Promotion title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    fullDescription: {
      type: String,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    bannerImage: {
      type: String,
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
      value: Number,
      code: String,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    terms: [{
      type: String,
      trim: true,
    }],
    benefits: [{
      type: String,
      trim: true,
    }],
    ctaText: {
      type: String,
      default: 'Claim Offer',
    },
    ctaLink: {
      type: String,
      default: '/promo',
    },
    priority: {
      type: Number,
      default: 0,
    },
    showInPopup: {
      type: Boolean,
      default: false,
    },
    popupDelay: {
      type: Number,
      default: 2000,
    },
    popupDuration: {
      type: Number,
      default: 7000,
    },
    targetPages: [{
      type: String,
      trim: true,
    }],
    targetCategories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
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

promotionSchema.index({ slug: 1 });
promotionSchema.index({ status: 1, startDate: 1, endDate: 1 });
promotionSchema.index({ showInPopup: 1, status: 1 });
promotionSchema.index({ priority: -1 });
promotionSchema.index({ targetPages: 1 });
promotionSchema.index({ targetCategories: 1 });

export default mongoose.model<IPromotionDocument>('Promotion', promotionSchema);
