'use strict';
var winston = require('winston');
var Sendgrid = require('sendgrid');
var sendgridHelper = Sendgrid.mail;

var sendEmail = function(emailMessage, callback){
  winston.info('E-mail about to be handled by Sendgrid');
  var email = buildEmail(emailMessage);

  var sendgrid = new Sendgrid(process.env.SENDGRID_API_KEY);
  var request = sendgrid.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: email.toJSON()
  });

  sendgrid.API(request, function(error, response) {
    if (!error) {
      winston.info('Sendgrid successfully sent the e-mail with id: ' + emailMessage.id + '. Details: ' + JSON.stringify(response));
      callback(null);
    }
    else {
      winston.error('Sendgrid failed on sending the e-mail with id: ' + emailMessage.id + '. Error: ' + JSON.stringify(response));
      callback(response.body);
    }
  });
};

var buildEmail = function(emailMessage) {
  var sender = new sendgridHelper.Email(emailMessage.sender);
  var recipient = new sendgridHelper.Email(emailMessage.recipient);
  var subject = emailMessage.subject;
  var content = new sendgridHelper.Content('text/html', emailMessage.content);
  var email = new sendgridHelper.Mail(sender, subject, recipient, content);

  return email;
};

module.exports.sendEmail = sendEmail;
