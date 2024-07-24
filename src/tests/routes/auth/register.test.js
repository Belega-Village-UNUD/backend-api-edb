//const request = require("supertest");
//const server = require("../../../app");
//const { User, Profile } = require("../../../models");

//describe("POST /api/auth/register", () => {
//  const userData = {
//    email: "test@example.com",
//    password: "thisisatestpassword",
//    confirmPassword: "thisisatestpassword",
//  };

//  test("should register a new user", async () => {
//    const response = await request(server)
//      .post("/api/auth/register")
//      .send(userData);

//    expect(response.statusCode).toBe(201);
//    expect(response.body.message).toBe(
//      "Register Succces, please check your email for verification"
//    );
//    expect(response.body.data).toHaveProperty("token");
//  });

//  test("should not register a user with an existing email", async () => {
//    // Create a user with the same email
//    await User.create({
//      email: userData.email,
//      password: userData.password,
//    });

//    const response = await request(server)
//      .post("/api/auth/register")
//      .send(userData);

//    expect(response.statusCode).toBe(400);
//    expect(response.body.message).toBe("Email already used");
//  });

//  test("should not register a user with mismatched passwords", async () => {
//    const response = await request(server)
//      .post("/api/auth/register")
//      .send({
//        ...userData,
//        confirmPassword: "mismatchedpassword",
//      });

//    expect(response.statusCode).toBe(400);
//    expect(response.body.message).toBe("Password doesn't match");
//  });
//});
