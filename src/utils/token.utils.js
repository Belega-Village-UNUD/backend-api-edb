const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports = {
  generateToken: (user) => {
    const payload = { id: user.id, email: user.email, role: user.role_id };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  },

  generateOTPToken: async (user) => {
    const otp = crypto
      .randomBytes(256)
      .toString("hex")
      .slice(0, 4)
      .toUpperCase();
    const encryptedOTP = bcrypt.hashSync(otp, 10);
    return { otp, encryptedOTP };
  },

  validateRequestBody: (req) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Request body cannot be empty");
    }
  },
};
