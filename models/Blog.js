const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String }, // URL for the uploaded image
    postBy: { type: String, required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    comments: [CommentSchema],
  });
  

module.exports = mongoose.model('Blog', BlogSchema);
