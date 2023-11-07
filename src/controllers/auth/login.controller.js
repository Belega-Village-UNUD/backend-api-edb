const { User } = require("../../models");
const bcrypt = require("bcrypt");
const { response } = require("../../utils/response.utils");
const { generateToken } = require("../../utils/token.utils");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["id", "role_id"] },
    });

    if (!user)
      return response(
        res,
        404,
        false,
        "These credentials do not match with our records",
        null
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return response(
        res,
        404,
        false,
        "These credentials do not match with our records",
        null
      );

    const payload = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      is_verified: user.is_verified,
    };

    const token = generateToken(payload);

    return response(res, 200, true, "Login success", {
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = login;
