const { response } = require("../../utils/response.utils");
const { Store, User } = require("../../models");
const db = require("../../models");

const declinedStore = async (req, res) => {
  try {
    const { id } = req.user;
    const { user_id, unverified_reason } = req.body;

    const admin = await User.findOne({
      where: { id },
    });
    if (!admin) return response(res, 404, false, "Admin not found", null);

    const store = await Store.findOne({
      where: { user_id: user_id },
    });
    if (!store) return response(res, 404, false, "Store not found", null);

    await Store.update(
      { is_verified: "DECLINED", unverified_reason },
      { where: { user_id } }
    );

    return response(
      res,
      200,
      true,
      `sorry you were refused to create a shop ${store.name} because ${unverified_reason}`,
      null
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = declinedStore;
