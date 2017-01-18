'use strict';
const tableName = 'city';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      tableName,
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        country_id: {
          type: 'TINYINT UNSIGNED',
          allowNull: false,
          references: {
            model: 'country',
            key: 'id'
          },
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        }
      },
      {
        engine: 'InnoDB',
        charset: 'utf8',
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable(tableName);
  }
};
