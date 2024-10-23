const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./utils/config");
const logger = require("./utils/logger");
const blogRouter = require("./routes/blogs");
const usersRouter = require("./routes/users");
const { tokenExtractor } = require("./middleware/tokenExtractor");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());

app.use(tokenExtractor);

app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);

module.exports = app;
