//const request = require("supertest");
//const server = require("../../../app");

//describe("POST /api/auth/login", () => {
//  test("should login with correct credentials", async () => {
//    const response = await request(server).post("/api/auth/login").send({
//      email: "test@example.com",
//      password: "thisisatestemail",
//    });

//    expect(response.statusCode).toBe(200);
//    expect(response.body.message).toBe("Login success");
//    expect(response.body.data).toHaveProperty("token");
//  });

//  test("should not login with incorrect credentials", async () => {
//    const response = await request(server).post("/api/auth/login").send({
//      email: "test@example.com",
//      password: "thisisatestemail!!!",
//    });

//    expect(response.statusCode).toBe(400);
//    expect(response.body.message).toBe(
//      "These credentials do not match with our records"
//    );
//  });
//});
