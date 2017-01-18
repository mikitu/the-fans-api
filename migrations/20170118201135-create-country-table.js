'use strict';

const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', 'fixtures', 'countries.json');
const jsonString = fs.readFileSync(jsonPath, 'utf8');
const countries = JSON.parse(jsonString);

const tableName = 'country';

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
        code: {
          type: Sequelize.STRING(2),
          allowNull: false,
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

    const size = countries.length;
    let query = '';
    for(let i=0; i<size; i++) {
      query = "INSERT INTO `country` (`code`, `name`) VALUES ('" + countries[i].code + "', '" + countries[i].name + "')";
      queryInterface.sequelize.query(query);
    }
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable(tableName);
  }
};
