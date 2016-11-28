'use strict';
var winston = require('winston');
var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
var dynamodb = new AWS.DynamoDB.DocumentClient();
var tableName = 'emailMessage';


var getEmail = function(emailMessageId, callback) {
  var params = {
    TableName : tableName,
    KeyConditionExpression: "id = :messageId",
    ExpressionAttributeValues: {
      ":messageId":emailMessageId
    }
  };

  dynamodb.query(params, function(error, data) {
    if (error) {
      winston.error('Unable to query. Error:', JSON.stringify(error, null, 2));
      callback(error);
    } else {
      winston.info('Query succeeded.');
      callback(null, data);
    }
  });
};

var saveEmail = function(emailMessage, callback) {
  var params = {
    TableName: tableName,
    Item: emailMessage
  };

  dynamodb.put(params, function(error, data) {
    if (error) {
      winston.error('Error updating status for message ' + emailMessage.id + '.Error:' + JSON.stringify(error));
      callback(error);
    }
    else {
      winston.info('Successfully added email to db id: '+ emailMessage.id);
      callback(null);
    }
  });

};

var updateEventStatus = function(messageId, emailStatus, callback) {
  if(!emailStatus) {
    callback(null);
  }
  var params = {
    Key:{id: messageId},
    TableName: tableName,
    UpdateExpression: 'SET emailStatus=list_append(emailStatus, :attrValue)',
    "ExpressionAttributeValues" : {
      ":attrValue" : [JSON.stringify(emailStatus)]//limitations from DynamoDb on adding a JSON object
    },
    ReturnValues: "ALL_NEW"
  };

  dynamodb.update(params, function(error) {
    if (error) {
      winston.error('Error updating status for message ' + messageId + '.Error:' + error + '.Stack:' + JSON.stringify(error.stack));
      callback(error);
    }
    else {
      winston.info('Successfully added status '+ emailStatus.status +' for message ' + messageId);
      callback(null);
    }
  });
};


module.exports = {
  getEmail: getEmail,
  saveEmail: saveEmail,
  updateEventStatus: updateEventStatus
};