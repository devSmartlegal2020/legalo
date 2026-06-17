import { Request } from 'express';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICTA {
  _id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  defaultCta?: ICTA | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPromotion {
  _id: string;
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
  targetCategories?: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: ICategory | string;
  author: IUser | string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;
  scheduledPublishAt?: Date;
  readTime: number;
  tags?: string[];
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  isFeatured: boolean;
  cta?: ICTA | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

// WordPress Import Types

export interface WordPressAuthor {
  authorId: string;
  authorLogin: string;
  authorEmail: string;
  authorDisplayName: string;
  authorFirstName: string;
  authorLastName: string;
}

export interface WordPressCategory {
  termId: string;
  categoryNiceName: string;
  categoryParent: string;
  catName: string;
}

export interface WordPressTag {
  termId: string;
  tagSlug: string;
  tagName: string;
}

export interface WordPressAttachment {
  attachmentId: string;
  attachmentUrl: string;
}

export interface WordPressPost {
  postId: string;
  postTitle: string;
  postName: string;
  postDate: Date;
  postDateGmt: Date;
  postContent: string;
  postExcerpt: string;
  postStatus: string;
  postType: string;
  postAuthor: string;
  postParent: string;
  postPassword: string;
  isSticky: boolean;
  attachmentUrl?: string;
  categories: string[];
  tags: string[];
  comments: WordPressComment[];
  meta: Record<string, string>;
}

export interface WordPressComment {
  commentId: string;
  commentAuthor: string;
  commentAuthorEmail: string;
  commentAuthorUrl: string;
  commentAuthorIp: string;
  commentDate: Date;
  commentDateGmt: Date;
  commentContent: string;
  commentApproved: string;
  commentType: string;
  commentParent: string;
  commentUserId: string;
}

export interface WordPressExport {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  language: string;
  wxrVersion: string;
  baseSiteUrl: string;
  baseBlogUrl: string;
  authors: WordPressAuthor[];
  categories: WordPressCategory[];
  tags: WordPressTag[];
  posts: WordPressPost[];
  attachments: WordPressAttachment[];
}

export interface ImportProgress {
  importId: string;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  totalPosts: number;
  processedPosts: number;
  successCount: number;
  errorCount: number;
  currentOperation: string;
  currentPostTitle?: string;
  percentComplete: number;
  errors: IImportError[];
}

export interface IImportError {
  postTitle: string;
  error: string;
  timestamp: Date;
}

// Ebook Types
export interface IEbook {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  pages: number;
  coverColor: string;
  iconName: string;
  fileUrl?: string;
  externalUrl?: string;
  downloadType: 'upload' | 'external';
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  downloadCount: number;
  emailCaptureRequired: boolean;
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published';
  createdBy: IUser | string;
  updatedBy: IUser | string;
  createdAt: Date;
  updatedAt: Date;
}

// Newsletter Types
export interface INewsletterSubscriber {
  _id: string;
  email: string;
  name?: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
  confirmationToken: string;
  confirmedAt?: Date;
  signupSource: string;
  ipAddress?: string;
  userAgent?: string;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEbookDownload {
  _id: string;
  ebookId: IEbook | string;
  email: string;
  name?: string;
  company?: string;
  ipAddress?: string;
  userAgent?: string;
  downloadedAt: Date;
}

export interface IConsultation {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  message?: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventRegistration {
  _id: string;
  eventId: any;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}


