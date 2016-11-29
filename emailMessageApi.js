'use strict';
require('le_node');
var dotenv = require('dotenv');
dotenv.config();
var winston = require('winston');
var validator = require('validator');
var emailRepository = require('./libs/emailRepository');

var getEmailMessage = function(event, context, callback) {
  var emailMessageId = event.emailMessageId;
  if(!emailMessageId){
    var error = "emailMessageId is required"
  }

  if(error){
    callback(JSON.stringify({error:error, statusCode: 400}));
    return
  }

  emailRepository.getEmail(emailMessageId, function(error, data){
    if(!error) {
      if(!data || !data.Items.length) {
        winston.info('Email message not found id:' + emailMessageId);
        callback(JSON.stringify({error:"Email message is not found", statusCode: 404}));
        return;
      }

      var emailMessage = data.Items[0];
      var emailStatuses = [];
      emailMessage.emailStatus.forEach(function(item) {
        var emailStatus = JSON.parse(item);
        emailStatuses.push({status: emailStatus.status, timestamp: emailStatus.timestamp});
      });

      var mappedEmailMessage = {
        id: emailMessage.id,
        sender: emailMessage.sender,
        recipient: emailMessage.recipient,
        emailStatus: emailStatuses
      };

      callback(null, mappedEmailMessage);
    }
    else {
      callback(JSON.stringify({error:"Unexpected error", statusCode: 500}));
    }
  });
};

module.exports = {
  getEmailMessage: getEmailMessage
};
