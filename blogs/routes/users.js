const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/", userController.createUser); // Create user
router.get("/", userController.getUsers); // Get all users

module.exports = router;
