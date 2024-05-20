const register = require("./register.controller");
const login = require("./login.controller");
const changePassword = require("./change-password.controller");
const forgotPassword = require("./forgot-password.controller");
const resetPassword = require("./reset-password.controller");
const verifyUser = require("./verify-user.controller");
const resendOTP = require("./resend-otp.controller");
const getOTP = require("./get-otp.controller");
const registerStore = require("./register-store.controller");
const verifyStore = require("./verify-store.controller");
const declinedStore = require("./declined-store.controller");
const allStore = require("./get-all-store.controller");
const oneStore = require("./get-one-store.controller");

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyUser,
  resendOTP,
  getOTP,
  registerStore,
  verifyStore,
  declinedStore,
  allStore,
  oneStore,
};
