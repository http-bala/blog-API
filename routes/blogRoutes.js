const express = require('express');
const Blog = require('../models/Blog.js'); // Ensure this matches your actual Blog model path
const router = express.Router();
const upload = require('../middleware/upload.js');
const { cloudinary } = require('../middleware/cloudinary.js');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new blog with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, postBy, content } = req.body;

    // Upload to Cloudinary
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'blog_images' });
      imageUrl = result.secure_url;
    }

    const blog = new Blog({ title, image: imageUrl, postBy, content });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err.message);
    res.status(500).json({ message: 'Failed to create blog' });
  }
});

// Delete a blog by ID
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Delete the associated image from Cloudinary, if it exists
    if (blog.image) {
      const imagePublicId = blog.image.split('/').pop().split('.')[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(`blog_images/${imagePublicId}`);
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err.message);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
});

// Add a comment to a blog
router.post('/:id/comments', async (req, res) => {
  try {
    const { name, email, comment } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.comments.push({ name, email, comment });
    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

module.exports = router;
