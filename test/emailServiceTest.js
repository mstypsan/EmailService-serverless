'use strict';
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
var assert = require('assert');

describe('Email service', function () {
  var emailService, sendgridStub, mailgunStub, emailRepositoryStub;

  beforeEach(function () {
    emailRepositoryStub = sinon.stub();
    emailRepositoryStub.saveEmail = sinon.stub();

    sendgridStub = sinon.stub();
    sendgridStub.sendEmail = sinon.stub();
    mailgunStub = sinon.stub();
    mailgunStub.sendEmail = sinon.stub();

    emailService = proxyquire('../libs/service/emailService', {
      './../emailRepository': emailRepositoryStub,
      './sendgridService': sendgridStub,
      './mailgunService': mailgunStub
    });
  });

  it('if no error is thrown it should ensure that the message was sent with one provider', function (done) {
    emailRepositoryStub.saveEmail.yields(null);
    sendgridStub.sendEmail.yields(null);
    mailgunStub.sendEmail.yields(null);
    emailService.handleEmail('test@email.com', 'subject', 'content', function(error) {
      assert(sendgridStub.sendEmail.calledOnce || mailgunStub.sendEmail.calledOnce);
      assert((sendgridStub.sendEmail.calledOnce && mailgunStub.sendEmail.calledOnce) == false);
      done();
    });
  });

  it('if sendgrid throws an error it should fallback to mailgun', function (done) {
    emailRepositoryStub.saveEmail.yields(null);
    sendgridStub.sendEmail.yields('error');
    mailgunStub.sendEmail.yields(null);
    emailService.handleEmail('test@email.com', 'subject', 'content', function(error) {
      assert(mailgunStub.sendEmail.calledOnce);
      done();
    });
  });

  it('if mailgun throws an error it should fallback to sendgrid', function (done) {
    emailRepositoryStub.saveEmail.yields(null);
    mailgunStub.sendEmail.yields('error');
    sendgridStub.sendEmail.yields(null);
    emailService.handleEmail('test@email.com', 'subject', 'content', function(error) {
      assert(sendgridStub.sendEmail.calledOnce);
      done();
    });
  });
});
