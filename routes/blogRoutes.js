const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const upload = require('../middleware/upload'); // Adjust path if necessary


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
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
      console.log('Request Body:', req.body);
      console.log('Request File:', req.file); // Should show uploaded file details
  
      const { title, postBy, content } = req.body;
      const image = req.file ? req.file.path : null;
  
      const blog = new Blog({ title, image, postBy, content });
      await blog.save();
  
      res.status(201).json(blog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });
  
  
  
  

module.exports = router;
