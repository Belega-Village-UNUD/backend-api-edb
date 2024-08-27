const { RAJAONGKIRAPI_KEY, RAJAONGKIRAPI_URL } = require("./constan");
const { getDetailTransaction } = require("./orm.utils");
const { DetailTransaction } = require("../models");

const estimateCosts = async (data) => {
  const headerKey = new Headers();
  headerKey.append("key", RAJAONGKIRAPI_KEY);
  headerKey.append("Content-Type", "application/json");
  const url = `${RAJAONGKIRAPI_URL}/cost`;

  const payload = JSON.stringify({
    origin: data.detail.store.city.city_id,
    destination: data.user.userProfile.city.city_id,
    weight: data.totalAllCartWeight,
    courier: data.courier,
  });

  let belowMaxWeight = data.totalAllCartWeight > 30000 ? false : true;

  if (!belowMaxWeight) {
    throw new Error("Weight must be less than 30 kg");
  }

  const costsResponse = await fetch(url, {
    method: "POST",
    headers: headerKey,
    body: payload,
  });

  return new Promise((resolve, reject) => {
    costsResponse
      .json()
      .then((response) => {
        let estimation = {
          store_id: data.detail.store.id,
          carts: data.detail.carts,
          total_all_cart_weight: data.totalAllCartWeight,
          origin: response.rajaongkir.origin_details,
          destination: response.rajaongkir.destination_details,
          shipping: response.rajaongkir.results,
        };

        resolve(estimation);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const countTotalTransactionAfterShipping = (cartDetails) => {
  let subTotalShipping = 0;
  let totalFinalPrice = 0;

  for (const cartDetail of cartDetails) {
    console.log(
      `==57 shipping.utils.js countTotalTransactionAfterShipping cartDetail.cart_id: ${JSON.stringify(cartDetail.cart_id, null, 2)}\n`,
      `==58 shipping.utils.js countTotalTransactionAfterShipping cartDetail.store_id: ${JSON.stringify(cartDetail.store_id, null, 2)}\n`,
      `==59 shipping.utils.js countTotalTransactionAfterShipping cartDetail.sub_total_cart_price: ${JSON.stringify(cartDetail.sub_total_cart_price, null, 2)}\n`,
      `==60 shipping.utils.js countTotalTransactionAfterShipping cartDetail.shipping: ${JSON.stringify(cartDetail.shipping, null, 2)}\n`,
    );
  }
  // for (const cartDetailArray of cartDetails) {
  //   for (const cartDetail of cartDetailArray) {
  //     subTotalShipping += cartDetail.shipping.costs;
  //     totalFinalPrice += cartDetail.sub_total_cart_price_with_shipping;
  //   }
  // }
  // return { subTotalShipping, totalFinalPrice };
  return null;
};

const cartDetailsWithShippingCost = async (
  user,
  transactionData,
  shipping_name,
  shipping_cost_index,
) => {
  let cartDetails = [];

  await Promise.all(
    transactionData.map(async (detail, iteration) => {
      let carts = detail.carts;
      let totalAllCartWeight = 0;

      for (
        let innerIteration = 0;
        innerIteration < carts.length;
        innerIteration++
      ) {
        let cart = carts[innerIteration];
        totalAllCartWeight += cart.total_weight_gr;

        const data = {
          detail,
          totalAllCartWeight,
          user,
          courier: shipping_name[iteration],
        };

        let estimation = await estimateCosts(data);

        cartDetails.push({
          cart_id: cart.id,
          product_id: cart.product_id,
          store_id: cart.product.store.id,
          qty: cart.qty,
          unit_price: cart.price,
          sub_total_cart_price: cart.qty * cart.price,
          arrival_shipping_status: "PACKING",
          shipping: {
            code: estimation.shipping[0].code,
            costs:
              estimation.shipping[0].costs[shipping_cost_index[iteration]]
                .cost[0].value,
            estimation:
              estimation.shipping[0].costs[shipping_cost_index[iteration]]
                .cost[0].etd,
            service:
              estimation.shipping[0].costs[shipping_cost_index[iteration]]
                .service,
            description:
              estimation.shipping[0].costs[shipping_cost_index[iteration]]
                .description,
          },
          sub_total_cart_price_with_shipping:
            cart.qty * cart.price +
            estimation.shipping[0].costs[shipping_cost_index[iteration]].cost[0]
              .value,
        });
      }
    }),
  );

  return cartDetails;
};

const changeShippingStatus = async (product_id, transaction_id, status) => {
  try {
    const detailTransaction = await getDetailTransaction(transaction_id);
    const cartDetailsData = detailTransaction.carts_details.map((cart) => {
      if (cart.arrival_shipping_status === "PACKING") {
        if (status !== "SHIPPED") {
          return { msg: "Your product has not shipped yet" };
        }
      } else if (cart.arrival_shipping_status === "SHIPPED") {
        if (status !== "ARRIVED") {
          return { msg: "Your product is on shipment" };
        }
      } else {
        return { msg: "Invalid status" };
      }
      if (cart.product_id === product_id) {
        return {
          ...cart,
          arrival_shipping_status: status,
        };
      }
      return cart;
    });

    if (cartDetailsData.some((cart) => cart.msg)) {
      const message = cartDetailsData.find((cart) => cart.msg).msg;
      const data = {
        success: false,
        message,
      };
      return data;
    }

    detailTransaction.carts_details = cartDetailsData;
    detailTransaction.save();

    const data = {
      success: true,
      cartDetailsData,
      detailTransaction,
    };

    return data;
  } catch (error) {
    return error;
  }
};

module.exports = {
  estimateCosts,
  countTotalTransactionAfterShipping,
  cartDetailsWithShippingCost,
  changeShippingStatus,
};
