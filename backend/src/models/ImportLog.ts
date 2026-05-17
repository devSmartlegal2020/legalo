import mongoose, { Schema, Document } from 'mongoose';

export interface IImportError {
  postTitle: string;
  error: string;
  timestamp: Date;
}

export interface IImportLog {
  _id: string;
  filename: string;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  totalPosts: number;
  processedPosts: number;
  successCount: number;
  errorCount: number;
  createdBlogs: string[];
  createdCategories: string[];
  downloadedImages: string[];
  errors: IImportError[];
  startedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  metadata: {
    sourceWordPressUrl?: string;
    exportDate?: string;
    version?: string;
  };
  currentOperation?: string;
  currentPostTitle?: string;
}

export interface IImportLogDocument extends IImportLog, Document {}

const importErrorSchema = new Schema<IImportError>({
  postTitle: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const importLogSchema = new Schema<IImportLogDocument>(
  {
    filename: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed', 'cancelled'],
      default: 'processing',
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    processedPosts: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    errorCount: {
      type: Number,
      default: 0,
    },
    createdBlogs: [{
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    }],
    createdCategories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    downloadedImages: [{
      type: String,
    }],
    errors: [importErrorSchema],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    metadata: {
      sourceWordPressUrl: String,
      exportDate: String,
      version: String,
    },
    currentOperation: {
      type: String,
    },
    currentPostTitle: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

importLogSchema.index({ status: 1, startedAt: -1 });
importLogSchema.index({ createdAt: -1 });

export default mongoose.model<IImportLogDocument>('ImportLog', importLogSchema);
