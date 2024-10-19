const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

// Define the toJSON method to rename _id to id and remove __v
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Convert _id to string and assign it to id
    delete returnedObject._id; // Remove _id
    delete returnedObject.__v; // Remove __v (versioning key)
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
