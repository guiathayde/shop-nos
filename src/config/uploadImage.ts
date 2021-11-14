import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import path from 'path';

const imagesDirectory = path.resolve(process.cwd(), 'images');

interface UploadConfig {
  multer: {
    storage: StorageEngine;
  };
}

export default {
  multer: {
    storage: multer.diskStorage({
      destination: imagesDirectory,
      filename(request, file, callback) {
        const fileName = `${crypto.randomBytes(10).toString('hex')}.jpg`;
        return callback(null, fileName);
      },
    }),
  },
} as UploadConfig;
