const { User, Store } = require("../../models");
const { response } = require("../../utils/response.utils");

const storeVerified = async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    return response(res, 404, false, "User not found", null);
  }

  const store = await Store.findOne({ where: { user_id: user.id } });
  if (!store) {
    return response(
      res,
      404,
      false,
      "Store not found, please register as a seller first!",
      null
    );
  }

  let isStoreVerified = store.is_verified === "VERIFIED" ? true : false;

  if (!isStoreVerified) {
    return response(
      res,
      403,
      false,
      "Store not verified, please wait until store verified by admin",
      null
    );
  }

  next();
};

module.exports = storeVerified;
