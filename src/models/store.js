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
      // define association here
      this.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
        foreignKeyConstraint: true,
      });
      this.hasMany(models.Product, {
        foreignKey: "store_id",
        as: "store",
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
      description: DataTypes.TEXT,
      unverified_reason: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
