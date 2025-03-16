'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Otp, {
        foreignKey: 'user_id',
        as: 'otps'
      })
      User.hasMany(models.Match, {
        foreignKey: 'createdBy',
        as: 'matches'
      })
      User.hasMany(models.Chat, {
        foreignKey: 'senderId',
        as: 'chats'
      })
      User.hasMany(models.Notification, {
        foreignKey: 'user_id',
        as: 'notifications'
      })
      User.hasMany(models.Article, {
        foreignKey: 'user_id',
        as: 'articles'
      })
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    role: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    is_deleted: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return User;
};