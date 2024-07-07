"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PayoutHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "admin_id",
        as: "admin",
      });
      this.belongsTo(models.Payout, {
        foreignKey: "payout_id",
        as: "payout",
      });
    }
  }
  PayoutHistory.init(
    {
      admin_id: DataTypes.STRING,
      payout_id: DataTypes.STRING,
      payment_proof: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PayoutHistory",
    }
  );
  return PayoutHistory;
};
