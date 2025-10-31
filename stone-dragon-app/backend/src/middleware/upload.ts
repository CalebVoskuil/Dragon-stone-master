/**
 * @fileoverview File upload middleware using Multer.
 * Handles file uploads for volunteer log proof documents.
 * 
 * @module middleware/upload
 * @requires multer
 * @requires path
 */

import multer from 'multer';
import { FileUploadConfig } from '../types';

/**
 * File upload configuration object.
 * Defines allowed file types, size limits, and upload destination.
 * 
 * @constant
 * @type {FileUploadConfig}
 */
const uploadConfig: FileUploadConfig = {
  maxSize: parseInt(process.env['MAX_FILE_SIZE'] || '5242880'), // 5MB default
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  uploadPath: process.env['UPLOAD_PATH'] || './uploads',
};

/**
 * Use memory storage so the controller can upload the buffer to S3.
 */
const storage = multer.memoryStorage();

/**
 * File filter function to validate uploaded file types.
 * Checks if the file's MIME type is in the allowed list.
 * 
 * @param {any} _req - Express request object (unused)
 * @param {Express.Multer.File} file - The uploaded file object
 * @param {multer.FileFilterCallback} cb - Callback function to accept or reject the file
 * @returns {void}
 */
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (uploadConfig.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${uploadConfig.allowedTypes.join(', ')}`));
  }
};

/**
 * Configured Multer instance for file uploads.
 * Use this middleware to handle single or multiple file uploads.
 * 
 * @constant
 * @type {multer.Multer}
 * 
 * @example
 * // Single file upload
 * router.post('/upload', upload.single('proof'), controller);
 * 
 * @example
 * // Multiple files
 * router.post('/upload', upload.array('files', 5), controller);
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: uploadConfig.maxSize,
  },
});

/**
 * Error handler middleware specifically for Multer upload errors.
 * Handles file size limits, file count limits, and file type errors.
 * 
 * @param {any} error - The error object from Multer
 * @param {any} _req - Express request object (unused)
 * @param {any} res - Express response object
 * @param {any} next - Express next middleware function
 * @returns {void}
 * 
 * @example
 * router.post('/upload', upload.single('file'), handleUploadError, controller);
 */
export const handleUploadError = (error: any, _req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 1 file per upload.',
      });
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  
  next(error);
};

/* End of file middleware/upload.ts */