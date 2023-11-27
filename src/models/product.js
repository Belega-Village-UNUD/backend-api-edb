"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.ProductType, {
        foreignKey: "id",
        as: "product_type",
      });
      this.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "store",
        foreignKeyConstraint: true,
      });
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        foreignKeyConstraint: true,
      });
      this.hasMany(models.Cart, {
        foreignKey: "product_id",
        as: "cart",
      });
    }
  }
  Product.init(
    {
      user_id: DataTypes.STRING,
      store_id: DataTypes.STRING,
      type_id: DataTypes.STRING,
      image_product: DataTypes.STRING,
      name_product: DataTypes.STRING,
      desc_product: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};