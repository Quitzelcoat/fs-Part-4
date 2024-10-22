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

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Blog.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "Blog not found." });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// New function to update a blog post by ID (mostly for updating likes)
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes }, // Update only the likes field
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
};
