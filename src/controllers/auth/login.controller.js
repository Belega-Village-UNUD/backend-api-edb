const { User, Role, Store } = require("../../models");
const bcrypt = require("bcrypt");
const { response } = require("../../utils/response.utils");
const {
  generateToken,
  validateRequestBody,
} = require("../../utils/token.utils");
const { ROLE } = require("../../utils/enum.utils");

const login = async (req, res) => {
  try {
    validateRequestBody(req);
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user)
      return response(
        res,
        400,
        false,
        "These credentials do not match with our records",
        null
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response(
        res,
        401,
        false,
        "Password credentials do not match with our records",
        null
      );
    }

    const role = await Role.findOne({
      where: { id: user.role_id, name: ROLE.SELLER },
    });
    const is_store = role ? true : false;

    const store = await Store.findOne({
      where: { user_id: user.id },
    });
    const exist_store = store ? true : false;

    const payload = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      is_verified: user.is_verified,
      is_store,
      exist_store,
    };

    const token = generateToken(payload);

    return response(res, 200, true, "Login success", {
      payload,
      token,
    });
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = login;
