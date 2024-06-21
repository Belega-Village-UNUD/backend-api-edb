const { response } = require("../../utils/response.utils");
const { Store, User, Role } = require("../../models");
const { ROLE } = require("../../utils/enum.utils");
const db = require("../../models");

const verifyStore = async (req, res) => {
  try {
    const { id } = req.user;
    const { user_id } = req.body;

    const admin = await User.findOne({
      where: { id },
    });
    if (!admin) return response(res, 404, false, "Admin not found", null);

    const store = await Store.findOne({
      where: { user_id: user_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "role_id", "is_verified"],
        },
      ],
    });

    if (!store) return response(res, 404, false, "Store not found", null);

    if (store.user.is_verified != true) {
      return response(
        res,
        404,
        false,
        "You must be verified to register a store",
        null
      );
    }

    if (store.is_verified !== "WAITING") {
      return response(
        res,
        400,
        false,
        "Only WAITING status store can be verified",
        null
      );
    }

    const isStoreVerified = store.is_verified == "VERIFIED" ? true : false;

    if (!isStoreVerified) {
      await Store.update(
        {
          unverified_reason: null,
          is_verified: "VERIFIED",
        },
        {
          where: { user_id: user_id },
        }
      );
    } else {
      throw {
        status: 400,
        message: "Store has been verified",
      };
    }

    const sellerRole = await Role.findOne({ where: { name: ROLE.SELLER } });

    if (!sellerRole) {
      return response(res, 404, false, "Role not found", null);
    }

    const existingRoles = store.user.role_id;
    const checkRoles = existingRoles.includes(sellerRole.id);
    let updatedRoles = existingRoles;

    if (!checkRoles) {
      updatedRoles = [...existingRoles, sellerRole.id];
    }

    await User.update(
      { role_id: updatedRoles },
      { where: { id: store.user.id } }
    );

    return response(
      res,
      200,
      true,
      `Successfully Verify Store ${store.name}`,
      null
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = verifyStore;
