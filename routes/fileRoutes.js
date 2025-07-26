const express = require('express');
const router = express.Router();
const fileController = require('../controller/fileController');
const multer = require('multer');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// Routes
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/:filename', fileController.getFile);

module.exports = router;
