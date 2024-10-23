const bcrypt = require("bcryptjs");
const User = require("../models/user");

const createUser = async (req, res) => {
  const { username, name, password } = req.body;

  // Check if username and password are provided and meet the length requirements
  if (!username || username.length < 3) {
    return res.status(400).json({
      error: "Username must be at least 3 characters long",
    });
  }

  if (!password || password.length < 3) {
    return res.status(400).json({
      error: "Password must be at least 3 characters long",
    });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        error: "Username must be unique",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    // Save the new user
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
    });
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createUser,
  getUsers,
};
