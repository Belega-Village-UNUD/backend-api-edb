"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Product, {
      //   as: "products",
      //   foreignKey: "type_id",
      // });
    }
  }
  ProductType.init(
    {
      name: DataTypes.STRING,
      material: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProductType",
    }
  );
  return ProductType;
};
