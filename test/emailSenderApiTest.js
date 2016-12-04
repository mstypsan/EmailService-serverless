'use strict';
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');

describe('Email sender API', function () {
  var emailSenderApi, emailServiceStub, contextStub;

  beforeEach(function () {
    this.timeout(3000);
    emailServiceStub = sinon.stub();
    contextStub = sinon.stub();
    emailSenderApi = proxyquire('../emailSenderApi', {
      './libs/service/emailService': {
        handleEmail: emailServiceStub
      }
    });

  });

  it('if the subject of the e-mail does not exist, it should not send the e-mail', function (done) {
    var payload = buildPayload(null, "content", "email@email.com");
    emailSenderApi.sendEmail(payload, contextStub, function(error){
      assert(emailServiceStub.notCalled);
      assert(error);
      done();
    });
  });

  it('if the content of the e-mail does not exist, it should not send the e-mail', function (done) {
    var payload = buildPayload("subject", null, "email@email.com");
    emailSenderApi.sendEmail(payload, contextStub, function(error) {
      assert(emailServiceStub.notCalled);
      assert(error);
      done();
    });
  });

  it('if the recipient of the e-mail is not a valid, it should not send the e-mail', function (done) {
    var payload = buildPayload("subject", "content", "not_email.com");
    emailSenderApi.sendEmail(payload, contextStub, function(error){
      assert(emailServiceStub.notCalled);
      assert(error);
      done();
    });
  });

  it('if the e-mail passes the validation, it should send the e-mail', function (done) {
    emailServiceStub.yields(null);
    var payload = buildPayload("subject", "content", "email@email.com");
    emailSenderApi.sendEmail(payload, contextStub, function(error) {
      assert(emailServiceStub.calledOnce);
      assert(!error);
      done();
    });
  });

});

var buildPayload = function(subject, content, recipient){
  var emailPayload = {
    subject: subject,
    content: content,
    recipient: recipient
  };
  return emailPayload
};
