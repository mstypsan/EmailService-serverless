'use strict';
var EmailStatus = require('./emailStatus');

var mapDeliveredStatus = function(timestamp) {
  var emailStatus = new EmailStatus('delivered', timestamp);
  return emailStatus;
};

var mapBounceStatus = function(errorCode, errorDescription, reason, timestamp) {
  var emailStatus = new EmailStatus('bounced', timestamp);
  setErrorMessage(emailStatus, errorCode, errorDescription, reason);
  return emailStatus;
};

var mapDroppedStatus = function(errorCode, errorDescription, reason, timestamp) {
  var emailStatus = new EmailStatus('dropped', timestamp);
  setErrorMessage(emailStatus, errorCode, errorDescription, reason);
  return emailStatus;
};

var mapSpamReportStatus = function(errorCode, errorDescription, reason, timestamp) {
  var emailStatus = new EmailStatus('spam-reported', timestamp);
  setErrorMessage(emailStatus, errorCode, errorDescription, reason);
  return emailStatus;
};

var mapDeferredStatus = function(errorDescription, timestamp, args) {
  var emailStatus = new EmailStatus('deferred', timestamp);
  setErrorMessage(emailStatus, null, errorDescription, null);
  emailStatus.args = args;
  return emailStatus;
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
  mapSpamReportStatus: mapSpamReportStatus,
  mapDeferredStatus: mapDeferredStatus
};