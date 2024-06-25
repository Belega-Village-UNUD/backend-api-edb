const { response } = require("../../utils/response.utils");
const { Fee, FeeHistory, Store, User, Role } = require("../../models");
const { nanoid } = require("nanoid");
const db = require("../../models");
const { ROLE } = require("../../utils/enum.utils");

const chargerFee = async (req, res) => {
  try {
    const { id } = req.user;
    const { store_id, fee_id, description } = req.body;

    const admin = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { id },
    });
    if (!admin) {
      return response(res, 404, false, `Admin not found`, null);
    }

    const admin_id = admin.id;

    const fee = await Fee.findOne({ where: { id: fee_id, display: true } });
    if (!fee) {
      return response(res, 404, false, `Fee Not Found`, null);
    }

    const store = await Store.findOne({ where: { id: store_id } });
    if (!store) {
      return response(res, 404, false, `Store Not Found`, null);
    }

    const feeHistory = await FeeHistory.create({
      id: nanoid(10),
      store_id,
      admin_id,
      fee_id,
      description,
    });

    const updatedFeeHistory = await FeeHistory.findOne({
      where: { id: feeHistory.id },
      attributes: { exclude: ["store_id", "admin_id", "fee_id"] },
      include: [
        {
          model: Store,
          as: "store",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "admin",
          attributes: ["id", "email"],
        },
        {
          model: Fee,
          as: "fee",
          attributes: ["id", "name", "interest"],
        },
      ],
    });

    return response(
      res,
      200,
      true,
      `Store ${store.name} has been charged`,
      updatedFeeHistory
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = chargerFee;
