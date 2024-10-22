const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.get("/", blogController.getBlogs);
router.post("/", blogController.createBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;