const { User } = require("../../models");
const { response } = require("../../utils/response.utils");
const { sendOTP } = require("../../configs/otp.config");
const { generateToken } = require("../../utils/token.utils");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    console.log(user);
    if (!user)
      return response(
        res,
        404,
        false,
        "These credentials do not match with our records",
        null
      );

    const token = await generateToken(user);

    await sendOTP(user, "Belega Commerce Forgot Password OTP Token");

    return response(
      res,
      200,
      true,
      "Please check your email to reset your forgotten password",
      token
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = forgotPassword;
