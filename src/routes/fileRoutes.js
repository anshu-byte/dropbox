import express from 'express';
import { upload } from '../middlewares/multer.js';
import { uploadFileController, readFileController, deleteFileController, updateFileController, listAllFilesController } from '../controllers/fileController.js';
import { validateReadFile, validateFileUpload, validateDeleteFile, validateFileUpdate, validateListAllFiles } from '../middlewares/fileValidator.js';


const fileRoutes = express.Router();

fileRoutes.post('/upload', upload.single('file'), validateFileUpload, uploadFileController);
fileRoutes.get('/:fileId', validateReadFile, readFileController);
fileRoutes.delete('/:fileId',validateDeleteFile, deleteFileController);
fileRoutes.put('/:fileId', (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    upload.single('file')(req, res, next);
  } else {
    next();
  }
}, validateFileUpdate, updateFileController);

fileRoutes.get('',validateListAllFiles, listAllFilesController);

export default fileRoutes;
