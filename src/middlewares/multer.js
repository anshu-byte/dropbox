import multer from 'multer';
import { FILE_PARENT_DIR, MAX_FILE_SIZE } from '../utils/constants.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILE_PARENT_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
export const upload = multer({ storage, limits: {
    fileSize: MAX_FILE_SIZE
  } });
