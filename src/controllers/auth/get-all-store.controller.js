const { response } = require("../../utils/response.utils");
const { User, Store } = require("../../models");

const getAllStore = async (req, res) => {
  try {
    const { id } = req.user;

    const admin = await User.findOne({
      where: { id },
    });
    if (!admin) return response(res, 404, false, "Admin not found", null);

    const stores = await Store.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "email", "is_verified"] },
      ],
    });

    return response(res, 200, true, `Get All Store Successfull`, stores);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getAllStore;
