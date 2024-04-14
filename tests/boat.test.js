const request = require("supertest");
const appBuilder = require("../app.ts").default;

// const getBoats = jest.fn();
// const getBoat = jest.fn();
// const createBoat = jest.fn();
// const updateBoat = jest.fn();
// const deleteBoat = jest.fn();

// const app = appBuilder({
//     getBoats,
//     getBoat,
//     createBoat,
//     updateBoat,
//     deleteBoat
//  });

// beforeEach(() => {
//     getBoats.mockReset();
//     getBoat.mockReset();
//     createBoat.mockReset();
//     updateBoat.mockReset();
//     deleteBoat.mockReset();
// })

// describe("GET /boats", () => {
//     describe("given a list of boats", () => {
//         test("should respond with a 200 status code", async () => {
//             const response = await request(app).get("/boats");
//             expect(getBoats.mock.calls.length).toBe(1);
//             expect(response.statusCode).toBe(200);
//             expect(response.body).not.toBeNull();
//         })
//     })
// })

// describe("GET /boats/:id", () => {
//     describe("given a valid boat id", () => {
//         const dataBoatId = [1, 2, 3];
//         test("should respond with a 200 status code", async () => {
//             for (const boatId of dataBoatId) {
//                 getBoat.mockReset();
//                 getBoat.mockImplementation(() => {
//                     return {
//                         boat: {
//                             id: boatId
//                         }
//                 }})
//                 const response = await request(app).get(`/boats/${boatId}`);
//                 expect(getBoat.mock.calls.length).toBe(1);
//                 expect(getBoat.mock.calls[0][0]).toBe(boatId);
//                 expect(response.statusCode).toBe(200);
//                 expect(response.body).not.toBeNull();
//             }
//         })
//     })

//     describe("given an invalid boat id", () => {
//         const dataBoatId = ["0", "abc"];
//         test("should respond with a 404 status code", async () => {
//             for (const boatId of dataBoatId) {
//                 getBoat.mockReset();
//                 const response = await request(app).get(`/boats/${boatId}`);
//                 expect(getBoat.mock.calls.length).toBe(0);
//                 expect(response.statusCode).toBe(404);
//                 expect(response.body).not.toBeNull();
//             }
//         })
//     })

//     describe("given an boat id that does not exist", () => {
//         const dataBoatId = [2, 3, 4];
//         test("should respond with a 404 status code", async () => {
//             for (const boatId of dataBoatId) {
//                 getBoat.mockReset();
//                 getBoat.mockImplementation(() => {})
//                 const response = await request(app).get(`/boats/${boatId}`);
//                 expect(getBoat.mock.calls.length).toBe(1);
//                 expect(response.statusCode).toBe(404);
//                 expect(response.body).not.toBeNull();
//             }
//         })
//     })
// })

// describe("POST /boats", () => {
//     describe("given a valid data", () => {
//         // model, name, description
//         const dataBoats =
//             [{
//                 model: "model1",
//                 name: "name1",
//                 description: "description1"
//             },
//             {
//                 model: "model2",
//                 name: "name2",
//                 description: "description2"
//             },
//             {
//                 model: "model3",
//                 name: "name3",
//                 description: "description3"
//             }];
//         test("should respond with a 201 status code", async () => {
//             for (const boat of dataBoats) {
//                 createBoat.mockReset();
//                 createBoat.mockImplementation(() => {
//                     return {
//                         boat: {
//                             model: boat.model,
//                             name: boat.name,
//                             description: boat.description
//                         }
//                 }})
//                 const response = await request(app).post("/boats").send({ model: boat.model, name: boat.name, description: boat.description });

//                 expect(createBoat.mock.calls.length).toBe(1);
//                 expect(createBoat.mock.calls[0][0]).toBe(boat.model);
//                 expect(response.statusCode).toBe(201);
//                 expect(response.boat).not.toBeNull();
//             }
//         })
//     })

