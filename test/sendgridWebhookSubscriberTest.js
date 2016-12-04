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

  function testSendgridWebhookWIthDifferentEvents(test_case) {
    it(test_case.describe, function(done) {
      emailRepositoryUpdateStub.yields(null);
      var messageId = '123';
      var timestamp = 1337197600;
      var sendgridEmailId = 'sendgrid_internal_message_id';
      var event = buildSendgridEvent(messageId, test_case.event, timestamp, sendgridEmailId);
      var emailStatus = new EmailStatus(test_case.output, timestamp);
      emailStatus.emailService = 'Sendgrid';
      emailStatus.emailIdFromService = sendgridEmailId;
      sendgridWebhookSubscriber.receiveWebhook(event, contextStub, function(error){
        assert(emailRepositoryUpdateStub.calledWithMatch(messageId, emailStatus, sinon.match.any));
        done();
      });
    });
  }

  var test_cases = [{describe:'if the event type is delivered, it should save the status as delivered ', event:'delivered', output:'delivered'},
    {describe:'if the event type is dropped, it should save the status as dropped ', event:'dropped', output:'dropped'},
    {describe:'if the event type is deferred, it should save the status as deferred ', event:'deferred', output:'deferred'},
    {describe:'if the event type is bounce, it should save the status as bounced ', event:'bounce', output:'bounced'},
    {describe:'if the event type is spamreport, it should save the status as spam-reported ', event:'spamreport', output:'spam-reported'}];
  for (var i in test_cases) {
    testSendgridWebhookWIthDifferentEvents(test_cases[i]);
  }

  it('if the event type is unknown, it should not save the status', function (done) {
    emailRepositoryUpdateStub.yields(null);
    var messageId = '123';
    var timestamp = 1337197600;
    var sendgridEmailId = 'sendgrid_internal_message_id';
    var event = buildSendgridEvent(messageId, 'unknown_event', timestamp, sendgridEmailId);
    sendgridWebhookSubscriber.receiveWebhook(event, contextStub, function(error){
      assert(emailRepositoryUpdateStub.notCalled);
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
  return sendgridEvent;
};
