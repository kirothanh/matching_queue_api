'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stadium extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stadium.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      })
      Stadium.belongsTo(models.Provinces, {
        foreignKey: 'province_id',
        as: 'province'
      })
      Stadium.belongsTo(models.Districts, {
        foreignKey: 'district_id',
        as: 'district'
      })
      Stadium.belongsTo(models.Wards, {
        foreignKey: 'ward_id',
        as: 'ward'
      })
      Stadium.hasOne(models.Match, {
        foreignKey: 'stadium_id',
        as: 'match'
      })
    }
  }
  Stadium.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,

  }, {
    sequelize,
    modelName: 'Stadium',
    tableName: 'stadiums',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Stadium;
};