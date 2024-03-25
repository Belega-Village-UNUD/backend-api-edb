"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CustomDesign extends Model {
    static associate(models) {
      CustomDesign.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      CustomDesign.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  CustomDesign.init(
    {
      user_id: DataTypes.STRING,
      product_id: DataTypes.STRING,
      image_link: DataTypes.STRING,
      height: DataTypes.INTEGER,
      width: DataTypes.INTEGER,
      budget: DataTypes.DECIMAL,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CustomDesign",
    }
  );
  return CustomDesign;
};
