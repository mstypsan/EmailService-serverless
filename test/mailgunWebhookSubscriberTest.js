'use strict';
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');
var EmailStatus = require('../libs/emailStatus');

describe('Mailgun webhook API', function () {
  var mailgunWebhookSubscriber, emailRepositoryUpdateStub, contextStub;

  beforeEach(function () {
    emailRepositoryUpdateStub = sinon.stub();
    contextStub = sinon.stub();
    mailgunWebhookSubscriber = proxyquire('../mailgunWebhookSubscriber', {
      './libs/emailRepository': {
        updateEventStatus: emailRepositoryUpdateStub
      }
    });
  });

  function testMailgunWebhookWIthDifferentEvents(test_case) {
    it(test_case.describe, function(done) {
      emailRepositoryUpdateStub.yields(null);
      var messageId = '123';
      var timestamp = 1337197600;
      var mailgunEmailId = 'mailgun_internal_message_id';
      var event = buildMailgunEvent(messageId, test_case.event, timestamp, mailgunEmailId);
      var emailStatus = new EmailStatus(test_case.output, timestamp);
      emailStatus.emailService = 'Mailgun';
      emailStatus.emailIdFromService = mailgunEmailId;
      mailgunWebhookSubscriber.receiveWebhook(event, contextStub, function(error){
        assert(emailRepositoryUpdateStub.calledWithMatch(messageId, emailStatus, sinon.match.any));
        done();
      });
    });
  }

  var test_cases = [{describe:'if the event type is delivered, it  should save the status as delivered ', event:'delivered', output:'delivered'},
    {describe:'if the event type is dropped, it should save the status as dropped ', event:'dropped', output:'dropped'},
    {describe:'if the event type is bounced, it should save the status as bounced ', event:'bounced', output:'bounced'},
    {describe:'if the event type is complained, it should save the status as spam-reported ', event:'complained', output:'spam-reported'}];
  for (var i in test_cases) {
    testMailgunWebhookWIthDifferentEvents(test_cases[i]);
  }

  it('if the event type is unknown, it should not save the status', function (done) {
    emailRepositoryUpdateStub.yields(null);
    var messageId = '123';
    var timestamp = 1337197600;
    var mailgunEmailId = 'mailgun_internal_message_id';
    var event = buildMailgunEvent(messageId, 'unknown_event', timestamp, mailgunEmailId);
    mailgunWebhookSubscriber.receiveWebhook(event, contextStub, function(error){
      assert(emailRepositoryUpdateStub.notCalled);
      done();
    });
  });
});

var buildMailgunEvent = function(messageId, event, timestamp, mailgunEmailId){

  var mailgunEvent = {
    "timestamp": timestamp,
    "recipient": "email@email.com",
    "domain": "sandbox1234.mailgun.org",
    "Message-Id": mailgunEmailId,
    "event": event,
    "messageId": messageId
  };

  return mailgunEvent;
};
