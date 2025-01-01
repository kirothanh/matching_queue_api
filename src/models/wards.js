'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wards.belongsTo(models.Districts, {
        foreignKey: 'district_id',
        as: 'district'
      })
      Wards.hasMany(models.Stadium, {
        foreignKey: 'ward_id',
        as: 'stadiums'
      })
    }
  }
  Wards.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Wards',
    tableName: 'wards',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Wards;
};