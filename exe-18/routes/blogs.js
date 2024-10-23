const express = require("express");
const {
  getBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blogController");
const {
  tokenExtractor,
  userExtractor,
} = require("../controllers/loginControllers");

const router = express.Router();

router.get("/", getBlogs);
router.post("/", tokenExtractor, userExtractor, createBlog);
router.delete("/:id", tokenExtractor, userExtractor, deleteBlog);
router.put("/:id", tokenExtractor, userExtractor, updateBlog);

module.exports = router;
