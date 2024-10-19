const { test, before, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const mongoose = require("mongoose");

const api = supertest(app);

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

before(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

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

test("GET /api/blogs - the unique identifier property is named id", async () => {
  const response = await api.get("/api/blogs");

  response.body.forEach((blog) => {
    assert.strictEqual(blog.id !== undefined, true);
    assert.strictEqual(blog._id === undefined, true);
  });
});

// Cleanup after tests
after(async () => {
  await mongoose.connection.close();
});
