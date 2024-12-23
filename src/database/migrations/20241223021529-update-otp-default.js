'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('otps', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    });
    await queryInterface.changeColumn('otps', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('otps', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('otps', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
    });
  }
};
