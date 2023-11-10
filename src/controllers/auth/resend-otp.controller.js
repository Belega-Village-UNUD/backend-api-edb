const { User } = require("../../models");
const { response } = require("../../utils/response.utils");
const { sendOTP } = require("../../configs/otp.config");

const resendOTP = async (req, res) => {
  try {
    const { email } = req.user || req.body;

    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });

    if (!user) return response(res, 404, false, "User not found", null);

    sendOTP(user, "Belega Commerce OTP Token");

    return response(
      res,
      200,
      true,
      "Please check your email for your OTP Request",
      null
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = resendOTP;
