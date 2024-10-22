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

// Test that a new blog can be created
test("POST /api/blogs - a new blog can be added", async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "http://example.com/new",
    likes: 15,
  };

  // Fetch initial blogs
  const initialResponse = await api.get("/api/blogs");
  const initialBlogsCount = initialResponse.body.length;

  // Send a POST request to add a new blog
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // Fetch the blogs again to confirm the new blog is added
  const updatedResponse = await api.get("/api/blogs");
  const updatedBlogs = updatedResponse.body;

  // Verify the total number of blogs increased by 1
  assert.strictEqual(updatedBlogs.length, initialBlogsCount + 1);

  // Verify that the new blog is saved with the correct content
  const titles = updatedBlogs.map((blog) => blog.title);
  assert.strictEqual(titles.includes("New Blog"), true);
});

// Test that a new blog can be created with default likes
test("POST /api/blogs - likes defaults to 0 if not provided", async () => {
  const newBlogWithoutLikes = {
    title: "Blog without Likes",
    author: "Anonymous",
    url: "http://example.com/no-likes",
  };

  // Send a POST request to add a new blog without the likes property
  const response = await api
    .post("/api/blogs")
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // Verify that the new blog has likes set to 0
  assert.strictEqual(response.body.likes, 0);
});

// Cleanup after tests
after(async () => {
  await mongoose.connection.close();
});
