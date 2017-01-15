'use strict';

const tableName = 'scope';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      tableName,
      {
        id: {
          type: 'TINYINT UNSIGNED',
          primaryKey: true,
          autoIncrement: true,
        },
        key: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
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
