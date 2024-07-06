"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        foreignKeyConstraint: true,
      });
      this.hasMany(models.Product, {
        foreignKey: "store_id",
        as: "store",
      });
      this.hasMany(models.StoreBankAccount, {
        foreignKey: "store_id",
        as: "store_bank_account",
      });
      this.hasMany(models.FeeHistory, {
        foreignKey: "store_id",
        as: "fee_history",
      });
      this.hasMany(models.Payout, {
        foreignKey: "store_id",
        as: "payout_request",
      });
      this.hasOne(models.StoreBalance, {
        foreignKey: "store_id",
        as: "store_balance",
      });
    }
  }
  Store.init(
    {
      user_id: DataTypes.STRING,
      avatar_link: DataTypes.STRING,
      image_link: DataTypes.STRING,
      ktp_link: DataTypes.STRING,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      province: DataTypes.JSON,
      city: DataTypes.JSON,
      description: DataTypes.TEXT,
      is_verified: DataTypes.ENUM("WAITING", "FEE", "VERIFIED", "DECLINED"),
      unverified_reason: DataTypes.TEXT,
      is_verified: DataTypes.ENUM("WAITING", "FEE", "VERIFIED", "DECLINED"),
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
