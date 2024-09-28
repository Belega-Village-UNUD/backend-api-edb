const { RAJAONGKIRAPI_KEY, RAJAONGKIRAPI_URL } = require("./constan");
const { getDetailTransaction } = require("./orm.utils");

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
  let totalCartPrice = 0;

  for (const detail of cartDetails) {
    const carts = detail.carts;
    subTotalShipping += detail.shipping.costs;

    for (const cart of carts) {
      totalCartPrice += cart.qty * cart.product.price;
    }
  }

  totalFinalPrice = totalCartPrice + subTotalShipping;
  return {
    subTotalShipping,
    totalFinalPrice,
    totalCartPrice,
  };
};

const calculateTotalWeightPerStore = async (carts) => {
  return carts.map((cartData) => {
    const carts = cartData.carts;
    let totalWeight = 0;
    carts.forEach((cart) => {
      totalWeight += cart.total_weight_gr;
    });

    return {
      store_id: cartData.store.id,
      store_name: cartData.store.name,
      total_weight: totalWeight,
    };
  });
};

const cartDetailsWithShippingCost = async (
  user,
  transactionData,
  shipping_name,
  shipping_cost_index
) => {
  let estimation = [];

  const totalWeightPerStore = await calculateTotalWeightPerStore(
    transactionData
  );

  await Promise.all(
    transactionData.map(async (detail, iteration) => {
      let carts = detail.carts;
      const data = {
        detail,
        totalAllCartWeight: totalWeightPerStore[iteration].total_weight,
        user,
        courier: shipping_name[iteration],
      };
      estimation.push(await estimateCosts(data));
    })
  );

  const cartDetails = estimation.map((item, iteration) => {
    const arrival_shipping_status = "PACKING";
    const shipping = {
      code: item.shipping[0].code,
      costs:
        item.shipping[0].costs[shipping_cost_index[iteration]].cost[0].value,
      estimation:
        item.shipping[0].costs[shipping_cost_index[iteration]].cost[0].etd,
      service: item.shipping[0].costs[shipping_cost_index[iteration]].service,
      description:
        item.shipping[0].costs[shipping_cost_index[iteration]].description,
    };
    return {
      ...item,
      arrival_shipping_status,
      shipping: shipping,
    };
  });

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
