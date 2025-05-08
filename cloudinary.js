// server/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dgm9a6bxl', // replace with your Cloudinary cloud name
  api_key: '115737262565333',
  api_secret: 'UYvt3fCh4H0ZiE8kTwBJfGHVS3Q'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: 'video',
    folder: 'village_problems', // optional folder in Cloudinary
    format: async (req, file) => 'mp4', // force video format
    public_id: (req, file) => Date.now() + '-' + file.originalname
  }
});

module.exports = { cloudinary, storage };
