'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      })
    }
  }
  Chat.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chats',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Chat;
};