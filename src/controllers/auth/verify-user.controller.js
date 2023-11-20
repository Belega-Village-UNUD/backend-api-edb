const { User, OTP } = require("../../models");
const bcrypt = require("bcrypt");
const { response } = require("../../utils/response.utils");
const { generateToken } = require("../../utils/token.utils");
const { verifyOTP } = require("../../configs/otp.config");

const verifyUser = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.user;
    console.log(email);

    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });

    if (!user) return response(res, 404, false, "User not found", null);

    const verified = await verifyOTP(user, otp);
    console.log("verified ", verified.success);
    if (!verified.success)
      return response(res, 400, verified.success, verified.message, null);

    await User.update({ is_verified: true }, { where: { id: user.id } });
    const token = generateToken(user);
    return response(res, 200, verified.success, verified.message, {
      token,
    });
  } catch (err) {
    console.log(err);
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = verifyUser;
