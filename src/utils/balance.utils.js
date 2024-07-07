const {
  DetailTransaction,
  StoreBalance,
  StoreBankAccount,
  Product,
} = require("../models");
const { getDetailTransaction } = require("../utils/orm.utils");
const { nanoid } = require("nanoid");

const getBalance = async (store_id) => {
  const bank = await StoreBankAccount.findOne({
    where: { store_id, display: true },
  });

  if (!bank) {
    return { success: false, message: "Bank Account should be available" };
  }

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

const updateBalance = async (transaction_id, product_id) => {
  const product = await Product.findOne({
    where: { id: product_id },
  });

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
    if (cart.product_id === product_id) {
      return {
        ...cart,
      };
    }
  });

  const balance = await module.exports.getBalance(product.store_id);

  data.detail = cartDetailsData;
  data.balance = balance;

  isArrived = data.arrival === "ARRIVED" ? true : false;

  if (!isArrived) {
    data.detail.forEach((element) => {
      data.arrival = element.arrival_shipping_status;
      data.newBalance = data.balance;
      data.newBalance += element.sub_total_cart_price;
    });

    await StoreBalance.update(
      { balance: data.newBalance },
      { where: { store_id: product.store_id } }
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
};

module.exports = { updateBalance, getBalance };