// })

// describe("PUT /boats/:id", () => {
//     describe("given a valid boat id", () => {
//         const dataBoatId = [1, 2, 3];
//         test("should respond with a 200 status code", async () => {
//             for (const boatId of dataBoatId) {
//                 updateBoat.mockReset();
//                 updateBoat.mockImplementation(() => {
//                     return {
//                         boat: {
//                             id: boatId,
//                             language: "en",
//                             dark_mode: true,
//                             license: "MIT"
//                         }
//                 }})
//                 const response = await request(app).put(`/boats/${boatId}`).send({ language: "en", dark_mode: true, license: "MIT" });
//                 expect(updateBoat.mock.calls.length).toBe(1);
//                 expect(updateBoat.mock.calls[0][0]).toBe(boatId);
//                 expect(response.statusCode).toBe(200);
//                 expect(response.body).not.toBeNull();
//             }
//         })
//     })

//     describe("given an invalid boat id", () => {
//         const dataBoatId = ["0", "abc"];
//         test("should respond with a 404 status code", async () => {
//             for (const boatId of dataBoatId) {
//                 updateBoat.mockReset();
//                 const response = await request(app).put(`/boats/${boatId}`).send({ language: "en", dark_mode: true, license: "MIT" });
//                 expect(updateBoat.mock.calls.length).toBe(0);
//                 expect(response.statusCode).toBe(404);
//                 expect(response.body).not.toBeNull();
//             }
//         })
//     })

//     describe("given an boat id that does not exist", () => {
//         const dataBoatId = [2, 3, 4];
//         test("should respond with a 404 status code", async () => {
//             for (const boatId of dataBoatId) {
//                 updateBoat.mockReset();
//                 updateBoat.mockImplementation(() => {})
//                 const response = await request(app).put(`/boats/${boatId}`).send({ language: "en", dark_mode: true, license: "MIT" });
//                 expect(updateBoat.mock.calls.length).toBe(1);
//                 expect(response.statusCode).toBe(404);
//                 expect(response.body).not.toBeNull();
//             }
//         })
//     })
// })

// describe("DELETE /boats/:id", () => {
//     describe("given a valid boat id", () => {
//         const dataBoatId = [1, 2, 3];
//         test("should respond with a 200 status code", async () => {
//             for (const boatId of dataBoatId) {
//                 deleteBoat.mockReset();
//                 deleteBoat.mockImplementation(() => {
//                     return {
//                         boat: {
//                             id: boatId
//                         }
//                 }})
//                 const response = await request(app).delete(`/boats/${boatId}`);
//                 expect(deleteBoat.mock.calls.length).toBe(1);
//                 expect(deleteBoat.mock.calls[0][0]).toBe(boatId);
//                 expect(response.statusCode).toBe(200);
//                 expect(response.body).not.toBeNull();
//             }
//         })
//     })

//     describe("given an invalid boat id", () => {
//         const dataBoatId = ["0", "abc"];
//         test("should respond with a 404 status code", async () => {
//             for (const boatId of dataBoatId) {
//                 deleteBoat.mockReset();
//                 const response = await request(app).delete(`/boats/${boatId}`);
//                 expect(deleteBoat.mock.calls.length).toBe(0);
//                 expect(response.statusCode).toBe(404);
//                 expect(response.body).not.toBeNull();
//             }
//         })
//     })

//     describe("given an boat id that does not exist", () => {
//         const dataBoatId = [2, 3, 4];
//         test("should respond with a 404 status code", async () => {
//             for (const boatId of dataBoatId) {
//                 deleteBoat.mockReset();
//                 deleteBoat.mockImplementation(() => {})
//                 const response = await request(app).delete(`/boats/${boatId}`);
//                 expect(deleteBoat.mock.calls.length).toBe(1);
//                 expect(response.statusCode).toBe(404);
//                 expect(response.body).not.toBeNull();
//             }
//         })
//     })
// })
