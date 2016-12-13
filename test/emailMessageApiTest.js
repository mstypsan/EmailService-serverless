'use strict';
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
var assert = require('assert');

describe('Email message API', function () {
  var emailMessageApi, emailRepository, contextStub;

  beforeEach(function () {
    emailRepository = sinon.stub();
    emailRepository.getEmail = sinon.stub();
    contextStub = sinon.stub();
    emailMessageApi = proxyquire('../emailMessageApi', {
      './libs/emailRepository': emailRepository
    });
  });

  it('if the email message id is empty, return error', function (done) {
    emailMessageApi.getEmailMessage({emailMessageId:''}, contextStub, function(error){
      assert(emailRepository.getEmail.notCalled);
      assert(error);
      assert(error.indexOf(400) > -1);
      done();
    });
  });

  it('if the email message id is not found in the database, return error', function (done) {
    emailRepository.getEmail.yields(null, {Items: []});
    emailMessageApi.getEmailMessage({emailMessageId:'123'}, contextStub, function(error){
      assert(emailRepository.getEmail.calledOnce);
      assert(error);
      assert(error.indexOf(404) > -1);
      done();
    });
  });

  it('if the email message id is found in the database, return the email message', function (done) {
    var emailMessageId = '123';
    emailRepository.getEmail.yields(null, {Items: [{id: emailMessageId, emailStatus:["{\"emailService\":\"Sendgrid\",\"emailIdFromService\":\"Emp4OBswRqeFPj5cEJ_RmQ.filter0251p1las1-16319-58445904-25.0\",\"status\":\"delivered\",\"timestamp\":1480874248}"]}]});
    emailMessageApi.getEmailMessage({emailMessageId: emailMessageId}, contextStub, function(error, data){
      assert(emailRepository.getEmail.calledOnce);
      assert(!error);
      assert(data.indexOf(200) > -1);
      assert(data.indexOf(emailMessageId) > -1);
      done();
    });
  });

});
