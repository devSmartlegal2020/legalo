import { XMLParser } from 'fast-xml-parser';
import {
  WordPressExport,
  WordPressPost,
  WordPressAttachment,
} from '../types';

interface XMLItem {
  title: string;
  'content:encoded'?: string;
  'excerpt:encoded'?: string;
  'wp:post_type': string;
  'wp:status': string;
  'wp:post_date'?: string;
  'wp:post_date_gmt'?: string;
  'wp:post_name'?: string;
  'wp:post_id': string;
  'wp:post_author'?: string;
  'wp:post_parent'?: string;
  'wp:post_password'?: string;
  'wp:is_sticky'?: string;
  'wp:attachment_url'?: string;
  category?: Array<{ '#text': string; '@_domain': string; '@_nicename'?: string }>;
  'wp:comment'?: Array<any>;
  'wp:postmeta'?: Array<{ 'wp:meta_key': string; 'wp:meta_value': string }>;
}

interface XMLAuthor {
  'wp:author_id': string;
  'wp:author_login': string;
  'wp:author_email': string;
  'wp:author_display_name': string;
  'wp:author_first_name': string;
  'wp:author_last_name': string;
}

interface XMLCategory {
  'wp:term_id': string;
  'wp:category_nicename': string;
  'wp:category_parent': string;
  'wp:cat_name': string;
}

interface XMLTag {
  'wp:term_id': string;
  'wp:tag_slug': string;
  'wp:tag_name': string;
}

interface ParsedXML {
  rss: {
    channel: {
      title: string;
      link: string;
      description: string;
      pubDate: string;
      language: string;
      'wp:wxr_version': string;
      'wp:base_site_url': string;
      'wp:base_blog_url': string;
      'wp:author'?: XMLAuthor | XMLAuthor[];
      'wp:category'?: XMLCategory | XMLCategory[];
      'wp:tag'?: XMLTag | XMLTag[];
      item?: XMLItem | XMLItem[];
    };
  };
}

export class XMLParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'XMLParserError';
  }
}

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch {
    return new Date();
  }
}

export function parseWordPressXML(xmlContent: string): WordPressExport {
  try {
    console.log('Starting XML parsing...');
    
    // Security: Strip DOCTYPE to prevent XXE attacks
    const sanitizedXml = xmlContent.replace(/<!DOCTYPE[^>[]*(\[[^\]]*\])?>/gi, '');

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: false,
      parseTagValue: false,
      trimValues: true,
      processEntities: false,
    });

    const parsed: ParsedXML = parser.parse(sanitizedXml);
    console.log('XML parsed successfully');

    if (!parsed.rss || !parsed.rss.channel) {
      console.error('Invalid XML structure: missing rss or channel');
      throw new XMLParserError('Invalid WordPress export format: missing rss/channel');
    }

    const channel = parsed.rss.channel;
    console.log('Channel found:', channel.title);

    // Parse items (posts, pages, attachments)
    const items = ensureArray(channel.item);
    console.log('Total items found:', items.length);
    
    const posts: WordPressPost[] = [];
    const attachments: WordPressAttachment[] = [];

    items.forEach((item, index) => {
      const postType = item['wp:post_type'];
      console.log(`Item ${index}: type=${postType}, title=${item.title?.substring(0, 50)}`);

      if (postType === 'attachment') {
        attachments.push({
          attachmentId: item['wp:post_id'],
          attachmentUrl: item['wp:attachment_url'] || '',
        });
      } else if (postType === 'post') {
        // Parse categories and tags for this post
        const postCategories: string[] = [];
        const postTags: string[] = [];

        const categoriesArray = ensureArray(item.category);
        categoriesArray.forEach((cat) => {
          if (cat['@_domain'] === 'category') {
            postCategories.push(cat['#text']);
          } else if (cat['@_domain'] === 'post_tag') {
            postTags.push(cat['#text']);
          }
        });

        posts.push({
          postId: item['wp:post_id'],
          postTitle: item.title || '',
          postName: item['wp:post_name'] || '',
          postDate: parseDate(item['wp:post_date'] || ''),
          postDateGmt: parseDate(item['wp:post_date_gmt'] || ''),
          postContent: item['content:encoded'] || '',
          postExcerpt: item['excerpt:encoded'] || '',
          postStatus: item['wp:status'],
          postType: postType,
          postAuthor: item['wp:post_author'] || '',
          postParent: item['wp:post_parent'] || '',
          postPassword: item['wp:post_password'] || '',
          isSticky: item['wp:is_sticky'] === '1',
          attachmentUrl: item['wp:attachment_url'],
          categories: postCategories,
          tags: postTags,
          comments: [],
          meta: {},
        });
      }
    });

    console.log(`Parsing complete: ${posts.length} posts, ${attachments.length} attachments`);

    return {
      title: channel.title || '',
      link: channel.link || '',
      description: channel.description || '',
      pubDate: channel.pubDate || '',
      language: channel.language || '',
      wxrVersion: channel['wp:wxr_version'] || '',
      baseSiteUrl: channel['wp:base_site_url'] || '',
      baseBlogUrl: channel['wp:base_blog_url'] || '',
      authors: [],
      categories: [],
      tags: [],
      posts,
      attachments,
    };
  } catch (error) {
    console.error('XML parsing error:', error);
    if (error instanceof XMLParserError) {
      throw error;
    }
    throw new XMLParserError(`Failed to parse XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validateWordPressExport(data: WordPressExport): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.posts || data.posts.length === 0) {
    errors.push('No posts found in the export file');
  }

  if (!data.title && !data.baseBlogUrl) {
    errors.push('Export file appears to be invalid (missing title and blog URL)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
