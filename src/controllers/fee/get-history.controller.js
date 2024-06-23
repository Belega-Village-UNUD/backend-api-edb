const { response } = require("../../utils/response.utils");
const { FeeHistory, Fee, Store, User } = require("../../models");

const getHistory = async (req, res) => {
  try {
    const { fee_history_id, store_id } = req.query;

    if (!fee_history_id && !store_id) {
      const feeHistory = await FeeHistory.findAll();
      if (!feeHistory)
        return response(res, 404, false, "Fee History Not Found", null);

      if (feeHistory.length === 0)
        return response(res, 404, false, "Fee History is Empty", null);

      return response(
        res,
        200,
        true,
        "Get All Fee History Successful",
        feeHistory
      );
    }

    if (!store_id) {
      const feeHistory = await FeeHistory.findOne({
        include: [
          {
            model: Store,
            as: "store",
            attributes: ["name"],
          },
          {
            model: User,
            as: "admin",
            attributes: ["email"],
          },
          {
            model: Fee,
            as: "fee",
            attributes: ["name", "interest", "description"],
          },
        ],
        attributes: ["id", "description", "createdAt", "updatedAt"],
        where: { id: fee_history_id },
      });

      if (!feeHistory) {
        return response(res, 404, false, `Fee History  Not Found`, null);
      }

      return response(
        res,
        200,
        true,
        `Get Fee History ${feeHistory.store.name} Successfull`,
        feeHistory
      );
    }

    const store = await Store.findOne({ where: { id: store_id } });
    if (!store) {
      return response(res, 404, false, `Store Not Found`, null);
    }

    const feeHistory = await FeeHistory.findOne({
      include: [
        {
          model: Store,
          as: "store",
          attributes: ["name"],
        },
        {
          model: User,
          as: "admin",
          attributes: ["email"],
        },
        {
          model: Fee,
          as: "fee",
          attributes: ["name", "interest", "description"],
        },
      ],
      attributes: ["id", "description", "createdAt", "updatedAt"],
      where: { id: fee_history_id, "$store.id$": store.id },
    });

    if (!feeHistory) {
      return response(
        res,
        404,
        false,
        `Fee History ${store.name} Not Found`,
        null
      );
    }

    return response(
      res,
      200,
      true,
      `Get Fee History ${feeHistory.store.name} Successfull`,
      feeHistory
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getHistory;
