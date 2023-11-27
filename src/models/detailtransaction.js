'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DetailTransaction.init({
    transaction_id: DataTypes.STRING,
    product_id: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL,
    total_price: DataTypes.DECIMAL,
    receipt_link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DetailTransaction',
  });
  return DetailTransaction;
};