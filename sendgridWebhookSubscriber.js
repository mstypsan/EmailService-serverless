'use strict';
require('le_node');
var dotenv = require('dotenv');
dotenv.config();
var winston = require('winston');
var emailEventMapper = require('./libs/emailEventMapper');
var emailRepository = require('./libs/emailRepository');
var Sendgrid = require('sendgrid');

var receiveWebhook = function(event, context, callback) {
  var emailMessages = event;
  for(var i=0; i<emailMessages.length; i++) {
    var emailMessage = emailMessages[i];

    var emailStatus = getEmailStatus(emailMessage);
    emailRepository.updateEventStatus(emailMessage.messageId, emailStatus, function (error) {
      if (!error) {
        callback();
      }
      else {
        callback(JSON.stringify({error: error, statusCode: 500}));
      }
    });
  }
};

var getEmailStatus = function(emailMessage) {
  var emailService = 'Sendgrid';

  if(emailMessage.event === 'delivered') {
    return emailEventMapper.mapDeliveredStatus(emailService, emailMessage.timestamp);
  }
  if (emailMessage.event === 'bounce') {
    return emailEventMapper.mapBounceStatus(emailService, emailMessage.status, emailMessage.type, emailMessage.reason, emailMessage.timestamp);
  }
  if (emailMessage.event === 'dropped') {
    return emailEventMapper.mapDroppedStatus(emailService, null, null, emailMessage.reason, emailMessage.timestamp);
  }
  if (emailMessage.event === 'spamreport') {
    return emailEventMapper.mapSpamReportStatus(emailService, emailMessage.timestamp);
  }
  if (emailMessage.event === 'deferred') {
    return emailEventMapper.mapDeferredStatus(emailService, emailMessage.response, emailMessage.timestamp, emailMessage.attempt);
  }
  winston.info('Not handling status '+ emailMessage.event +' for message ' + emailMessage.messageId);
};


module.exports = {
  receiveWebhook: receiveWebhook
};
