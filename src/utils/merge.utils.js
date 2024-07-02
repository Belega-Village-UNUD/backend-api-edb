module.exports = {
  mergeTransactionData: (carts) => {
    const stores = {};
    carts.forEach((cartItem) => {
      // break the loop if there's no product
      if (!cartItem.product) {
        return;
      }

      // If the store doesn't exist in the object yet, create it
      if (!stores[cartItem.product.store.id]) {
        stores[cartItem.product.store.id] = {
          store: {
            id: cartItem.product.store.id,
            name: cartItem.product.store.name,
            phone: cartItem.product.store.phone,
            address: cartItem.product.store.address,
            description: cartItem.product.store.description,
            province: cartItem.product.store.province,
            city: cartItem.product.store.city,
          },
          carts: [],
        };
      }
      // Add the product to the store's products array
      stores[cartItem.product.store.id].carts.push({
        id: cartItem.id,
        qty: cartItem.qty,
        product_id: cartItem.product.id,
        product: cartItem.product,
        image_product: cartItem.product.image_product,
        name_product: cartItem.product.name_product,
        price: cartItem.product.price,
        stock: cartItem.product.stock,
        product_weight_gr: cartItem.product.weight_gr,
        total_weight_gr: cartItem.qty * cartItem.product.weight_gr,
        desc_product: cartItem.product.desc_product,
        is_checkout: cartItem.is_checkout,
        type_id: cartItem.product.type_id,
      });
    });

    const transactionsData = Object.values(stores);
    return transactionsData;
  },

  mergeProduct: (products) => {
    const mergeProducts = products.reduce((acc, product) => {
      const existingProduct = acc.find(
        (p) => p.product_id === product.product_id
      );

      if (existingProduct) {
        existingProduct.total_product_sold += product.total_product_sold;
      } else {
        acc.push(product);
      }

      return acc;
    }, []);

    return mergeProducts;
  },
};
