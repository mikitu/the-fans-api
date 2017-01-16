'use strict';
process.env['THE_FANS_DB_DATABASE'] = 'the_fans_test';

const mod = require('../src/user/put.js');
const mochaPlugin = require('serverless-mocha-plugin');

const mysql = require('mysql');
const dbConfig = require('../config/db');
const db = mysql.createConnection({
  host     : dbConfig.host,
  user     : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database
});

const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'index' });

const user = {
  id: 1,
  fb_id: 1,
  name:'Test User',
  first_name: 'First Name',
  last_name: 'Last Name',
  gender: 1,
  picture: 'Picture',
  timezone: 1,
  is_active: 1,
  created_at: new Date().toLocaleString()
}

const userUpdated = {
  name:'Update Name',
  first_name: 'Update First Name',
  last_name: 'Update Last Name',
  gender: 2,
  picture: 'Update Picture',
  timezone: 2,
}

describe('userPut', () => {
  before((done) => {
    let query = 'INSERT INTO `user` VALUES (' + user.id + ', ' +
      '' + user.fb_id + ',' +
      ' "' + user.name + '",' +
      ' "' + user.first_name + '",' +
      ' "' + user.last_name + '",' +
      ' "' + user.gender + '",' +
      ' "' + user.picture + '",' +
      ' "' + user.timezone + '", ' +
      ' "ACTIVE", ' +
      ' NOW(), ' +
      'NOW())';
    db.query(query, function(err, response){
      done();
    })
  });
  after((done) => {
    db.query("DELETE FROM user where id = 1", function(err, response){
      done();
    })
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

  it('No fields to update - No Body', () => {
    const event = {
      pathParameters:{
        id: 1
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

  it('No fields to update - Null Body', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: null
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(400);
      //TODO test the message response
    });
  });

  it('No fields to update - Empty Body', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {

      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(400);
      //TODO test the message response
    });
  });


  it('Invalid fields to update', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {
        id: 2,
        name: "Test"
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(400);
      //TODO test the message response
    });
  });

  it('Invalid value for gender', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {
        gender: 0
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(400);
      //TODO test the message response
    });
  });

  it('Valid value for Gender - 1', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {
        gender: 1
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      const responseUser = JSON.parse(response.body);
      expect(responseUser.success).to.eql(true);
      db.query("SELECT * FROM user WHERE id = 1", function(err, rows) {
        expect(err).to.eql(null);
        expect(rows[0].gender).to.eql(1);
      })
    });
  });

  it('Valid value for Gender - 2', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {
        gender: 2
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      const responseUser = JSON.parse(response.body);
      expect(responseUser.success).to.eql(true);
      db.query("SELECT * FROM user WHERE id = 1", function(err, rows) {
        expect(err).to.eql(null);
        expect(rows[0].gender).to.eql(2);
      })
    });
  });

  it('Valid value for Gender - male', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {
        gender: 'male'
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      const responseUser = JSON.parse(response.body);
      expect(responseUser.success).to.eql(true);
      db.query("SELECT * FROM user WHERE id = 1", function(err, rows) {
        expect(err).to.eql(null);
        expect(rows[0].gender).to.eql(1);
      })
    });
  });

  it('Valid value for Gender - female', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {
        gender: 'female'
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      const responseUser = JSON.parse(response.body);
      expect(responseUser.success).to.eql(true);
      db.query("SELECT * FROM user WHERE id = 1", function(err, rows) {
        expect(err).to.eql(null);
        expect(rows[0].gender).to.eql(2);
      })
    });
  });

  it('Valid value for Gender - male upperchase', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {
        gender: 'MALE'
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      const responseUser = JSON.parse(response.body);
      expect(responseUser.success).to.eql(true);
      db.query("SELECT * FROM user WHERE id = 1", function(err, rows) {
        expect(err).to.eql(null);
        expect(rows[0].gender).to.eql(1);
      })
    });
  });

  it('Valid value for Gender - female uppercase', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {
        gender: 'FEMALE'
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      const responseUser = JSON.parse(response.body);
      expect(responseUser.success).to.eql(true);
      db.query("SELECT * FROM user WHERE id = 1", function(err, rows) {
        expect(err).to.eql(null);
        expect(rows[0].gender).to.eql(2);
      })
    });
  });


  it('Valid fields to update', () => {
    const event = {
      pathParameters:{
        id: 1
      },
      requestContext:{
        authorizer: {
          user_id: 1
        }
      },
      body: {
        name: userUpdated.name,
        first_name: userUpdated.first_name,
        last_name: userUpdated.last_name,
        gender: userUpdated.gender,
        picture: userUpdated.picture,
        timezone: userUpdated.timezone,
      }
    }
    return wrapped.run(event).then((response) => {
      expect(response.statusCode).to.eql(200);
      const responseUser = JSON.parse(response.body);
      expect(responseUser.success).to.eql(true);
      db.query("SELECT * FROM user WHERE id = 1", function(err, rows) {
        expect(err).to.eql(null);
        expect(rows[0].name).to.eql(userUpdated.name);
        expect(rows[0].first_name).to.eql(userUpdated.first_name);
        expect(rows[0].last_name).to.eql(userUpdated.last_name);
        expect(rows[0].gender).to.eql(userUpdated.gender);
        expect(rows[0].picture).to.eql(userUpdated.picture);
        expect(rows[0].timezone).to.eql(userUpdated.timezone);
      })
    });
  });

});
