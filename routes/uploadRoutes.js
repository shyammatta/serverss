const express = require('express');
const multer = require('multer');
const Problem = require('../models/Problem');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/upload', upload.single('video'), async (req, res) => {
  const { text, village } = req.body;
  const videoPath = 'cloudinary://115737262565333:UYvt3fCh4H0ZiE8kTwBJfGHVS3Q@dgm9a6bxl';

  await Problem.create({ text, videoPath, village });
  res.json({ message: 'Uploaded' });
});

module.exports = router;
