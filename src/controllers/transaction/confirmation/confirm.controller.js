const { User, Transaction, Store } = require("../../../models");
const { response } = require("../../../utils/response.utils");

const confirm = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { id } = req.user;

    const storeUser = await Store.findOne({
      attributes: ["id", "user_id"],
      where: { user_id: id },
    });

    if (!storeUser) {
      return response(
        res,
        404,
        false,
        "You are not a store for this transaction",
        null
      );
    }

    let transaction = await Transaction.findOne({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      where: { id: transactionId },
    });

    if (!transaction) {
      return response(
        res,
        404,
        false,
        "Transaction not found because you are not the seller of this transaction",
        null
      );
    }

    if (transaction.status !== "PENDING") {
      return response(
        res,
        400,
        false,
        "Only pending transactions can be confirmed",
        null
      );
    }

    let statusStore = transaction.status_store || [];
    const pendingStores = statusStore.filter(
      (store) => store.status_store === "pending"
    );
    const lastPendingStore = pendingStores[pendingStores.length - 1];
    const storeIndex = statusStore.findIndex(
      (store) => store.store_id === storeUser.id
    );
    if (storeIndex === -1) {
      return response(res, 404, false, "Store not found in transaction", null);
    }

    if (lastPendingStore && lastPendingStore.store_id === storeUser.id) {
      const isLastPendingStore = lastPendingStore.store_id === storeUser.id;
      if (isLastPendingStore) {
        transaction.status = "PAYABLE";
      }
    }

    statusStore[storeIndex] = {
      ...statusStore[storeIndex],
      status_store: "confirm",
    };

    let transactionData = transaction.toJSON();
    transactionData.status_store = statusStore;
    transactionData.status = transaction.status;

    await Transaction.update(transactionData, {
      where: { id: transactionId },
    });

    return response(res, 200, true, "Transaction confirmed", null);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = confirm;
