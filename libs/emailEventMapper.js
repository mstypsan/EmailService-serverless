'use strict';
var EmailStatus = require('./emailStatus');

var mapDeliveredStatus = function(emailService, timestamp) {
  var emailStatus = new EmailStatus(emailService, 'delivered', timestamp);
  return emailStatus;
};

var mapBounceStatus = function(emailService, errorCode, errorDescription, reason, timestamp) {
  var emailStatus = new EmailStatus(emailService, 'bounced', timestamp);
  setErrorMessage(emailStatus, errorCode, errorDescription, reason);
  return emailStatus;
};

var mapDroppedStatus = function(emailService, errorCode, errorDescription, reason, timestamp) {
  var emailStatus = new EmailStatus(emailService, 'dropped', timestamp);
  setErrorMessage(emailStatus, errorCode, errorDescription, reason);
  return emailStatus;
};

var mapSpamReportStatus = function(emailService, errorCode, errorDescription, reason, timestamp) {
  var emailStatus = new EmailStatus(emailService, 'spam-reported', timestamp);
  setErrorMessage(emailStatus, errorCode, errorDescription, reason);
  return emailStatus;
};

var mapDeferredStatus = function(emailService, errorCode, errorDescription, reason, timestamp) {
  //TODO
};

var setErrorMessage = function(emailStatus, errorCode, errorDescription, reason) {
  emailStatus.errorCode = errorCode;
  emailStatus.errorDescription = errorDescription;
  emailStatus.reason = reason;
};

module.exports = {
  mapDeliveredStatus: mapDeliveredStatus,
  mapBounceStatus: mapBounceStatus,
  mapDroppedStatus: mapDroppedStatus,
  mapSpamReportStatus: mapSpamReportStatus
};