'use strict';
require('le_node');
var dotenv = require('dotenv');
dotenv.config();
var winston = require('winston');
var emailEventMapper = require('./libs/emailEventMapper');
var emailRepository = require('./libs/emailRepository');
var Sendgrid = require('sendgrid');
var sendgridHelper = Sendgrid.mail;

var receiveWebhook = function(event, context, callback) {

  var emailMessages = event;
  for(var i=0; i<=emailMessages.length; i++) {
    var emailMessage = emailMessages[i];
    var messageId = emailMessage.messageId;
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

var getEmailStatus = function(emailMessage) {
  var emailService = 'Sendgrid';

  if(emailMessage.event === 'delivered') {
    return emailEventMapper.mapDeliveredStatus(emailService, emailMessage.timestamp)
  }
  if (emailMessage.event === 'bounce') {
    return emailEventMapper.mapBounceStatus(emailService, emailMessage.status, emailMessage.type, emailMessage.reason, emailMessage.timestamp)
  }
  if (emailMessage.event === 'dropped') {
    return emailEventMapper.mapDroppedStatus(emailService, null, null, emailMessage.reason, emailMessage.timestamp)
  }
  if (emailMessage.event === 'spamreport') {
    return emailEventMapper.mapSpamReportStatus(emailService, emailMessage.timestamp)
  }
  if (emailMessage.event === 'deferred') {
    return emailEventMapper.mapSpamReportStatus(emailService, emailMessage.timestamp)
  }
};


module.exports = {
  receiveWebhook: receiveWebhook
};
