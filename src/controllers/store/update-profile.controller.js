const { response } = require("../../utils/response.utils");
const { Store, User } = require("../../models");

const updateProfileStore = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, address, description } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return response(res, 404, false, "User not found", null);
    }
    const store = await Store.findOne({ where: { user_id: user.id } });
    if (!store) {
      return response(res, 404, false, "Store not found", null);
    }

    await Store.update(
      { name, address, description },
      { where: { user_id: user.id } }
    );

    const updatedStore = await Store.findOne({
      where: { user_id: user.id },
      attributes: ["id", "name", "address", "description"],
    });

    return response(
      res,
      200,
      true,
      `Successfully Update Store Profile ${store.name} `,
      updatedStore
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = updateProfileStore;
