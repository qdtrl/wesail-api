const e = require("express");
const request = require("supertest");
const appBuilder = require("../app.ts").default;

const create = jest.fn();
const login = jest.fn();
const logout = jest.fn();

const app = appBuilder({
  user: {
    create,
    login,
    logout,
  },
});

beforeEach(() => {
  create.mockReset();
  login.mockReset();
  logout.mockReset();
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
