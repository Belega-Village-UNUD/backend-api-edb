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
    }
  }
  Payout.init(
    {
      store_id: DataTypes.STRING,
      store_bank_id: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
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