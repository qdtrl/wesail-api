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

// describe("GET /users/:id", () => {
//   describe("given a valid user id", () => {
//     const dataUserId = [1, 2, 3];
//     test("should respond with a 200 status code", async () => {
//       for (const userId of dataUserId) {
//         findUnique.mockReset();
//         findUnique.mockImplementation(() => {
//           return {
//             user: {
//               id: userId,
//             },
//           };
//         });
//         const response = await request(app).get(`/users/${userId}`);
//         expect(findUnique.mock.calls.length).toBe(1);
//         expect(findUnique.mock.calls[0][0]).toBe(userId);
//         expect(response.statusCode).toBe(200);
//         expect(response.body).not.toBeNull();
//       }
//     });
//   });

//   describe("given an invalid user id", () => {
//     const dataUserId = ["0", "abc"];
//     test("should respond with a 404 status code", async () => {
//       for (const userId of dataUserId) {
//         findUnique.mockReset();
//         const response = await request(app).get(`/users/${userId}`);
//         expect(findUnique.mock.calls.length).toBe(0);
//         expect(response.statusCode).toBe(404);
//         expect(response.body).not.toBeNull();
//       }
//     });
//   });

//   describe("given an user id that does not exist", () => {
//     const dataUserId = [2, 3, 4];
//     test("should respond with a 404 status code", async () => {
//       for (const userId of dataUserId) {
//         findUnique.mockReset();
//         findUnique.mockImplementation(() => {});
//         const response = await request(app).get(`/users/${userId}`);
//         expect(findUnique.mock.calls.length).toBe(1);
//         expect(response.statusCode).toBe(404);
//         expect(response.body).not.toBeNull();
//       }
//     });
//   });
// });

// describe("PUT /users/:id", () => {
//   describe("given a valid user id", () => {
//     const dataUserId = [1, 2, 3];
//     test("should respond with a 200 status code", async () => {
//       for (const userId of dataUserId) {
//         update.mockReset();
//         update.mockImplementation(() => {
//           return {
//             user: {
//               id: userId,
//               language: "en",
//               dark_mode: true,
//               license: "MIT",
//             },
//           };
//         });
//         const response = await request(app)
//           .put(`/users/${userId}`)
//           .send({ language: "en", dark_mode: true, license: "MIT" });
//         expect(update.mock.calls.length).toBe(1);
//         expect(update.mock.calls[0][0]).toBe(userId);
//         expect(response.statusCode).toBe(200);
//         expect(response.body).not.toBeNull();
//       }
//     });
//   });

//   describe("given an invalid user id", () => {
//     const dataUserId = ["0", "abc"];
//     test("should respond with a 404 status code", async () => {
//       for (const userId of dataUserId) {
//         update.mockReset();
//         const response = await request(app)
//           .put(`/users/${userId}`)
//           .send({ language: "en", dark_mode: true, license: "MIT" });
//         expect(update.mock.calls.length).toBe(0);
//         expect(response.statusCode).toBe(404);
//         expect(response.body).not.toBeNull();
//       }
//     });
//   });

//   describe("given an user id that does not exist", () => {
//     const dataUserId = [2, 3, 4];
//     test("should respond with a 404 status code", async () => {
//       for (const userId of dataUserId) {
//         update.mockReset();
//         update.mockImplementation(() => {});
//         const response = await request(app)
//           .put(`/users/${userId}`)
//           .send({ language: "en", dark_mode: true, license: "MIT" });
//         expect(update.mock.calls.length).toBe(1);
//         expect(response.statusCode).toBe(404);
//         expect(response.body).not.toBeNull();
//       }
//     });
//   });
// });

// describe("DELETE /users/:id", () => {
//   describe("given a valid user id", () => {
//     const dataUserId = [1, 2, 3];
//     test("should respond with a 200 status code", async () => {
//       for (const userId of dataUserId) {
//         deleteUser.mockReset();
//         deleteUser.mockImplementation(() => {
//           return {
//             user: {
//               id: userId,
//             },
//           };
//         });
//         const response = await request(app).delete(`/users/${userId}`);
//         expect(deleteUser.mock.calls.length).toBe(1);
//         expect(deleteUser.mock.calls[0][0]).toBe(userId);
//         expect(response.statusCode).toBe(200);
//         expect(response.body).not.toBeNull();
//       }
//     });
//   });

//   describe("given an invalid user id", () => {
//     const dataUserId = ["0", "abc"];
//     test("should respond with a 404 status code", async () => {
//       for (const userId of dataUserId) {
//         deleteUser.mockReset();
//         const response = await request(app).delete(`/users/${userId}`);
//         expect(deleteUser.mock.calls.length).toBe(0);
//         expect(response.statusCode).toBe(404);
//         expect(response.body).not.toBeNull();
//       }
//     });
//   });

//   describe("given an user id that does not exist", () => {
//     const dataUserId = [2, 3, 4];
//     test("should respond with a 404 status code", async () => {
//       for (const userId of dataUserId) {
//         deleteUser.mockReset();
//         deleteUser.mockImplementation(() => {});
//         const response = await request(app).delete(`/users/${userId}`);
//         expect(deleteUser.mock.calls.length).toBe(1);
//         expect(response.statusCode).toBe(404);
//         expect(response.body).not.toBeNull();
//       }
//     });
//   });
// });
