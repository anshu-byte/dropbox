import { body, query, param, validationResult } from 'express-validator';
import path from 'path'

import { allowedExtensions } from '../utils/constants.js';

const isValidFileFormat = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return false;
  }

  return true;
}

const validateFileUpload = [
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('File is required');
    }

    if (!isValidFileFormat(req.file)) {
      throw new Error('Invalid file format');
    }
    return true;
  }),
  body('customName')
  .optional()
  .isString().withMessage('Custom name should be an string')
  .notEmpty().withMessage('Custom name should not be empty'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateFileId = [
  param('fileId').isUUID().withMessage('File ID should be a valid UUID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateReadFile = validateFileId;

const validateDeleteFile = validateFileId;

const validateFileUpdate = [
  param('fileId').optional().isUUID().withMessage('File ID should be a valid UUID'),
  body('file').optional().custom((value, { req }) => {
    if (req.file && !isValidFileFormat(req.file)) {
        throw new Error('Invalid file format');
    }
    if (req.body && Object.keys(req.body).length == 0) {
      throw new Error('Any one from file or metadata should at least be present');
    }
    return true;
  }),
  body('customName')
  .optional()
  .isString().withMessage('Custom name should be an string')
  .notEmpty().withMessage('Custom name should not be empty'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateListAllFiles = [
  body().custom((value, { req }) => {
    if (req.body && Object.keys(req.body).length > 0) {
      throw new Error('Body should be absent');
    }
    return true;
  }),
  query().custom((value, { req }) => {
    if (req.query && Object.keys(req.query).length > 0) {
      throw new Error('Query parameters should be absent');
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


export { validateFileUpload, validateReadFile, validateDeleteFile, validateFileUpdate, validateListAllFiles}