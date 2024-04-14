const request = require("supertest");
const appBuilder = require("../app.ts").default;

const getUsers = jest.fn();
const getUser = jest.fn();
const createUser = jest.fn();
const updateUser = jest.fn();
const deleteUser = jest.fn();

const app = appBuilder({
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
});

beforeEach(() => {
  getUsers.mockReset();
  getUser.mockReset();
  createUser.mockReset();
  updateUser.mockReset();
  deleteUser.mockReset();
});

describe("GET /users", () => {
  describe("given a list of users", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/users");
      expect(getUsers.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull();
    });
  });
});

describe("GET /users/:id", () => {
  describe("given a valid user id", () => {
    const dataUserId = [1, 2, 3];
    test("should respond with a 200 status code", async () => {
      for (const userId of dataUserId) {
        getUser.mockReset();
        getUser.mockImplementation(() => {
          return {
            user: {
              id: userId,
            },
          };
        });
        const response = await request(app).get(`/users/${userId}`);
        expect(getUser.mock.calls.length).toBe(1);
        expect(getUser.mock.calls[0][0]).toBe(userId);
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeNull();
      }
    });
  });

  describe("given an invalid user id", () => {
    const dataUserId = ["0", "abc"];
    test("should respond with a 404 status code", async () => {
      for (const userId of dataUserId) {
        getUser.mockReset();
        const response = await request(app).get(`/users/${userId}`);
        expect(getUser.mock.calls.length).toBe(0);
        expect(response.statusCode).toBe(404);
        expect(response.body).not.toBeNull();
      }
    });
  });

  describe("given an user id that does not exist", () => {
    const dataUserId = [2, 3, 4];
    test("should respond with a 404 status code", async () => {
      for (const userId of dataUserId) {
        getUser.mockReset();
        getUser.mockImplementation(() => {});
        const response = await request(app).get(`/users/${userId}`);
        expect(getUser.mock.calls.length).toBe(1);
        expect(response.statusCode).toBe(404);
        expect(response.body).not.toBeNull();
      }
    });
  });
});

describe("POST /users", () => {
  describe("given a valid auth0_id", () => {
    const dataAuth0Id = ["123456", "1234567", "12345678"];
    test("should respond with a 201 status code", async () => {
      for (const auth0Id of dataAuth0Id) {
        createUser.mockReset();
        const response = await request(app)
          .post("/users")
          .send({ auth0_id: auth0Id });

        expect(createUser.mock.calls.length).toBe(1);
        expect(createUser.mock.calls[0][0]).toBe(auth0Id);
        expect(response.statusCode).toBe(201);
        expect(response.user).not.toBeNull();
      }
    });
  });

  describe("given an invalid auth0_id", () => {
    const dataAuth0Id = ["", null, undefined];
    test("should respond with a 400 status code", async () => {
      for (const auth0Id of dataAuth0Id) {
        createUser.mockReset();
        const response = await request(app)
          .post("/users")
          .send({ auth0_id: auth0Id });

        expect(createUser.mock.calls.length).toBe(0);
        expect(response.statusCode).toBe(400);
        expect(response.user).toBeUndefined();
      }
    });
  });

  describe("given a duplicated auth0_id", () => {
    const dataAuth0Id = ["123456", "1234567", "12345678"];
    test("should respond with a 400 status code", async () => {
      for (const auth0Id of dataAuth0Id) {
        createUser.mockReset();
        createUser.mockImplementation(() => {
          throw new Error("duplicated key value violates unique constraint");
        });
        const response = await request(app)
          .post("/users")
          .send({ auth0_id: auth0Id });

        expect(createUser.mock.calls.length).toBe(1);
        expect(createUser.mock.calls[0][0]).toBe(auth0Id);
        expect(response.statusCode).toBe(400);
        expect(response.user).toBeUndefined();
      }
    });
  });
});

describe("PUT /users/:id", () => {
  describe("given a valid user id", () => {
    const dataUserId = [1, 2, 3];
    test("should respond with a 200 status code", async () => {
      for (const userId of dataUserId) {
        updateUser.mockReset();
        updateUser.mockImplementation(() => {
          return {
            user: {
              id: userId,
              language: "en",
              dark_mode: true,
              license: "MIT",
            },
          };
        });
        const response = await request(app)
          .put(`/users/${userId}`)
          .send({ language: "en", dark_mode: true, license: "MIT" });
        expect(updateUser.mock.calls.length).toBe(1);
        expect(updateUser.mock.calls[0][0]).toBe(userId);
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeNull();
      }
    });
  });

  describe("given an invalid user id", () => {
    const dataUserId = ["0", "abc"];
    test("should respond with a 404 status code", async () => {
      for (const userId of dataUserId) {
        updateUser.mockReset();
        const response = await request(app)
          .put(`/users/${userId}`)
          .send({ language: "en", dark_mode: true, license: "MIT" });
        expect(updateUser.mock.calls.length).toBe(0);
        expect(response.statusCode).toBe(404);
        expect(response.body).not.toBeNull();
      }
    });
  });

  describe("given an user id that does not exist", () => {
    const dataUserId = [2, 3, 4];
    test("should respond with a 404 status code", async () => {
      for (const userId of dataUserId) {
        updateUser.mockReset();
        updateUser.mockImplementation(() => {});
        const response = await request(app)
          .put(`/users/${userId}`)
          .send({ language: "en", dark_mode: true, license: "MIT" });
        expect(updateUser.mock.calls.length).toBe(1);
        expect(response.statusCode).toBe(404);
        expect(response.body).not.toBeNull();
      }
    });
  });
});

describe("DELETE /users/:id", () => {
  describe("given a valid user id", () => {
    const dataUserId = [1, 2, 3];
    test("should respond with a 200 status code", async () => {
      for (const userId of dataUserId) {
        deleteUser.mockReset();
        deleteUser.mockImplementation(() => {
          return {
            user: {
              id: userId,
            },
          };
        });
        const response = await request(app).delete(`/users/${userId}`);
        expect(deleteUser.mock.calls.length).toBe(1);
        expect(deleteUser.mock.calls[0][0]).toBe(userId);
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeNull();
      }
    });
  });

  describe("given an invalid user id", () => {
    const dataUserId = ["0", "abc"];
    test("should respond with a 404 status code", async () => {
      for (const userId of dataUserId) {
        deleteUser.mockReset();
        const response = await request(app).delete(`/users/${userId}`);
        expect(deleteUser.mock.calls.length).toBe(0);
        expect(response.statusCode).toBe(404);
        expect(response.body).not.toBeNull();
      }
    });
  });

  describe("given an user id that does not exist", () => {
    const dataUserId = [2, 3, 4];
    test("should respond with a 404 status code", async () => {
      for (const userId of dataUserId) {
        deleteUser.mockReset();
        deleteUser.mockImplementation(() => {});
        const response = await request(app).delete(`/users/${userId}`);
        expect(deleteUser.mock.calls.length).toBe(1);
        expect(response.statusCode).toBe(404);
        expect(response.body).not.toBeNull();
      }
    });
  });
});
