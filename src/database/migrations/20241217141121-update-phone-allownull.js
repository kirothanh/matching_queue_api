'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(30),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(30),
      allowNull: false,
    });
  }
};
