const { User } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("../../utils/response.utils");

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const token = req.query;
    console.log(token);

    const payload = jwt.verify(token.token, process.env.JWT_RESET_PASSWORD_KEY);
    const email = payload.email;

    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["email", "password", "role_id"] },
    });

    if (!user) return response(res, 404, false, "User not found", null);

    if (newPassword !== confirmNewPassword)
      return response(res, 400, false, "Password doesn't match", null);

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: encryptedPassword },
      { where: { id: user.id } }
    );

    return response(res, 200, true, "Sucessfully Reset Password", {
      user,
    });
  } catch (err) {
    console.log(err);
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = resetPassword;
