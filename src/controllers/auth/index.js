const register = require("./register.controller");
const login = require("./login.controller");
const changePassword = require("./change-password.controller");
const forgotPassword = require("./forgot-password.controller");
const resetPassword = require("./reset-password.controller");
const verifyUser = require("./verify-user.controller");
const resendOTP = require("./resend-otp.controller");

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyUser,
  resendOTP,
};
