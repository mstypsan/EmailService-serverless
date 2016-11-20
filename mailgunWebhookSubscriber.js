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
  var body = event.body;
  var messageId = body.messageId;

  if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
    winston.info('Request came, but not from Mailgun');
    callback(JSON.stringify({error:'Invalid signature. Are you even Mailgun?', errorCode:4001, statusCode:406}));
    return;
  }

  var emailStatus = getEmailStatus(body);
  emailRepository.updateEventStatus(messageId, emailStatus, function(error) {
    if(!error) {
      callback(null);
    }
    else {
      callback(JSON.stringify({error:error, statusCode:500}));
    }
  });
};

var getEmailStatus = function(body) {
  var emailService = 'Mailgun';

  if(body.event === 'delivered') {
    return emailEventMapper.mapDeliveredStatus(emailService, body.timestamp)
  }
  if (body.event === 'bounced') {
    return emailEventMapper.mapBounceStatus(emailService, body.code, body.error, body.notification, body.timestamp)
  }
  if (body.event === 'dropped') {
    return emailEventMapper.mapDroppedStatus(emailService, body.code, body.description, body.reason, body.timestamp)
  }
  if (body.event === 'complained') {
    return emailEventMapper.mapSpamReportStatus(emailService, body.timestamp)
  }
};


module.exports = {
  receiveWebhook: receiveWebhook
};
