const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.get("/", blogController.getBlogs);
router.post("/", blogController.createBlog);

module.exports = router;
