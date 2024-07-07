"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StoreBalance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
  StoreBalance.init(
    {
      store_id: DataTypes.STRING,
      store_bank_id: DataTypes.STRING,
      balance: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("balance");
          return value === null ? null : parseFloat(value);
        },
      },
    },
    {
      sequelize,
      modelName: "StoreBalance",
    }
  );
  return StoreBalance;
};
