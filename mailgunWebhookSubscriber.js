'use strict';
require('le_node');
var dotenv = require('dotenv');
dotenv.config();
var winston = require('winston');
var emailEventMapper = require('./mapping/emailEventMapper');
var emailRepository = require('./libs/emailRepository');
var Mailgun = require('mailgun-js');
var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

var receiveWebhook = function(event, context, callback) {
  var emailMessage = event;
  if (!mailgun.validateWebhook(emailMessage.timestamp, emailMessage.token, emailMessage.signature)) {
    winston.info('Request came, but not from Mailgun');
    callback(JSON.stringify({error: 'Invalid signature. Are you even Mailgun?', errorCode: 4001, statusCode: 406}));
    return;
  }

  var emailStatus = getEmailStatus(emailMessage);
  if(!emailStatus) {
    callback();
    return;
  }
  emailStatus.emailService = 'Mailgun';
  emailStatus.emailIdFromService = emailMessage["Message-Id"];
  emailRepository.updateEventStatus(emailMessage.messageId, emailStatus, function (error) {
    if (!error) {
      callback(null, {statusCode: 200});
    }
    else {
      callback(JSON.stringify({error: error, statusCode: 500}));
    }
  });
};

var getEmailStatus = function(emailMessage) {
  if(emailMessage.event === 'delivered') {
    return emailEventMapper.mapDeliveredStatus(emailMessage.timestamp);
  }
  if (emailMessage.event === 'bounced') {
    return emailEventMapper.mapBounceStatus(emailMessage.code, emailMessage.error, emailMessage.notification, emailMessage.timestamp);
  }
  if (emailMessage.event === 'dropped') {
    return emailEventMapper.mapDroppedStatus(emailMessage.code, emailMessage.description, emailMessage.reason, emailMessage.timestamp);
  }
  if (emailMessage.event === 'complained') {
    return emailEventMapper.mapSpamReportStatus(emailMessage.timestamp);
  }
  winston.info('Not handling status '+ emailMessage.event +' for message ' + emailMessage.messageId);
};


module.exports = {
  receiveWebhook: receiveWebhook
};
