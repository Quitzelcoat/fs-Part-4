const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userExtractor = async (request, response, next) => {
  const token = request.token; // The token should be extracted earlier with tokenExtractor
  if (!token) {
    return response.status(401).json({ error: "Token missing" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "Token invalid" });
    }

    // Find the user by ID from the decoded token
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(401).json({ error: "User not found" });
    }

    // Set the user in the request object
    request.user = user;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return response.status(401).json({ error: "Token invalid or expired" });
  }
};

module.exports = userExtractor;
