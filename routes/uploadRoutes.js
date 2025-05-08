// server/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const Problem = require('../models/Problem');
const cloudinary = require('../cloudinary'); // import Cloudinary config
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { text, village } = req.body;
    const filePath = req.file.path; // ✅ Actual path of uploaded file

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video'
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    // Save to DB
    const newProblem = await Problem.create({
      text,
      village,
      videoUrl: result.secure_url, // Use Cloudinary video URL
      date: new Date()
    });

    res.json({ message: 'Uploaded', problem: newProblem });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Video upload failed' });
  }
});

module.exports = router;





