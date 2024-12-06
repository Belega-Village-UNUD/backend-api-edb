const { User } = require("../../models");
const bcrypt = require("bcrypt");
const { response } = require("../../utils/response.utils");
const { validateRequestBody } = require("../../utils/token.utils");

const changePassword = async (req, res) => {
  try {
    validateRequestBody(req);
    const { email } = req.user;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) return response(res, 404, false, "User not found", null);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return response(
        res,
        400,
        false,
        "Your current password doesn't match with the one you've registered",
        null
      );

    if (newPassword !== confirmNewPassword)
      return response(res, 400, false, "Password doesn't match", null);

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: encryptedPassword },
      { where: { id: user.id } }
    );

    return response(res, 200, true, "Change password success", {
      email,
    });
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = changePassword;
