"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StoreBankAccount extends Model {
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
    }
  }
  StoreBankAccount.init(
    {
      store_id: DataTypes.STRING,
      bank_name: DataTypes.STRING,
      bank_code: DataTypes.STRING,
      account_number: DataTypes.STRING,
      account_name: DataTypes.STRING,
      display: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "StoreBankAccount",
    }
  );
  return StoreBankAccount;
};
