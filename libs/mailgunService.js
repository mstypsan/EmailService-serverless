'use strict';
var winston = require('winston');
var Mailgun = require('mailgun-js');

var sendEmail = function(emailMessage, callback){
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
  winston.info('E-mail about to be handled by Mailgun');
  var email = buildEmail(emailMessage);

  mailgun.messages().send(email, function (error, response) {
    if (!error) {
      winston.info('Mailgun successfully sent the e-mail with id: ' + emailMessage.id + '. Details: ' + JSON.stringify(response));
      callback(null);
    }
    else {
      winston.error('Mailgun failed on sending the e-mail with id: ' + emailMessage.id + '. Error: ' + JSON.stringify(response));
      callback(error);
    }
  });
};

var buildEmail = function(emailMessage) {
  var email = {
    from: emailMessage.sender,
    to: emailMessage.recipient,
    subject: emailMessage.subject,
    html: emailMessage.content
  };
  
  return email;
};

module.exports.sendEmail = sendEmail;
