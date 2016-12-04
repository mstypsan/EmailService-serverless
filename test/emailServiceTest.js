'use strict';
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');

describe('Email service', function () {
  var emailService, sendgridStub, mailgunStub, emailRepositoryStub;

  beforeEach(function () {
    sendgridStub = sinon.stub();
    mailgunStub = sinon.stub();
    emailRepositoryStub = sinon.stub();
    emailService = proxyquire('../libs/service/emailService', {
      './../emailRepository': {
        saveEmail: emailRepositoryStub
      },
      './sendgridService': {
        sendEmail: sendgridStub
      },
      './mailgunService': {
        sendEmail: mailgunStub
      }
    });
  });

  it('if no error is thrown it should ensure that the message was sent with one provider', function (done) {
    emailRepositoryStub.yields(null);
    sendgridStub.yields(null);
    mailgunStub.yields(null);
    emailService.handleEmail('test@email.com', 'subject', 'content', function(error) {
      assert(sendgridStub.calledOnce || mailgunStub.calledOnce);
      assert((sendgridStub.calledOnce && mailgunStub.calledOnce) == false);
      done();
    });
  });

  it('if sendgrid throws an error it should fallback to mailgun', function (done) {
    emailRepositoryStub.yields(null);
    sendgridStub.yields('error');
    mailgunStub.yields(null);
    emailService.handleEmail('test@email.com', 'subject', 'content', function(error) {
      assert(mailgunStub.calledOnce);
      done();
    });
  });

  it('if mailgun throws an error it should fallback to sendgrid', function (done) {
    emailRepositoryStub.yields(null);
    mailgunStub.yields('error');
    sendgridStub.yields(null);
    emailService.handleEmail('test@email.com', 'subject', 'content', function(error) {
      assert(sendgridStub.calledOnce);
      done();
    });
  });
});
