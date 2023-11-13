const { User, Profile } = require("../../models");
const { response } = require("../../utils/response.utils");

const whoami = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ["password"] },
    });
    const profile = await Profile.findOne({ where: { user_id: user.id } });
    const payload = {
      user,
      profile,
    };
    return response(res, 200, true, "Successfully get profile", payload);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = whoami;
