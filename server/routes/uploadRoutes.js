import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { runWorker } from '../utils/workerUpload.js';

const router = express.Router();

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });
router.post('/file', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('File info:', req.file);

  try {
    const result = await runWorker(req.file.path);
    res.status(200).json({ message: result });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
