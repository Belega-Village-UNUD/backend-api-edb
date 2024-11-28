"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.CancelledTransaction, {
        foreignKey: "transaction_id",
        as: "cancelled_transaction",
      });
      this.hasOne(models.DetailTransaction, {
        foreignKey: "transaction_id",
        as: "detail_transaction",
      });
      this.belongsTo(models.Cart, {
        foreignKey: "cart_id",
        as: "cart",
      });
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      this.hasOne(models.Review, {
        foreignKey: "transaction_id",
        as: "review",
      });
      this.hasMany(models.ProductRating, {
        foreignKey: "transaction_id",
        as: "product_rating",
      });
    }
  }
  Transaction.init(
    {
      user_id: DataTypes.STRING,
      cart_id: DataTypes.ARRAY(DataTypes.STRING),
      total_amount: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("total_amount");
          return value === null ? null : parseFloat(value);
        },
      },
      status: DataTypes.ENUM("PENDING", "PAYABLE", "SUCCESS", "CANCEL"),
      status_store: DataTypes.JSON,
      token: DataTypes.STRING,
      redirect_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
