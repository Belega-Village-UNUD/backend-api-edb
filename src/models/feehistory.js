"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FeeHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Fee, {
        foreignKey: "fee_id",
        as: "fee",
      });
      this.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "store",
      });
      this.belongsTo(models.User, {
        foreignKey: "admin_id",
        as: "admin",
      });
    }
  }
  FeeHistory.init(
    {
      store_id: DataTypes.STRING,
      admin_id: DataTypes.STRING,
      fee_id: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "FeeHistory",
    }
  );
  return FeeHistory;
};
