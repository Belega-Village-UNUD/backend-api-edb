const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: (user) => {
    const payload = { id: user.id, email: user.email, role: user.role_id };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  },

  generateResetToken: (user) => {
    const payload = { email: user.email };
    return jwt.sign(payload, process.env.JWT_RESET_PASSWORD_KEY, {
      expiresIn: process.env.JWT_RESET_EXPIRES,
    });
  },
};
