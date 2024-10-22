const { test, before, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const mongoose = require("mongoose");

const api = supertest(app);

before(async () => {
  await User.deleteMany({});
});

test("POST /api/users - create a new user", async () => {
  const newUser = {
    username: "testuser",
    name: "Test User",
    password: "testpassword",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.username, newUser.username);

  const usersAtEnd = await api.get("/api/users");
  assert.strictEqual(usersAtEnd.body.length, 1);
});

test("GET /api/users - fetch all users", async () => {
  const response = await api.get("/api/users").expect(200);
  assert.strictEqual(response.body.length, 1);
});

after(async () => {
  await mongoose.connection.close();
});
