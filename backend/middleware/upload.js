const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(path.join(uploadDir, 'users'))) {
  fs.mkdirSync(path.join(uploadDir, 'users'), { recursive: true });
}

if (!fs.existsSync(path.join(uploadDir, 'businesses'))) {
  fs.mkdirSync(path.join(uploadDir, 'businesses'), { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine folder based on route path
    let folder = 'businesses';
    if (req.path && req.path.includes('profile')) {
      folder = 'users';
    }
    const destPath = path.join(uploadDir, folder);
    console.log('Upload destination:', destPath);
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow all common image formats
  const allowedTypes = /jpeg|jpg|png|gif|webp|bmp|svg|tiff|tif|ico|heic|heif|avif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('image/');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Upload configurations
const uploadSingle = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB
  },
  fileFilter: fileFilter
}).single('photo');

const uploadMultiple = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB
  },
  fileFilter: fileFilter
}).array('images', 5);

module.exports = {
  uploadSingle,
  uploadMultiple
};
