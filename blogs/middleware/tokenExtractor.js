// middleware/tokenExtractor.js

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("Authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }

  next();
};

module.exports = { tokenExtractor };
