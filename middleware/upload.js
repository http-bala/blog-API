const multer = require('multer');
const { storage } = require('./cloudinary'); // Import storage from cloudinary.js

const upload = multer({ storage }); // Configure multer to use Cloudinary storage

module.exports = upload;
