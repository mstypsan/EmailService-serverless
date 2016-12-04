var uuid = require('node-uuid');

function emailMessage(sender, recipient, subject, content){
  this.id = uuid.v1();
  this.sender = sender;
  this.recipient = recipient;
  this.subject = subject;
  this.content = content;
  this.emailStatus = [];
}

module.exports = emailMessage;
