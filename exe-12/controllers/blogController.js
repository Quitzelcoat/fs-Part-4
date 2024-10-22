const Blog = require("../models/blog");

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const createBlog = async (req, res) => {
  const { title, url, author, likes } = req.body;

  // Validate required fields
  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required." });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  try {
    const result = await blog.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getBlogs,
  createBlog,
};
