'use strict';

const tableName = 'user_scope';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      tableName,
      {
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        scope_id: {
          type: 'TINYINT UNSIGNED',
          allowNull: false,
          references: {
            model: 'scope',
            key: 'id'
          },
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8',
      }
    );

    queryInterface.addIndex(
      tableName,
      ['user_id', 'scope_id'],
      {
        indexName: 'user_scope_UNQ',
        indicesType: 'UNIQUE'
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable(tableName);
  }
};
