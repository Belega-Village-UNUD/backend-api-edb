const { response } = require("../../utils/response.utils");
const { Store, User, Profile } = require("../../models");

const getProfileStore = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return response(res, 404, false, "User not found", null);
    }
    const store = await Store.findOne({
      where: { user_id: user.id },
      attributes: {
        exclude: [
          "user_id",
          "ktp_link",
          "is_verified",
          "unverified_reason",
          "createdAt",
          "updatedAt",
        ],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "id",
              "is_verified",
              "password",
              "role_id",
              "store_id",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });
    if (!store) {
      return response(res, 404, false, "Store not found", null);
    }

    return response(
      res,
      200,
      true,
      `Successfully get store profile ${store.name}`,
      store
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getProfileStore;
