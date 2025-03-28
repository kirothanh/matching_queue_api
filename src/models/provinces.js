'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provinces extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Provinces.hasMany(models.Districts, {
        foreignKey: 'province_id',
        as: 'districts'
      })
      Provinces.hasMany(models.Stadium, {
        foreignKey: 'province_id',
        as: 'stadiums'
      })
    }
  }
  Provinces.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Provinces',
    tableName: 'provinces',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Provinces;
};