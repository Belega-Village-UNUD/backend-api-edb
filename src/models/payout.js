"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "store",
      });
      this.belongsTo(models.StoreBankAccount, {
        foreignKey: "store_bank_id",
        as: "store_bank",
      });
      this.hasOne(models.PayoutHistory, {
        foreignKey: "payout_id",
        as: "payout_history",
      });
    }
  }
  Payout.init(
    {
      store_id: DataTypes.STRING,
      store_bank_id: DataTypes.STRING,
      amount: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("amount");
          return value === null ? null : parseFloat(value);
        },
      },
      status: DataTypes.ENUM("PENDING", "ONGOING", "SUCCESS"),
      payout_proof: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payout",
    }
  );
  return Payout;
};
