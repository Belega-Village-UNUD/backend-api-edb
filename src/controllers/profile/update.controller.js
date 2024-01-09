const { User, Profile } = require("../../models");
const { response } = require("../../utils/response.utils");

const updateUser = async (req, res) => {
  try {
    const { email } = req.user;
    const { name, phone, address, description } = req.body;

    if (!name || !phone || !address || !description) {
      return response(res, 400, false, "All fields are required", null);
    }

    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ["password"] },
    });

    await Profile.update(
      { name, phone, address, description },
      { where: { user_id: user.id } }
    );
    const profile = await Profile.findOne({ where: { user_id: user.id } });

    const payload = {
      user,
      profile,
    };
    return response(res, 200, true, "Successfully update profile", payload);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = updateUser;