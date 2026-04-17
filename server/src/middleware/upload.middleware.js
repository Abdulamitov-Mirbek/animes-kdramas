import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Создаем папки для загрузок
const uploadDirs = ['uploads/videos', 'uploads/images', 'uploads/subtitles'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Настройка хранения для видео
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Настройка хранения для изображений
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Настройка хранения для субтитров
const subtitleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/subtitles');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'subtitle-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Фильтры файлов
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|mkv|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (MP4, WebM, MKV, MOV, AVI)'));
  }
};

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (JPEG, PNG, GIF, WebP)'));
  }
};

const subtitleFilter = (req, file, cb) => {
  const allowedTypes = /srt|vtt|ass/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Only subtitle files are allowed (SRT, VTT, ASS)'));
  }
};

// Экспортируем middleware
export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: videoFilter,
});

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter,
});

export const uploadSubtitle = multer({
  storage: subtitleStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: subtitleFilter,
});