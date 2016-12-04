'use strict';
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');
var EmailStatus = require('../libs/emailStatus');

describe('Sendgrid webhook API', function () {
  var sendgridWebhookSubscriber, emailRepositoryUpdateStub, contextStub;

  beforeEach(function () {
    emailRepositoryUpdateStub = sinon.stub();
    contextStub = sinon.stub();
    sendgridWebhookSubscriber = proxyquire('../sendgridWebhookSubscriber', {
      './libs/emailRepository': {
        updateEventStatus: emailRepositoryUpdateStub
      }
    });

  });

  it('if the event type is delivered, it should save the status as delivered', function (done) {
    emailRepositoryUpdateStub.yields(null);
    var messageId = '123';
    var timestamp = 1337197600;
    var sendgridEmailId = 'sendgrid_internal_message_id';
    var event = buildSendgridEvent(messageId, 'delivered', timestamp, sendgridEmailId);
    var emailStatus = new EmailStatus('delivered', timestamp);
    emailStatus.emailService = 'Sendgrid';
    emailStatus.emailIdFromService = sendgridEmailId;
    sendgridWebhookSubscriber.receiveWebhook(event, contextStub, function(error){
      assert(emailRepositoryUpdateStub.calledWithMatch(messageId, emailStatus, sinon.match.any));
      done();
    });
  });

});

var buildSendgridEvent = function(messageId, event, timestamp, sendgridEmailId){
  var sendgridEvent = [
    {
      'sg_message_id': sendgridEmailId,
      'email': 'email@email.com',
      'timestamp': timestamp,
      'event': event,
      'messageId': messageId
    }
  ];
  return sendgridEvent
};
