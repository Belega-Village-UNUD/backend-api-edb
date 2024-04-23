const { response } = require("../../utils/response.utils");
const { Fee, FeeHistory, Store, User } = require("../../models");
const { nanoid } = require("nanoid");

const chargerFee = async (req, res) => {
  try {
    // const { admin_id } = req.user; // this should be the admin id
    const { seller_id, admin_id, fee_id, description } = req.body;

    const fee = await Fee.findOne({ where: { id: fee_id } });
    if (!fee) {
      return response(res, 404, false, `Fee ${fee_id} Not Found`, null);
    }

    const store = await Store.findOne({ where: { id: seller_id } });
    if (!store) {
      return response(res, 404, false, `Store ${seller_id} Not Found`, null);
    }

    const admin = await User.findOne({
      where: { id: admin_id },
      attributes: { exclude: ["password"] },
    });
    if (!admin) {
      return response(res, 404, false, `Admin ${admin_id} Not Found`, null);
    }

    const feeHistory = await FeeHistory.create({
      id: nanoid(10),
      seller_id,
      admin_id,
      fee_id,
      description,
    });

    return response(
      res,
      200,
      true,
      `Seller ${seller_id} has been charged`,
      feeHistory
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = chargerFee;
