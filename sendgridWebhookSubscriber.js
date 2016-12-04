'use strict';
require('le_node');
var dotenv = require('dotenv');
dotenv.config();
var winston = require('winston');
var emailEventMapper = require('./mapping/emailEventMapper');
var emailRepository = require('./libs/emailRepository');
var Sendgrid = require('sendgrid');

var receiveWebhook = function(event, context, callback) {
  var emailMessages = event;
  for(var i=0; i<emailMessages.length; i++) {
    var emailMessage = emailMessages[i];

    var emailStatus = getEmailStatus(emailMessage);
    if(!emailStatus) {
      callback();
      return;
    }
    emailStatus.emailService = 'Sendgrid';
    emailStatus.emailIdFromService = emailMessage.sg_message_id;
    emailRepository.updateEventStatus(emailMessage.messageId, emailStatus, function (error) {
      if (!error) {
        callback(null, JSON.stringify({statusCode: 200}));
      }
      else {
        callback(JSON.stringify({error: error, statusCode: 500}));
      }
    });
  }
};

var getEmailStatus = function(emailMessage) {
  if(emailMessage.event === 'delivered') {
    return emailEventMapper.mapDeliveredStatus(emailMessage.timestamp);
  }
  if (emailMessage.event === 'bounce') {
    return emailEventMapper.mapBounceStatus(emailMessage.status, emailMessage.type, emailMessage.reason, emailMessage.timestamp);
  }
  if (emailMessage.event === 'dropped') {
    return emailEventMapper.mapDroppedStatus(null, null, emailMessage.reason, emailMessage.timestamp);
  }
  if (emailMessage.event === 'spamreport') {
    return emailEventMapper.mapSpamReportStatus(emailMessage.timestamp);
  }
  if (emailMessage.event === 'deferred') {
    return emailEventMapper.mapDeferredStatus(emailMessage.response, emailMessage.timestamp, emailMessage.attempt);
  }
  winston.info('Not handling status '+ emailMessage.event +' for message ' + emailMessage.messageId);
};


module.exports = {
  receiveWebhook: receiveWebhook
};
