const e = require("express");
const request = require("supertest");
const appBuilder = require("../app.ts").default;

const create = jest.fn();
const findUnique = jest.fn();

const app = appBuilder({
  user: {
    create,
    findUnique,
  },
});

beforeEach(() => {
  create.mockReset();
  findUnique.mockReset();
});

describe("POST /register", () => {
  describe("given a valid user", () => {
    test("should respond with a 201 status code", async () => {
      const user = {
        email: "johndoe@gmail.com",
        password: "password",
        name: "John Doe",
        firstName: "John",
        lastName: "Doe",
      };
      create.mockImplementation(() => {
        return {
          id: 1,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      });
      const response = await request(app).post("/auth/register").send(user);
      expect(create.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(201);
      expect(response.body).not.toBeNull();
      expect(response.body.user).toEqual({
        id: 1,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    });
  });

  describe("given an invalid user", () => {
    test("should respond with a 400 status code", async () => {
      const user = {
        email: "",
        password: "",
        name: "",
        firstName: "",
        lastName: "",
      };
      const response = await request(app).post("/auth/register").send(user);
      expect(create.mock.calls.length).toBe(0);
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toBeNull();
      expect(response.body.error).toEqual("All fields are required");
    });
  });
});

describe("POST /login", () => {
  describe("given a valid user", () => {
    test("should respond with a 200 status code", async () => {
      const user = {
        email: "johndoe@gmail.com",
        password: "password",
      };

      findUnique.mockImplementation(() => {
        return {
          id: 1,
          email: user.email,
          name: "John Doe",
          firstName: "John",
          lastName: "Doe",
          password:
            "$2b$10$.vLEpdX7I5XqGqJuNknOSOvRHQlTL9TlMhEGR0SYD3BoCYMlSiQq6",
        };
      });

      const response = await request(app).post("/auth/login").send(user);
      expect(findUnique.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull();
      expect(response.body.user).toEqual({
        id: 1,
        email: user.email,
        name: "John Doe",
        firstName: "John",
        lastName: "Doe",
      });
    });
  });

  describe("given an invalid password", () => {
    test("should respond with a 400 status code", async () => {
      const user = {
        email: "johndoe@gmail.com",
        password: "wrongpassword",
      };

      findUnique.mockImplementation(() => {
        return {
          id: 1,
          email: user.email,
          name: "John Doe",
          firstName: "John",
          lastName: "Doe",
          password:
            "$2b$10$.vLEpdX7I5XqGqJuNknOSOvRHQlTL9TlMhEGR0SYD3BoCYMlSiQq6",
        };
      });
      const response = await request(app).post("/auth/login").send(user);
      expect(findUnique.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toBeNull();
      expect(response.body.error).toEqual("Invalid password");
    });
  });

  describe("given an invalid email", () => {
    test("should respond with a 400 status code", async () => {
      const user = {
        email: "wrongjohndoe@gmail.com",
        password: "password",
      };

      findUnique.mockImplementation(() => {
        return null;
      });

      const response = await request(app).post("/auth/login").send(user);
      expect(findUnique.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toBeNull();
      expect(response.body.error).toEqual("User not found");
    });
  });
});

describe("POST /logout", () => {
  describe("given a valid user", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/auth/logout");
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toEqual("Logout Successful");
    });
  });
});
