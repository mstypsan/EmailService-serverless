'use strict';
require('le_node');
var dotenv = require('dotenv');
dotenv.config();
var winston = require('winston');
var emailEventMapper = require('./libs/emailEventMapper');
var emailRepository = require('./libs/emailRepository');
var Mailgun = require('mailgun-js');
var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

var receiveWebhook = function(event, context, callback) {
  var emailMessage = event;
  winston.info(event);
  if (!mailgun.validateWebhook(emailMessage.timestamp, emailMessage.token, emailMessage.signature)) {
    winston.info('Request came, but not from Mailgun');
    callback(JSON.stringify({error: 'Invalid signature. Are you even Mailgun?', errorCode: 4001, statusCode: 406}));
    return;
  }

  var emailStatus = getEmailStatus(emailMessage);
  emailRepository.updateEventStatus(emailMessage.messageId, emailStatus, function (error) {
    if (!error) {
      callback();
    }
    else {
      callback(JSON.stringify({error: error, statusCode: 500}));
    }
  });
};

var getEmailStatus = function(emailMessage) {
  var emailService = 'Mailgun';

  if(emailMessage.event === 'delivered') {
    return emailEventMapper.mapDeliveredStatus(emailService, emailMessage.timestamp);
  }
  if (emailMessage.event === 'bounced') {
    return emailEventMapper.mapBounceStatus(emailService, emailMessage.code, emailMessage.error, emailMessage.notification, emailMessage.timestamp);
  }
  if (emailMessage.event === 'dropped') {
    return emailEventMapper.mapDroppedStatus(emailService, emailMessage.code, emailMessage.description, emailMessage.reason, emailMessage.timestamp);
  }
  if (emailMessage.event === 'complained') {
    return emailEventMapper.mapSpamReportStatus(emailService, emailMessage.timestamp);
  }
  winston.info('Not handling status '+ emailMessage.event +' for message ' + emailMessage.messageId);
};


module.exports = {
  receiveWebhook: receiveWebhook
};
