'use strict';
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');

describe('Email service', function () {
  var emailService, sendgridStub, mailgunStub;

  beforeEach(function () {
    this.timeout(3000);
    sendgridStub = sinon.stub();
    mailgunStub = sinon.stub();
    emailService = proxyquire('../libs/emailService', {
      './sendgridService': {
        sendEmail: sendgridStub
      },
      './mailgunService': {
        sendEmail: mailgunStub
      }
    });
  });

  it('if no error is thrown it should ensure that the message was sent with one provider', function () {
    emailService.sendEmail('test@email.com', 'subject', 'content');
    assert(sendgridStub.calledOnce || mailgunStub.calledOnce);
    assert(sendgridStub.calledOnce && mailgunStub.calledOnce == false);
  });

  it('if sendgrid throws an error it should fallback to mailgun', function () {
    sendgridStub.yields('error');
    emailService.sendEmail('test@email.com', 'subject', 'content');
    assert(mailgunStub.calledOnce);
  });

  it('if mailgun throws an error it should fallback to sendgrid', function () {
    mailgunStub.yields('error');
    emailService.sendEmail('test@email.com', 'subject', 'content');
    assert(sendgridStub.calledOnce);
  });
});
