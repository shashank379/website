const cloudinary = require('cloudinary').v2;

// Validate environment variables
const missingVars = [];
if (!process.env.CLOUDINARY_CLOUD_NAME) missingVars.push('CLOUDINARY_CLOUD_NAME');
if (!process.env.CLOUDINARY_API_KEY) missingVars.push('CLOUDINARY_API_KEY');
if (!process.env.CLOUDINARY_API_SECRET) missingVars.push('CLOUDINARY_API_SECRET');

if (missingVars.length > 0) {
  console.warn(`\n⚠️  WARNING: Missing Cloudinary configuration!`);
  console.warn(`Missing variables: ${missingVars.join(', ')}`);
  console.warn(`Image uploads will FAIL until these are configured in your .env file\n`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
