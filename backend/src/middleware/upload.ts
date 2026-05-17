import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import sharp from 'sharp';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

/**
 * Validates file magic bytes (file signatures) to prevent MIME type spoofing.
 */
const validateMagicBytes = (buffer: Buffer, expectedMimetype: string): boolean => {
  // JPEG: FF D8 FF
  // PNG: 89 50 4E 47
  // WebP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
  // PDF: 25 50 44 46

  if (buffer.length < 4) return false;

  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isWebp = buffer.length >= 12 && 
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
  const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;

  switch (expectedMimetype) {
    case 'image/jpeg':
    case 'image/jpg':
      return isJpeg;
    case 'image/png':
      return isPng;
    case 'image/webp':
      return isWebp;
    case 'application/pdf':
      return isPdf;
    default:
      return false;
  }
};

const imageFileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
  }
};

const ebookFileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDF files are allowed.'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFileFilter,
});

export const uploadEbook = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for PDFs
  },
  fileFilter: ebookFileFilter,
});

export const uploadSingle = upload.single('image');

const processSingleFile = async (file: Express.Multer.File): Promise<void> => {
  const filePath = file.path;
  const buffer = fs.readFileSync(filePath);

  // Validate magic bytes
  if (!validateMagicBytes(buffer, file.mimetype)) {
    fs.unlinkSync(filePath);
    throw new Error('File content does not match the declared file type.');
  }

  // Skip processing for PDFs in ebook uploads
  if (file.mimetype === 'application/pdf') {
    if (!validateMagicBytes(buffer, 'application/pdf')) {
      fs.unlinkSync(filePath);
      throw new Error('Invalid PDF file.');
    }
    return;
  }

  // Re-encode image with sharp to strip metadata and validate it's a valid image
  const ext = path.extname(file.filename).toLowerCase();
  
  // Validate it's a valid image before processing
  const metadata = await sharp(filePath).metadata();
  if (!metadata.width || !metadata.height) {
    fs.unlinkSync(filePath);
    throw new Error('Invalid image file.');
  }

  // Re-encode to same format with metadata stripped
  const processedPath = filePath + '.processed' + ext;
  
  if (ext === '.png') {
    await sharp(filePath).png().toFile(processedPath);
  } else if (ext === '.webp') {
    await sharp(filePath).webp().toFile(processedPath);
  } else {
    // Default to JPEG for .jpg and .jpeg
    const jpegPath = filePath.replace(/\.[^.]+$/, '.jpg');
    await sharp(filePath).jpeg({ quality: 90 }).toFile(jpegPath);
    
    // Update filename reference
    fs.unlinkSync(filePath);
    fs.renameSync(jpegPath, filePath);
    file.filename = path.basename(filePath);
    file.path = filePath;
    file.mimetype = 'image/jpeg';
    return;
  }

  // Replace original with processed version
  fs.unlinkSync(filePath);
  fs.renameSync(processedPath, filePath);
};

/**
 * Post-processing middleware for uploaded images.
 * Re-encodes images with sharp to strip malicious metadata
 * and validates magic bytes.
 */
export const processUploadedImage = async (
  req: Request,
  res: any,
  next: any
): Promise<void> => {
  try {
    // Handle single file upload
    if (req.file) {
      await processSingleFile(req.file);
      next();
      return;
    }

    // Handle multiple file uploads (e.g., promotions)
    if (req.files) {
      const files: Express.Multer.File[] = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();
      
      for (const file of files) {
        await processSingleFile(file);
      }
      next();
      return;
    }

    next();
  } catch (error) {
    // Clean up on error
    try {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      if (req.files) {
        const files: Express.Multer.File[] = Array.isArray(req.files)
          ? req.files
          : Object.values(req.files).flat();
        for (const file of files) {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }
    } catch {
      // Ignore cleanup errors
    }
    const message = error instanceof Error ? error.message : 'Failed to process uploaded file.';
    console.error('Image processing error:', error);
    return res.status(400).json({
      success: false,
      message,
    });
  }
};
