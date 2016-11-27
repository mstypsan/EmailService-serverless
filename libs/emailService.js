'use strict';
var winston = require('winston');
var async = require('async');
var EmailMessage = require('./emailMessage');
var sendgridService = require('./sendgridService');
var mailgunService = require('./mailgunService');
var emailRepository = require('./emailRepository');
var emailProviders = [sendgridService, mailgunService];

var handleEmail = function(recipient, subject, content, callback){
  var sender = process.env.SENDER_EMAIL;
  var emailMessage = new EmailMessage(sender, recipient, subject, content);

  emailRepository.saveEmail(emailMessage, function(error) {
      if(error) {
        callback(error);
      }
      else {
        sendEmail(emailMessage, callback);
      }
    }
  );
};

var sendEmail = function(emailMessage, callback) {
  async.someSeries(emailProviders, sendEmailWithProvider.bind(sendEmailWithProvider, emailMessage), function (err, success) {
    if(success) {
      winston.info('Done processing e-mail id: ' + emailMessage.id);
      callback();
    }
    else {
      //At this point the e-mail will not be sent.
      //We will later need to do some retries
      winston.error('Unable to process e-mail for recipient: ' + recipient);
      callback('Not processed');
    }
  });
};

var sendEmailWithProvider = function(emailMessage, emailProvider, callback) {
  emailProvider.sendEmail(emailMessage, function (error) {
      callback(null, !error);
  })
};

module.exports.handleEmail = handleEmail;
