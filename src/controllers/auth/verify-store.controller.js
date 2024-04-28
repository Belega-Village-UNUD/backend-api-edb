const { response } = require("../../utils/response.utils");
const { Store, User } = require("../../models");
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
    });
    if (!store) return response(res, 404, false, "Store not found", null);

    await db.sequelize.query(
      `update "Stores" s set is_verified = 'VERIFIED' where s.user_id='${user_id}'`
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
