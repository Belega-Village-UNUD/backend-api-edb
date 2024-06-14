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
      this.belongsTo(models.ProductType, {
        foreignKey: "type_id",
        as: "product_type",
        foreignKeyConstraint: true,
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
      price: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("price");
          return value === null ? null : parseFloat(value);
        },
      },
      stock: DataTypes.INTEGER,
      weight_gr: DataTypes.INTEGER,
      is_preorder: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
