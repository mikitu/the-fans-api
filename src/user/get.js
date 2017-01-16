'use strict';
//TODO read KMS
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

  const checkAuthorizationRequest = validateAuthorizationRequest(event);
  if(checkAuthorizationRequest) {
    return callback(null, checkAuthorizationRequest);
  }

  const userId = event.pathParameters.id;
  const authUserId = event.requestContext.authorizer.user_id;

  const checkAuthorizatio = validateAuthorization(userId, authUserId);
  if(checkAuthorizatio) {
    return callback(null, checkAuthorizatio);
  }

  const requestedFields = getRequestedFields(event);
  const checkRequestedFields = validateRequestedFields(requestedFields);
  if(checkRequestedFields) {
    return callback(null, checkRequestedFields);
  }

  const query = buildQuery(userId, getFields(requestedFields));

  /* check if the user exists */
  db.query(query, function(err, rows) {
    /* istanbul ignore if */
    if (err) {
      let error =  {
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

    if(0 === rows.length) {
      let response =  {
        statusCode: 200,
        body: {}
      }
      return callback(null, response);
    }

    let response =  {
      statusCode: 200,
      body: JSON.stringify(rows[0])
    }
    return callback(null, response);
  });
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


function getRequestedFields(event) {
  if(typeof event.queryStringParameters === 'undefined' || event.queryStringParameters === null || typeof event.queryStringParameters.fields === 'undefined') {
    return null;
  }
  return event.queryStringParameters.fields.replace(/\s+/g, '').split(",");
}

function validateRequestedFields(requestedFields) {
  if(typeof requestedFields !== 'undefined' && requestedFields !== null) {
    const validFields = [
      "id",
      "fb_id",
      "name",
      "first_name",
      "last_name",
      "gender",
      "picture",
      "timezone",
      "created_at",
    ];
    let nonValidFields = requestedFields.filter(function(n) {
      return validFields.indexOf(n) === -1;
    });

    if(nonValidFields.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: {
            "type": "MethodException",
            "message": "Tried accessing non existing attributes (" + nonValidFields.join(',') + ") on node type (User)",
            "error_data":{
              "blame_field_specs": nonValidFields
            },
            "code": "X",
          }
        })
      }
    }
  }
}

function getFields(requestedFields) {
  let returnFields = ["id"];
  if(typeof requestedFields !== 'undefined' && requestedFields !== null) {
    requestedFields.filter(function (n) {
      if (returnFields.indexOf(n) === -1) {
        returnFields.push(n)
      }
    });
  }
  return returnFields;

}

function buildQuery(user_id, fields) {
  return 'SELECT ' + fields.join(',') + ' FROM `user` WHERE id = ' + mysql.escape(user_id) + ' LIMIT 1';
}