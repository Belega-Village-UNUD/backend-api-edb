"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "products",
      });
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users",
      });
    }
  }
  Cart.init(
    {
      user_id: DataTypes.STRING,
      product_id: DataTypes.STRING,
      qty: DataTypes.INTEGER,
      unit_price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
