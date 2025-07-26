const db = require('../models/db');
const path = require('path');
const fs = require('fs');

// Upload File Controller
exports.uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const originalFilename = req.file.originalname;  // Only original name

  // Save only original filename to DB
  db.query(
    'INSERT INTO files (filename) VALUES (?)', 
    [originalFilename], 
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database Error' });
      res.json({ 
        message: 'File uploaded successfully', 
        filename: originalFilename 
      });
    }
  );
};

// Get File by Original Filename Controller
exports.getFile = (req, res) => {
  const requestedFilename = req.params.filename;  // e.g., flower.jpg

  // First, check if filename exists in DB
  const query = 'SELECT * FROM files WHERE filename = ? LIMIT 1';
  db.query(query, [requestedFilename], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database Error' });
    if (results.length === 0) return res.status(404).json({ error: 'File not found in DB' });

    // Now search in uploads folder for a file ending with requested filename
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
      if (err) return res.status(500).json({ error: 'Unable to read uploads folder' });

      // Find a file like 'timestamp-filename.jpg'
      const matchedFile = files.find(file => file.endsWith(`-${requestedFilename}`));
      if (!matchedFile) {
        return res.status(404).json({ error: 'File not found on server' });
      }

      const filePath = path.join(uploadsDir, matchedFile);
      res.sendFile(filePath);
    });
  });
};