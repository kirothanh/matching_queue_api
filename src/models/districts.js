'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Districts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Districts.belongsTo(models.Provinces, {
        foreignKey: 'province_id',
        as: 'province'
      })
      Districts.hasMany(models.Wards, {
        foreignKey: 'district_id',
        as: 'wards'
      })
      Districts.hasMany(models.Stadium, {
        foreignKey: 'district_id',
        as: 'stadiums'
      })
    }
  }
  Districts.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Districts',
    tableName: 'districts',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Districts;
};