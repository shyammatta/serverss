// cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dgm9a6bxl',
  api_key: '115737262565333',
  api_secret: 'UYvt3fCh4H0ZiE8kTwBJfGHVS3Q'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'village-issues', // Cloudinary folder name
    resource_type: 'video'    // Important for video
  }
});

module.exports = {
  cloudinary,
  storage
};
