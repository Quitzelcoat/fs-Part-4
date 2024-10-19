const { test, before, after } = require("node:test"); // Import native Node.js test functions
const assert = require("node:assert"); // Use assert for assertions
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const Blog = require("../models/blog"); // Your Blog model
const mongoose = require("mongoose");

// This wraps the Express app and makes it easy to send requests in tests
const api = supertest(app);

// Initialize some sample blogs
const initialBlogs = [
  {
    title: "First Blog",
    author: "John Doe",
    url: "http://example.com/first",
    likes: 10,
  },
  {
    title: "Second Blog",
    author: "Jane Doe",
    url: "http://example.com/second",
    likes: 5,
  },
];

// Clear the database and populate it with initial blogs before running tests
before(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

// Define your tests using the `test` function provided by Node.js
test("GET /api/blogs - blogs are returned as JSON", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("GET /api/blogs - the correct number of blogs is returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length);
});

// Close the database connection after tests
after(async () => {
  await mongoose.connection.close();
});
