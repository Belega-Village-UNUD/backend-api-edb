const { User, Store, Role } = require("../../models");
const { response } = require("../../utils/response.utils");
const { nanoid } = require("nanoid");
const { singleUpload } = require("../../utils/imagekit.utils");
const { ROLE } = require("../../utils/enum.utils");

const registerStore = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, phone, address, description } = req.body;

    if (!name || !phone || !address || !description) {
      return response(res, 400, false, "Invalid input data", null);
    }

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    const sellerRole = await Role.findOne({ where: { name: ROLE.SELLER } });

    if (!sellerRole) {
      return response(res, 404, false, "Role not found", null);
    }

    const existingRoles = userExist.role_id || [];
    const updatedRoles = [...existingRoles, sellerRole.id];

    await User.update({ role_id: updatedRoles }, { where: { id: id } });

    const ktp_link = await singleUpload(req, res);

    if (!ktp_link) {
      return response(res, 400, false, "File upload failed", null);
    }

    const storeExist = await Store.findOne({ where: { name } });
    if (storeExist) {
      return response(res, 400, false, "Store name already used", null);
    }

    const store = await Store.create({
      id: nanoid(10),
      user_id: userExist.id,
      avatar_link: null,
      image_link: null,
      ktp_link: ktp_link.url,
      name,
      phone,
      address,
      description,
      unverified_reason: null,
      is_verified: "WAITING",
    });

    return response(
      res,
      200,
      true,
      "Register Store Success, please wait for your store verification",
      { store }
    );
  } catch (err) {
    console.error(err);
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = registerStore;
