const request = require("supertest");
const appBuilder = require("../app.ts").default;

const findMany = jest.fn();
const findUnique = jest.fn();
const update = jest.fn();
const deleteUser = jest.fn();
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTcxMzEwMjg0MywiZXhwIjoyMzE3OTAyODQzfQ.gDc8mS9d3DmfNAMojEDMwp-IVTWdMMz1-77QJXNEPOs";

const app = appBuilder({
  user: {
    findMany,
    findUnique,
    update,
    delete: deleteUser,
  },
});

beforeEach(() => {
  findMany.mockReset();
  findUnique.mockReset();
  update.mockReset();
  deleteUser.mockReset();
});

describe("GET /users", () => {
  describe("given a list of users", () => {
    test("should respond with a 200 status code", async () => {
      findMany.mockImplementation(() => {
        return [
          {
            id: 1,
            email: "johndoe@gmail.com",
            name: "John Doe",
            firstName: "John",
            lastName: "Doe",
          },
          {
            id: 2,
            email: "janedoe@gmail.com",
            name: "Jane Doe",
            firstName: "Jane",
            lastName: "Doe",
          },
        ];
      });
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);
      expect(findMany.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull();
    });

    test("should respond with a 400 status code", async () => {
      findMany.mockImplementation(() => {
        return undefined;
      });
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);
      expect(findMany.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe("No users found");
    });

    test("should respond with a 401 status code No token provided", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer${token}`);
      expect(response.statusCode).toBe(401);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe("No token provided");
    });

    test("should respond with a 401 status code Unauthorized", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token + "1234"}`);
      expect(response.statusCode).toBe(401);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe("Unauthorized");
    });

    test("should respond with a 401 status code No authorization header provided", async () => {
      const response = await request(app).get("/users");
      expect(response.statusCode).toBe(401);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe("No authorization header provided");
    });
  });
});

describe("GET /users/:id", () => {
  describe("given a valid user id", () => {
    const dataUserId = [1, 2, 3];
    test("should respond with a 200 status code", async () => {
      for (const userId of dataUserId) {
        findUnique.mockReset();
        findUnique.mockImplementation(() => {
          return {
            user: {
              id: userId,
            },
          };
        });
        const response = await request(app)
          .get(`/users/${userId}`)
          .set("Authorization", `Bearer ${token}`);
        expect(findUnique.mock.calls.length).toBe(1);
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeNull();
        expect(response.body.user.id).toEqual(userId);
      }
    });
  });

  describe("user not found", () => {
    test("should respond with a 400 status code", async () => {
      findUnique.mockReset();
      findUnique.mockImplementation(() => {});
      const response = await request(app)
        .get(`/users/1`)
        .set("Authorization", `Bearer ${token}`);
      expect(findUnique.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("given an invalid user id", () => {
    const dataUserId = ["12a0", "abc"];
    test("should respond with a 400 status code", async () => {
      for (const userId of dataUserId) {
        findUnique.mockReset();
        const response = await request(app)
          .get(`/users/${userId}`)
          .set("Authorization", `Bearer ${token}`);
        expect(findUnique.mock.calls.length).toBe(0);
        expect(response.statusCode).toBe(400);
        expect(response.body).not.toBeNull();
        expect(response.body.message).toBe("Id must be a number");
      }
    });
  });

  describe("PUT /users/:id", () => {
    describe("given a valid user id", () => {
      test("should respond with a 200 status code", async () => {
        update.mockReset();
        update.mockImplementation(() => {
          return {
            user: {
              id: 1,
              language: "en",
              dark_mode: true,
              license: "MIT",
              avatar: "avatar",
              password:
                "$2b$10$.vLEpdX7I5XqGqJuNknOSOvRHQlTL9TlMhEGR0SYD3BoCYMlSiQq6",
            },
          };
        });
        const response = await request(app)
          .put(`/users/${1}`)
          .send({
            language: "en",
            dark_mode: true,
            password: "password",
            license: "MIT",
            avatar: "avatar",
          })
          .set("Authorization", `Bearer ${token}`);
        expect(update.mock.calls.length).toBe(1);
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeNull();
        expect(response.body.user.id).toEqual(1);
        expect(response.body.user.language).toBe("en");
        expect(response.body.user.dark_mode).toBe(true);
        expect(response.body.user.license).toBe("MIT");
        expect(response.body.user.password).not.toBeNull();
      });
    });
  });

  describe("given a valid user id but not the token user id", () => {
    test("should respond with a 400 status code", async () => {
      update.mockReset();
      const response = await request(app)
        .put(`/users/${2}`)
        .send({ language: "en", dark_mode: true, license: "MIT" })
        .set("Authorization", `Bearer ${token}`);
      expect(update.mock.calls.length).toBe(0);
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe("Not Authorized");
    });
  });

  describe("given an invalid user id", () => {
    const dataUserId = ["12a0", "abc"];
    test("should respond with a 400 status code", async () => {
      for (const userId of dataUserId) {
        update.mockReset();
        const response = await request(app)
          .put(`/users/${userId}`)
          .set("Authorization", `Bearer ${token}`);
        expect(findUnique.mock.calls.length).toBe(0);
        expect(response.statusCode).toBe(400);
        expect(response.body).not.toBeNull();
        expect(response.body.message).toBe("Id must be a number");
      }
    });
  });

  describe("given an user id that does not exist", () => {
    test("should respond with a 400 status code", async () => {
      update.mockReset();
      update.mockImplementation(() => {});
      const response = await request(app)
        .put(`/users/${1}`)
        .send({ language: "en", dark_mode: true, license: "MIT" })
        .set("Authorization", `Bearer ${token}`);
      expect(update.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe("Failed to update user");
    });
  });
});

describe("DELETE /users/:id", () => {
  describe("given a valid user id", () => {
    test("should respond with a 200 status code", async () => {
      deleteUser.mockReset();
      deleteUser.mockImplementation(() => {});
      const response = await request(app)
        .delete(`/users/${1}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe("User deleted");
    });
  });

  describe("given an invalid user id", () => {
    const dataUserId = ["0", "abc"];
    test("should respond with a 400 status code", async () => {
      for (const userId of dataUserId) {
        deleteUser.mockReset();
        const response = await request(app)
          .delete(`/users/${userId}`)
          .set("Authorization", `Bearer ${token}`);
        expect(deleteUser.mock.calls.length).toBe(0);
        expect(response.statusCode).toBe(400);
        expect(response.body).not.toBeNull();
      }
    });
  });

  describe("given an user id that does not exist", () => {
    const dataUserId = [2, 3, 4];
    test("should respond with a 400 status code", async () => {
      for (const userId of dataUserId) {
        deleteUser.mockReset();
        deleteUser.mockImplementation(() => {});
        const response = await request(app)
          .delete(`/users/${userId}`)
          .set("Authorization", `Bearer ${token}`);
        expect(deleteUser.mock.calls.length).toBe(0);
        expect(response.statusCode).toBe(400);
        expect(response.body).not.toBeNull();
      }
    });
  });
});
