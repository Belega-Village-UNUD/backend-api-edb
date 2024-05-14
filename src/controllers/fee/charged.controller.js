const { response } = require("../../utils/response.utils");
const { Fee, FeeHistory, Store, User } = require("../../models");
const { nanoid } = require("nanoid");
const db = require("../../models");

const chargerFee = async (req, res) => {
  try {
    const { id } = req.user;
    const { store_id, fee_id, description } = req.body;

    const admin = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      return response(res, 404, false, `You are not an admin.`, null);
    }

    const admin_id = admin.id;

    const fee = await Fee.findOne({ where: { id: fee_id } });
    const fee_name = fee.name;
    if (!fee) {
      return response(res, 404, false, `Fee ${fee_name} Not Found`, null);
    }

    const store = await Store.findOne({ where: { id: store_id } });

    if (!store) {
      return response(res, 404, false, `Store Not Found`, null);
    }

    const feeHistory = await FeeHistory.create({
      id: nanoid(10),
      seller_id: store_id, //TODO: should be store.user_id
      admin_id,
      fee_id,
      description,
    });

    await db.sequelize.query(
      `update "Stores" s set is_verified = 'FEE' where s.id='${store_id}'`
    );

    return response(res, 200, true, `Seller has been charged`, feeHistory);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = chargerFee;
