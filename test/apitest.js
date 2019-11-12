const supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:5000");

describe("### GET /api/profile", function() {
  it("should return a list of profiles", function(done) {
    server
      .get("/api/profile")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("POST /api/auth", function() {
  let user = {
    email: "dbilderback@gmail.com",
    password: "123456"
  };
  it("respond with a token for a logged in user", function(done) {
    server
      .post("/api/auth")
      .set("Content-Type", "application/json")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("POST /api/auth", function() {
  let user = {
    email: "bademail@gmail.com",
    password: "123456"
  };
  it("respond with a 400 invalid user for a bad email", function(done) {
    server
      .post("/api/auth")
      .set("Content-Type", "application/json")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(400, done);
  });
});

describe("POST /api/auth", function() {
  let user = {
    email: "dbilderback@gmail.com",
    password: "654321"
  };
  it("respond with a 400 invalid user for a bad password", function(done) {
    server
      .post("/api/auth")
      .set("Content-Type", "application/json")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(400, done);
  });
});

describe("POST /api/auth", function() {
  let user = {
    email: "",
    password: "12345"
  };
  it("respond with a 400 invalid user for a missing email", function(done) {
    server
      .post("/api/auth")
      .set("Content-Type", "application/json")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(400, done);
  });
});

describe("POST /api/auth", function() {
  let user = {
    email: "dbilderback@gmail.com",
    password: ""
  };
  it("respond with a 400 invalid user for a missing password", function(done) {
    server
      .post("/api/auth")
      .set("Content-Type", "application/json")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(400, done);
  });
});
