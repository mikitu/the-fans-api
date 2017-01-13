//
// const mysql = require('mysql');
//
//
// class MySQL {
//   constructor(host, user, password, database) {
//     this.db = mysql.createConnection({
//       host     : host,
//       user     : user,
//       password : password,
//       database : database,
//     });
//   }
//
//   connect(callback) {
//     db.connect(function(err) {
//       if (err) {
//         return callback(err);
//       }
//     });
//   }
// }
//
// module.exports = Users;
// const db = require('db').connect();
// const mailer = require('mailer');
// const Users = require('users');
//
// let users = new Users(db, mailer);
//
// module.exports.saveUser = (event, context, callback) => {
//   users.save(event.email, callback);
// };
//
//
//
//
//
// db = mysql.createConnection({
//   host     : theFans.mysql.host,
//   user     : theFans.mysql.user,
//   password : theFans.mysql.password,
//   database : theFans.mysql.database,
// });
//
// db.connect(function(err) {