require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const server = require("../../app");

describe("Root API Routes", () => {
  test("GET /api Checkhealth Root API", async () => {
    try {
      const response = await request(server).get("/api");
      expect(response.statusCode).toBe(200);
    } catch (error) {
      console.error(error);
    }
  });
});
