import mongoose, { Schema, Document } from 'mongoose';

export interface IKeywordCache {
  contentHash: string;
  title: string;
  keywords: Array<{
    keyword: string;
    volume: number;
    difficulty: number;
    cpc: number;
    trafficPotential: number;
    relevance: number;
  }>;
  expiresAt: Date;
}

export interface IKeywordCacheDocument extends IKeywordCache, Document {}

const keywordCacheSchema = new Schema<IKeywordCacheDocument>(
  {
    contentHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    keywords: [
      {
        keyword: { type: String, required: true },
        volume: { type: Number, default: 0 },
        difficulty: { type: Number, default: 0 },
        cpc: { type: Number, default: 0 },
        trafficPotential: { type: Number, default: 0 },
        relevance: { type: Number, default: 0 },
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically delete expired cache entries
keywordCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const KeywordCache = mongoose.model<IKeywordCacheDocument>(
  'KeywordCache',
  keywordCacheSchema
);

export default KeywordCache;
