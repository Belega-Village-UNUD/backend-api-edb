const { User, OTP } = require("../../models");
const { response } = require("../../utils/response.utils");
const jwt = require("jsonwebtoken");

const getOTP = async (req, res) => {
  try {
    const { email } = req.user;

    user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });

    if (!user) return response(res, 404, false, "User not found", null);

    timestamp = await OTP.findOne({
      where: { user_id: user.id },
      attributes: ["createdAt"],
      order: [["createdAt", "DESC"]],
    });

    return response(res, 200, true, "This is the OTP timestamp", timestamp);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getOTP;
