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

test("POST /api/users - fails with missing username", async () => {
  const newUser = {
    name: "No Username",
    password: "validpassword",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(
    response.body.error,
    "Username must be at least 3 characters long"
  );
});

test("POST /api/users - fails with missing password", async () => {
  const newUser = {
    username: "testuser",
    name: "Test User",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(
    response.body.error,
    "Password must be at least 3 characters long"
  );
});

test("POST /api/users - fails with non-unique username", async () => {
  const newUser = {
    username: "duplicateuser",
    name: "Duplicate User",
    password: "validpassword",
  };

  // First request should succeed
  await api.post("/api/users").send(newUser).expect(201);

  // Second request with the same username should fail
  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.error, "Username must be unique");
});

test("POST /api/users - fails with short username", async () => {
  const newUser = {
    username: "us",
    name: "Short Username",
    password: "validpassword",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(
    response.body.error,
    "Username must be at least 3 characters long"
  );
});

test("POST /api/users - fails with short password", async () => {
  const newUser = {
    username: "validusername",
    name: "Short Password",
    password: "12",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(
    response.body.error,
    "Password must be at least 3 characters long"
  );
});

after(async () => {
  await mongoose.connection.close();
});
