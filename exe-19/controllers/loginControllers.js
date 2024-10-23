const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Compare password hashes
  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Create token payload
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // Sign the token
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "1h" });

  res.status(200).json({
    token,
    username: user.username,
    name: user.name,
  });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = (req, res, next) => {
  if (req.token) {
    try {
      const decodedToken = jwt.verify(req.token, process.env.SECRET);
      req.user = decodedToken;
    } catch (error) {
      return res.status(401).json({ error: "Token invalid or expired" });
    }
  } else {
    return res.status(401).json({ error: "Token missing" });
  }
  next();
};

module.exports = {
  loginUser,
  tokenExtractor,
  userExtractor,
};
