"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductRating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        as: "transaction",
      });
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      this.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "store",
      });
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  ProductRating.init(
    {
      transaction_id: DataTypes.STRING,
      product_id: DataTypes.STRING,
      store_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      rate: DataTypes.INTEGER,
      review: DataTypes.TEXT,
      display: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ProductRating",
    }
  );
  return ProductRating;
};
