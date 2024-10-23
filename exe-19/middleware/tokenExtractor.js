// middleware/tokenExtractor.js

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("Authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7); // Extract the token part after "Bearer "
  } else {
    req.token = null; // If no token is provided
  }

  next(); // Pass control to the next middleware or route handler
};

module.exports = { tokenExtractor };
