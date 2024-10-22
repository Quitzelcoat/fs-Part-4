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

test("POST /api/blogs - a new blog can be added", async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "http://example.com/new",
    likes: 15,
  };

  const initialResponse = await api.get("/api/blogs");
  const initialBlogsCount = initialResponse.body.length;

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const updatedResponse = await api.get("/api/blogs");
  const updatedBlogs = updatedResponse.body;

  assert.strictEqual(updatedBlogs.length, initialBlogsCount + 1);

  const titles = updatedBlogs.map((blog) => blog.title);
  assert.strictEqual(titles.includes("New Blog"), true);
});

test("POST /api/blogs - likes defaults to 0 if not provided", async () => {
  const newBlogWithoutLikes = {
    title: "Blog without Likes",
    author: "Anonymous",
    url: "http://example.com/no-likes",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("POST /api/blogs - responds with 400 if title is missing", async () => {
  const blogWithoutTitle = {
    author: "Anonymous",
    url: "http://example.com/no-title",
  };

  const response = await api
    .post("/api/blogs")
    .send(blogWithoutTitle)
    .expect(400);
});

// Test that a blog cannot be created without a url
test("POST /api/blogs - responds with 400 if url is missing", async () => {
  const blogWithoutUrl = {
    title: "Blog without URL",
    author: "Anonymous",
  };

  const response = await api
    .post("/api/blogs")
    .send(blogWithoutUrl)
    .expect(400);
});

// Cleanup after tests
after(async () => {
  await mongoose.connection.close();
});