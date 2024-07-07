const { response } = require("../../utils/response.utils");
const { Payout, PayoutHistory, StoreBalance } = require("../../models");
const { getUser } = require("../../utils/orm.utils");
const { singleUpload } = require("../../utils/imagekit.utils");
const { nanoid } = require("nanoid");

const proofPayout = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await getUser(id);
    if (!user) return response(res, 404, false, "Admin not found", null);

    const { payout_id } = req.body;
    if (!req.body)
      return response(res, 400, false, "Request body is empty", null);

    const payout = await Payout.findOne({ where: { id: payout_id } });
    if (!payout)
      return response(res, 404, false, "Payout request not found", null);

    const storeBalance = await StoreBalance.findOne({
      where: { store_id: payout.store_id },
    });
    if (!storeBalance) {
      return response(res, 404, false, "Store balance not found", null);
    }

    if (payout.status !== "ONGOING") {
      return response(
        res,
        400,
        false,
        "Payout request has already been processed",
        null
      );
    }

    const proof = await singleUpload(req, res);
    if (!proof.success) {
      return response(res, 500, false, "Failed to upload proof", null);
    }

    const createdProof = await PayoutHistory.create({
      id: nanoid(10),
      admin_id: user.id,
      payout_id: payout.id,
      payment_proof: proof.url,
    });
    if (!createdProof) {
      return response(res, 500, false, "Failed to proof payout", null);
    }

    const balanceReduction = storeBalance.balance - payout.amount;
    if (balanceReduction < 0) {
      return response(res, 400, false, "Insufficient store balance", null);
    }

    const updatedBalance = await StoreBalance.update(
      { balance: balanceReduction },
      { where: { store_id: payout.store_id } }
    );
    if (!updatedBalance) {
      return response(
        res,
        500,
        false,
        "Failed to reduction store balance",
        null
      );
    }

    const updatePayout = await Payout.update(
      { status: "SUCCESS" },
      { where: { id: payout_id } }
    );
    if (!updatePayout) {
      return response(
        res,
        500,
        false,
        "Failed to confirm payout request",
        null
      );
    }

    const updatedPayoutHistory = await PayoutHistory.findOne({
      where: { payout_id },
      attributes: ["id", "admin_id", "payment_proof", "createdAt"],
      include: [
        {
          model: Payout,
          as: "payout",
        },
      ],
    });

    return response(
      res,
      200,
      true,
      "Payout request confirmed",
      updatedPayoutHistory
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = proofPayout;
