const { ROLE } = require("../../utils/enum.utils");
const { User, Role } = require("../../models");
const { response } = require("../../utils/response.utils");
const { generateToken } = require("../../utils/token.utils");
const { Op } = require("sequelize");

const adminLogin = async (req, res, next) => {
  try {
    const { email } = req.body;

    const admin = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { email },
    });
    if (!admin) {
      return response(res, 404, false, "User not found", null);
    }

    const roleAdmin = await Role.findOne({
      where: {
        id: admin.role_id,
        name: {
          [Op.or]: [ROLE.ADMIN],
        },
      },
    });
    if (!roleAdmin) {
      return response(res, 403, false, "You are not admin", null);
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      role_id: admin.role_id,
    };
    const token = generateToken(payload);
    return response(res, 200, true, "Login success", {
      payload,
      token,
    });

    next();
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = adminLogin;
