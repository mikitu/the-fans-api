'use strict';

const tableName = 'user';
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
        fb_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          unsigned: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        first_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        gender: {
          type: 'TINYINT UNSIGNED',
          allowNull: true,
        },
        picture: {
          type: Sequelize.STRING(1024),
          allowNull: false,
        },
        timezone: {
          type: 'TINYINT UNSIGNED',
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8',
      }
    );

    queryInterface.addIndex(
      tableName,
      ['fb_id'],
      {
        indexName: 'fb_id_UNQ',
        indicesType: 'UNIQUE'
      }
    )

    queryInterface.addIndex(
      tableName,
      ['status'],
      {
        indexName: 'status_IDX',
      }
    )


  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable(tableName);
  }
};
