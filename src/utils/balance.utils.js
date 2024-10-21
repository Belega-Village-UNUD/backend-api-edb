const {
  DetailTransaction,
  StoreBalance,
  StoreBankAccount,
  Product,
} = require("../models");
const { getDetailTransaction } = require("../utils/orm.utils");
const { nanoid } = require("nanoid");

const getBalance = async (store_id) => {
  const [balance, created] = await StoreBalance.findOrCreate({
    where: { store_id },
    defaults: { id: nanoid(10), balance: 0 },
  });

  if (!balance) {
    return Error("Balance not succsefully created or fetched");
  }

  if (created) {
    await StoreBalance.update({ id: nanoid(10) }, { where: { store_id } });
  }

  const data = balance.balance;

  return data;
};

const updateBalance = async (transaction_id, store_id) => {
  let data = {
    success: false,
    message: null,
    arrival: null,
    detail: null,
    balance: null,
    newBalance: null,
  };

  const detailTransaction = await getDetailTransaction(transaction_id);

  const cartDetailsData = detailTransaction.carts_details.map((cart) => {
    if (cart.store_id === store_id) {
      return {
        ...cart,
      };
    }
  });

  const balance = await module.exports.getBalance(store_id);

  data.detail = cartDetailsData;
  data.balance = balance;

  const relevantCartDetail = data.detail.find(
    (item) => item && item.store_id === store_id
  );

  if (relevantCartDetail) {
    isArrived =
      relevantCartDetail.arrival_shipping_status === "ARRIVED" ? true : false;

    if (!isArrived) {
      data.arrival = relevantCartDetail.arrival_shipping_status;
      data.newBalance = data.balance;
      data.newBalance += relevantCartDetail.sub_total_cart_price;

      await StoreBalance.update(
        { balance: data.newBalance },
        { where: { store_id: store_id } }
      );

      data.success = true;
      data.message = "Product is has arrived";

      return data;
    }

    data = {
      success: false,
      message: "Product has arrived, cannot update status",
      arrival: null,
      detail: null,
      balance: null,
      newBalance: null,
    };
    return data;
  }

  return data;
};

module.exports = { updateBalance, getBalance };
