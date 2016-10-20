'use strict';
require('le_node');
var dotenv = require('dotenv');
dotenv.config();
var winston = require('winston');
var emailService = require('./libs/emailService');
var validator = require('validator');

function sendEmail(event, context, callback) {
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
    callback({error:errors, errorCode:4001});
    return
  }

  winston.info('E-mail ready to be sent to: ' + recipient);
  emailService.sendEmail(recipient, subject, content, function(error){
    if(!error) {
      callback(null, 'E-mail is processed');
    }
    else {
      callback({error:"Unexpected error", errorCode:5001});
    }
  });
}

module.exports = {
  sendEmail: sendEmail
};
