const { User } = require("../../models");
const { response } = require("../../utils/response.utils");
const { sendOTP } = require("../../configs/otp.config");
const jwt = require("jsonwebtoken");

const resendOTP = async (req, res) => {
  try {
    let user = null;
    let email = null;

    const header = req.headers["authorization"];
    if (header) {
      const token = header.split(" ")[1];
      if (!token) {
        return response(
          res,
          401,
          false,
          "You are not authorized wrong token",
          null
        );
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      email = payload.email;
    } else {
      email = req.body.email;
    }

    user = await User.findOne({
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
