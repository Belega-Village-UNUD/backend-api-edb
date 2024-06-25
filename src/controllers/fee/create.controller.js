const { response } = require("../../utils/response.utils");
const { Fee, User } = require("../../models");
const { nanoid } = require("nanoid");

const createFee = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    const { name, interest, description } = req.body;

    const fee = await Fee.create({
      id: nanoid(10),
      name: name,
      interest: interest,
      description: description,
    });
    return response(res, 200, true, `Fee ${fee.name} has been created`, fee);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = createFee;
