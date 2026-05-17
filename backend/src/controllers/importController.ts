import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../types';
import {
  startWordPressImport,
  cancelImport,
  undoImport,
  getImportProgress,
  getAllImports,
  getImportDetails,
  previewWordPressImport,
} from '../services/importService';

/**
 * Upload and start WordPress import
 */
export const uploadWordPressImport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    // Validate file type
    if (!req.file.originalname.endsWith('.xml')) {
      res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload an XML file.',
      });
      return;
    }

    const xmlContent = req.file.buffer.toString('utf-8');
    const userId = req.user!._id;
    const defaultStatus = (req.body.defaultStatus as 'draft' | 'published') || 'draft';

    const result = await startWordPressImport(
      xmlContent,
      req.file.originalname,
      userId,
      {
        defaultStatus,
        defaultUserId: userId,
      }
    );

    if (result.success) {
      res.status(202).json({
        success: true,
        message: 'Import started successfully',
        data: {
          importId: result.importId,
          totalPosts: result.totalPosts,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Import failed to start',
      });
    }
  } catch (error) {
    console.error('Import upload error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

/**
 * Preview WordPress import
 */
export const previewImport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Preview import request received');
    
    if (!req.file) {
      console.log('No file in request');
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);

    // Validate file type
    if (!req.file.originalname.endsWith('.xml')) {
      console.log('Invalid file type:', req.file.originalname);
      res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload an XML file.',
      });
      return;
    }

    const xmlContent = req.file.buffer.toString('utf-8');
    console.log('XML content length:', xmlContent.length);
    console.log('First 500 chars:', xmlContent.substring(0, 500));

    const result = await previewWordPressImport(xmlContent);
    console.log('Preview result:', result);

    if (result.success) {
      res.json({
        success: true,
        data: {
          posts: result.posts,
          totalPosts: result.totalPosts,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error,
      });
    }
  } catch (error) {
    console.error('Import preview error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

/**
 * Get import progress
 */
export const getImportStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const progress = await getImportProgress(id);

    if (!progress) {
      res.status(404).json({
        success: false,
        message: 'Import not found',
      });
      return;
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Get import status error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

/**
 * Stream import progress (SSE)
 */
export const streamImportProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    // Send initial data
    let lastProgress: any = null;

    const sendProgress = async () => {
      const progress = await getImportProgress(id);
      
      if (!progress) {
        res.write(`event: error\ndata: ${JSON.stringify({ message: 'Import not found' })}\n\n`);
        res.end();
        return false;
      }

      // Only send if progress changed
      if (JSON.stringify(progress) !== JSON.stringify(lastProgress)) {
        lastProgress = progress;
        res.write(`data: ${JSON.stringify(progress)}\n\n`);

        // Close connection if completed, failed, or cancelled
        if (['completed', 'failed', 'cancelled'].includes(progress.status)) {
          res.write(`event: close\ndata: {}\n\n`);
          res.end();
          return false;
        }
      }

      return true;
    };

    // Send initial progress
    const shouldContinue = await sendProgress();
    if (!shouldContinue) return;

    // Poll for updates every 2 seconds
    const interval = setInterval(async () => {
      const shouldContinue = await sendProgress();
      if (!shouldContinue) {
        clearInterval(interval);
      }
    }, 2000);

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });

  } catch (error) {
    console.error('Stream import progress error:', error);
    res.write(`event: error\ndata: ${JSON.stringify({ message: error instanceof Error ? error.message : 'Unknown error' })}\n\n`);
    res.end();
  }
};

/**
 * Cancel import
 */
export const cancelImportController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const cancelled = await cancelImport(id, userId);

    if (cancelled) {
      res.json({
        success: true,
        message: 'Import cancelled successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Import cannot be cancelled (may already be completed or not found)',
      });
    }
  } catch (error) {
    console.error('Cancel import error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

/**
 * Undo import
 */
export const undoImportController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const result = await undoImport(id, userId);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Undo import error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

/**
 * Get all imports
 */
export const getAllImportsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllImports(page, limit);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get all imports error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

/**
 * Get import details
 */
export const getImportDetailsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const importDetails = await getImportDetails(id);

    if (!importDetails) {
      res.status(404).json({
        success: false,
        message: 'Import not found',
      });
      return;
    }

    res.json({
      success: true,
      data: importDetails,
    });
  } catch (error) {
    console.error('Get import details error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
