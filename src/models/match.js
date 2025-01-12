'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Match.belongsTo(models.Club, {
        foreignKey: 'club_id',
        as: 'club'
      })
      Match.belongsTo(models.Stadium, {
        foreignKey: 'stadium_id',
        as: 'stadium'
      })
      Match.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator'
      })
    }
  }
  Match.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    stadium_id: DataTypes.INTEGER,
    club_id: DataTypes.INTEGER,
    matchDate: DataTypes.DATE,
    matchTime: DataTypes.TIME,
    partner_id: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    contactNumber: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Match',
    tableName: 'matches',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Match;
};