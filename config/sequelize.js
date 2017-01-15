const dbConfig = require('./db');
module.exports = {
  development: {
    "username": dbConfig.user,
    "password": dbConfig.password,
    "database": dbConfig.database,
    "host": dbConfig.host,
    "dialect": "mysql"
  },
  test: {
    "username": dbConfig.user,
    "password": dbConfig.password,
    "database": dbConfig.database + '_test',
    "host": dbConfig.host,
    "dialect": "mysql"
  }
};
