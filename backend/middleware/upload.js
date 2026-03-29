const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ritzy24_products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  },
});

const upload = multer({ storage });

module.exports = upload;
