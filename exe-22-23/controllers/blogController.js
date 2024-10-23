const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const createBlog = async (req, res) => {
  const { title, url, author, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required." });
  }

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: "Token invalid" });
    }

    const user = await User.findOne();
    if (!user) {
      return res.status(400).json({ error: "No users found in the database." });
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.user.toString() !== decodedToken.id.toString()) {
      return res
        .status(401)
        .json({ error: "Unauthorized: You are not the creator of this blog" });
    }

    await Blog.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
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
