const { User, Store } = require("../../models");
const { response } = require("../../utils/response.utils");

const buyerVerified = async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    return response(res, 404, false, "User not found", null);
  }

  let isUserVerified = user.is_verified === true ? true : false;

  if (!isUserVerified) {
    return response(
      res,
      403,
      false,
      "User not verified, please verify your email first",
      null
    );
  }

  next();
};

module.exports = buyerVerified;
