const register = require("./register.controller");
const login = require("./login.controller");
const changePassword = require("./change-password.controller");
const forgotPassword = require("./forgot-password.controller");
const resetPassword = require("./reset-password.controller");

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
