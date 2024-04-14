const request = require("supertest");
const appBuilder = require("../app.ts").default;

const register = jest.fn();
const login = jest.fn();
const logout = jest.fn();

const app = appBuilder({
  register,
  login,
  logout,
});

beforeEach(() => {
  register.mockReset();
  login.mockReset();
  logout.mockReset();
});

describe("POST /register", () => {
  describe("given a valid user", () => {
    test("should respond with a 200 status code", async () => {
      const user = {
        email: "johndoe@gmail.com",
        password: "password",
      };
      register.mockImplementation(() => {
        return {
          user: {
            email: user.email,
          },
        };
      });
      const response = await request(app).post("/auth/register");
      expect(register.mock.calls.length).toBe(1);
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull();
    });
  });
});
