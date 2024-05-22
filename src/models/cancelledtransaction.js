"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CancelledTransaction extends Model {
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
    }
  }
  CancelledTransaction.init(
    {
      transaction_id: DataTypes.STRING,
      sum_product: DataTypes.INTEGER,
      total_price: DataTypes.DECIMAL,
      reason: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "CancelledTransaction",
    }
  );
  return CancelledTransaction;
};
