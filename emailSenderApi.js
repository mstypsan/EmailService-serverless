'use strict';
require('le_node');
var dotenv = require('dotenv');
dotenv.config();
var winston = require('winston');
var emailService = require('./libs/service/emailService');
var validator = require('validator');

var sendEmail = function(event, context, callback) {
  var subject = event.subject;
  var content = event.content;
  var recipient = event.recipient;
  
  var errors = [];
  if(!subject){
    errors.push('Please enter the subject of the e-mail');
  }
  if(!content){
    errors.push('Please enter the content of the e-mail');
  }
  if(!recipient || !validator.isEmail(recipient)){
    errors.push('Please enter a valid e-mail for the recipient');
  }
  
  if(errors.length){
    callback(JSON.stringify({error:errors, statusCode: 400}));
    return
  }

  winston.info('E-mail ready to be sent to: ' + recipient);
  emailService.handleEmail(recipient, subject, content, function(error, emailMessageId){
    if(!error) {
      callback(null, JSON.stringify({emailMessageId: emailMessageId, message: 'E-mail is processed', statusCode: 200}));
    }
    else {
      callback(JSON.stringify({error: 'Unexpected error', statusCode: 500}));
    }
  });
};

module.exports = {
  sendEmail: sendEmail
};
