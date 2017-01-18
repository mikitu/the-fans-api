'use strict';
//TODO read KMS
//TODO validate fields values
const mysql = require('mysql');
const dbConfig = require('../../config/db');
const db = mysql.createConnection({
  host     : dbConfig.host,
  user     : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database
});
module.exports.index = (event, context, callback) => {
  const checkPathParamRequest = validatePathParameters(event);
  if(checkPathParamRequest) {
    return callback(null, checkPathParamRequest);
  }

  const errAuthorizationRequest = validateAuthorizationRequest(event);
  if(errAuthorizationRequest) {
    return callback(null, errAuthorizationRequest);
  }

  const userId = event.pathParameters.id;
  const authUserId = event.requestContext.authorizer.user_id;

  const errAuthorizatio = validateAuthorization(userId, authUserId);
  if(errAuthorizatio) {
    return callback(null, errAuthorizatio);
  }

  const bodyFields = getBodyFields(event);
  const errBodyFields = validateBodyFields(bodyFields);
  if(errBodyFields) {
    return callback(null, errBodyFields);
  }

  let putData = getAttributeValues(event.body);
  if(putData.err) {
    return callback(null, putData.err);
  }

  const query = buildQuery(userId, putData.data);
  db.query(query, function(err, result) {
    /* istanbul ignore if */
    if (err) {
      let error = {
        statusCode: 500,
        body: JSON.stringify({
          error: {
            "type": "MethodException",
            "message": "Internal Server Error",
            "code": "X",
          }
        })
      }
      return callback(null, error);
    }
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        success : true
      })
    })

  })


};

function validatePathParameters(event) {
  if (typeof event.pathParameters === 'undefined' || typeof event.pathParameters.id === 'undefined') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          "type": "ApiMethodException",
          "message": "Unsupported get requestd",
          "code": "X",
        }
      })
    }
  }
}

function validateAuthorizationRequest(event) {
  if(typeof event.requestContext === 'undefined'
    || typeof event.requestContext.authorizer === 'undefined'
    || typeof event.requestContext.authorizer.user_id === 'undefined') {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: {
          "type": "AuthException",
          "message": "Access Forbidden",
          "code": "X",
        }
      })
    }
  }
}

function validateAuthorization(userId, authUserId) {
  if(userId !== authUserId) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: {
          "type": "AuthException",
          "message": "Access Forbidden",
          "code": "X",
        }
      })
    }
  }
}


function getBodyFields(event) {
  if(typeof event.body === 'undefined' || event.body === null) {
    return null;
  }
  return Object.keys(event.body);
}

function validateBodyFields(bodyFields) {
  if(typeof bodyFields === 'undefined' || bodyFields === null || bodyFields.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          "type": "MethodException",
          "message": "No attributes to update",
          "code": "X",
        }
      })
    };
  }
  const validFields = [
    "name",
    "first_name",
    "last_name",
    "gender",
    "picture",
    "timezone",
  ];
  let nonValidFields = bodyFields.filter(function(n) {
    return validFields.indexOf(n) === -1;
  });

  if(nonValidFields.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          "type": "MethodException",
          "message": "Tried to update non existing attributes (" + nonValidFields.join(',') + ") on node type (User)",
          "error_data":{
            "blame_field_specs": nonValidFields
          },
          "code": "X",
        }
      })
    };
  }
}

function getAttributeValues(data) {
  let update = [];
  let err = null;
  Object.keys(data).forEach(function(key) {
    key.toLowerCase();
    let val = typeof data[key] === 'string' ? data[key].trim() : data[key];
    val = transformData(key, val);
    let errValidAttributeValue = validateFieldValues(key, val);
    if(errValidAttributeValue) {
      err =  errValidAttributeValue
      return;
    }
    update.push(key + ' = ' + mysql.escape(val));
  });
  if(err) {
    return {
      err: err,
      data: null
    }
  }
  return {
    err: null,
    data: update
  };
}


function buildQuery(user_id, data) {
  return 'UPDATE `user` SET ' + data.join(', ') + ' WHERE id = ' + mysql.escape(user_id) + ' LIMIT 1';
}


function transformData(attribute, value) {
  let val = value;
  switch(attribute) {
    case 'gender' :
      if (typeof value === 'string') {
        value = value.toLowerCase();
        if (value === 'male') {
          val = 1;
        }
        if (value === 'female') {
          val = 2;
        }
      }
      break;
  }
  return val;
}


function validateFieldValues(attribute, value) {
  let err = null;
  switch(attribute) {
    case 'gender' :
      const validGenders = [1,2]
      if(validGenders.indexOf(value) === -1) {
        err =  {
          statusCode: 400,
          body: JSON.stringify({
            error: {
              type: "MethodException",
              message: "Tried to update attributes (gender) on node type (User) with a value that is not supported (" + value + ")",
              error_data:{
                blame_field_specs: "gender",
                valid_values: "1, 2, male, female"
              },
              "code": "X",
            }
          })
        };
      }
      break;
  }
  return err;
}