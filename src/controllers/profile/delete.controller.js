const { User, Profile, OTP } = require("../../models");
const { response } = require("../../utils/response.utils");

const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return response(res, 404, false, "User not found", null);
    const profile = await Profile.findOne({ where: { user_id: user.id } });
    if (!profile) return response(res, 404, false, "Profile not found", null);
    const otp = await OTP.findOne({ where: { user_id: user.id } });

    if (otp) await otp.destroy();
    await profile.destroy();
    await user.destroy();

    return response(res, 200, true, "User deleted", null);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = deleteUser;
