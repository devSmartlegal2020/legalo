import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

export class ImageDownloadError extends Error {
  constructor(message: string, public url: string) {
    super(message);
    this.name = 'ImageDownloadError';
  }
}

export interface DownloadedImage {
  originalUrl: string;
  localPath: string;
  filename: string;
  success: boolean;
  error?: string;
}

/**
 * Extract all image URLs from HTML content
 */
export function extractImageUrls(content: string): string[] {
  const urls: string[] = [];
  
  // Match <img src="..."> tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const url = match[1];
    if (isValidImageUrl(url)) {
      urls.push(url);
    }
  }
  
  // Match background-image URLs in style attributes
  const bgRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgRegex.exec(content)) !== null) {
    const url = match[1];
    if (isValidImageUrl(url)) {
      urls.push(url);
    }
  }
  
  // Remove duplicates
  return [...new Set(urls)];
}

/**
 * Check if URL is a valid image URL
 */
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Skip data URIs
  if (url.startsWith('data:')) return false;
  
  // Skip relative URLs (we can't download them without base URL)
  if (url.startsWith('/')) return false;
  
  // Must be http or https
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Generate a safe filename from URL
 */
export function generateFilename(url: string): string {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const originalFilename = path.basename(pathname);
    
    // Clean filename
    let filename = originalFilename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase();
    
    // If no extension, try to determine from URL or default to jpg
    if (!path.extname(filename)) {
      filename += '.jpg';
    }
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    
    return `${name}_${timestamp}${ext}`;
  } catch {
    return `image_${Date.now()}.jpg`;
  }
}

/**
 * Download a single image
 */
export function downloadImage(url: string, targetDir: string): Promise<DownloadedImage> {
  return new Promise((resolve) => {
    try {
      const filename = generateFilename(url);
      const localPath = path.join(targetDir, filename);
      
      // Ensure target directory exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const request = client.get(url, { timeout: 30000 }, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            downloadImage(redirectUrl, targetDir)
              .then(resolve)
              .catch((err) => {
                resolve({
                  originalUrl: url,
                  localPath: '',
                  filename: '',
                  success: false,
                  error: `Redirect failed: ${err.message}`,
                });
              });
            return;
          }
        }
        
        if (response.statusCode !== 200) {
          resolve({
            originalUrl: url,
            localPath: '',
            filename: '',
            success: false,
            error: `HTTP ${response.statusCode}`,
          });
          return;
        }
        
        const fileStream = fs.createWriteStream(localPath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          resolve({
            originalUrl: url,
            localPath: localPath,
            filename: filename,
            success: true,
          });
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(localPath, () => {}); // Clean up on error
          resolve({
            originalUrl: url,
            localPath: '',
            filename: '',
            success: false,
            error: err.message,
          });
        });
      });
      
      request.on('error', (err) => {
        resolve({
          originalUrl: url,
          localPath: '',
          filename: '',
          success: false,
          error: err.message,
        });
      });
      
      request.on('timeout', () => {
        request.destroy();
        resolve({
          originalUrl: url,
          localPath: '',
          filename: '',
          success: false,
          error: 'Request timeout',
        });
      });
    } catch (error) {
      resolve({
        originalUrl: url,
        localPath: '',
        filename: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}

/**
 * Download multiple images
 */
export async function downloadImages(
  urls: string[],
  targetDir: string,
  onProgress?: (current: number, total: number, url: string) => void
): Promise<DownloadedImage[]> {
  const results: DownloadedImage[] = [];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    
    if (onProgress) {
      onProgress(i + 1, urls.length, url);
    }
    
    const result = await downloadImage(url, targetDir);
    results.push(result);
    
    // Small delay to avoid overwhelming the server
    if (i < urls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Replace image URLs in content with local paths
 */
export function replaceImageUrls(
  content: string,
  urlMap: Map<string, { localPath: string; filename: string }>
): string {
  let updatedContent = content;
  
  // Replace in img src attributes
  const imgRegex = /(<img[^>]+src=["'])([^"']+)(["'][^>]*>)/gi;
  updatedContent = updatedContent.replace(imgRegex, (match, prefix, url, suffix) => {
    const mapped = urlMap.get(url);
    if (mapped) {
      // Use relative path from uploads directory
      return `${prefix}/uploads/imported/${mapped.filename}${suffix}`;
    }
    return match;
  });
  
  // Replace in background-image styles
  const bgRegex = /(background-image:\s*url\(["']?)([^"')]+)(["']?\))/gi;
  updatedContent = updatedContent.replace(bgRegex, (match, prefix, url, suffix) => {
    const mapped = urlMap.get(url);
    if (mapped) {
      return `${prefix}/uploads/imported/${mapped.filename}${suffix}`;
    }
    return match;
  });
  
  return updatedContent;
}

/**
 * Delete downloaded images
 */
export async function deleteDownloadedImages(imagePaths: string[]): Promise<void> {
  for (const imagePath of imagePaths) {
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (error) {
      console.error(`Failed to delete image ${imagePath}:`, error);
    }
  }
}
