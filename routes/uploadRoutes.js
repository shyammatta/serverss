// server/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const Problem = require('../models/Problem');
const { cloudinary, storage } = require('../cloudinary'); // ✅

const router = express.Router();
const upload = multer({ storage }); // ✅ use cloudinary storage

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { text, village } = req.body;

    // Cloudinary URL is directly available in req.file.path
    const newProblem = await Problem.create({
      text,
      village,
      videoUrl: req.file.path, // ✅ cloudinary secure_url
      date: new Date()
    });

    res.json({ message: 'Uploaded', problem: newProblem });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Video upload failed' });
  }
});

module.exports = router;
