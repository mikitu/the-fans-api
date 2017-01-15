'use strict';

const mod = require('../src/user/get.js');
const mochaPlugin = require('serverless-mocha-plugin');


const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'index' });
const user = {
  id: 1,
  fb_id: 1,
  name:'Test User',
  first_name: 'First Name',
  last_name: 'Last Name',
  gender: 'Gender',
  picture: 'Picture',
  timezone: 1,
  is_active: 1,
  created_at: new Date().toLocaleString()
}

describe('userGet', () => {
  before((done) => {
    const mysql = require('mysql');

    let db = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'pass',
      database : 'the-fans',
    });

    db.query('DROP TABLE IF EXISTS `user`', function(err){
      if(!err) {
        let query = 'CREATE TABLE `user` (`id` INT(6) NOT NULL,' +
          ' `fb_id` BIGINT NOT NULL,' +
          ' `name` VARCHAR(255) NOT NULL,' +
          ' `first_name` VARCHAR(255) NOT NULL,' +
          ' `last_name` VARCHAR(255) NOT NULL,' +
          ' `gender` VARCHAR(10) NOT NULL,' +
          ' `picture` VARCHAR(1024) NOT NULL,' +
          ' `timezone` TINYINT(3) NOT NULL,' +
          ' `is_active` TINYINT(3) NOT NULL,' +
          ' `created_at` DATETIME NOT NULL' +
          ') ENGINE=MEMORY;';
        db.query(query, function(err) {
          if(!err) {
            let query = 'INSERT INTO `user` VALUES (' + user.id + ', ' +
              '' + user.fb_id + ',' +
              ' "' + user.name + '",' +
              ' "' + user.first_name + '",' +
              ' "' + user.last_name + '",' +
              ' "' + user.gender + '",' +
              ' "' + user.picture + '",' +
              ' "' + user.timezone + '", ' +
              ' "1", ' +
              'NOW())';
            db.query(query, function(err, response){
              done();
            })
          }
        })

      }
    });
  });

  it('Path Parameter Invalid - No pathParameters', () => {
    const event = {}
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(400);
      //TODO test the message response
    });
  });

  it('Path Parameter Invalid - No ID in pathParameters', () => {
    const event = {
      pathParameters:{}
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(400);
      //TODO test the message response
    });
  });

  it('Invalid Request Authorization - Missing Request', () => {
    const event = {
      pathParameters:{
        id: 1
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(403);
      //TODO test the message response
    });
  });

  it('Invalid Request Authorization - Missing Authorization Object', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(403);
      //TODO test the message response
    });
  });

  it('Invalid Request Authorization - Missing User ID', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {

        }
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(403);
      //TODO test the message response
    });
  });

  it('Invalid Request Authorization - User ID not the same with Auth User ID', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 2
        }
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(403);
      //TODO test the message response
    });
  });

  it('Empty Requested Fields', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      queryStringParameters:{
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      //TODO test the message response
    });
  });


  it('Invalid Requested Fields', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      queryStringParameters:{
        fields: 'test'
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(400);
      //TODO test the message response
    });
  });

  it('Multiple Fields', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      queryStringParameters:{
        fields: 'id,name'
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      let responseUser = JSON.parse(response.body);
      expect(responseUser.id).to.eql(user.id);
      expect(responseUser.name).to.eql(user.name);
      expect(responseUser.first_name).to.eql(undefined);
    });
  });

  it('All fields', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      queryStringParameters:{
        fields: 'id, fb_id, name, first_name, last_name, gender, picture, timezone'
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      let responseUser = JSON.parse(response.body);
      expect(responseUser.id).to.eql(user.id);
      expect(responseUser.fb_id).to.eql(user.fb_id);
      expect(responseUser.name).to.eql(user.name);
      expect(responseUser.first_name).to.eql(user.first_name);
      expect(responseUser.last_name).to.eql(user.last_name);
      expect(responseUser.gender).to.eql(user.gender);
      expect(responseUser.picture).to.eql(user.picture);
      expect(responseUser.timezone).to.eql(user.timezone);
    });
  });

  it('Empty Result', () => {
    const event = {
      pathParameters:{
        id: 2
      },
      queryStringParameters:{
        fields: 'id,name'
      },
      requestContext:{
        authorizer: {
          user_id: 2
        }
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      //TODO test the message response
    });
  });
});