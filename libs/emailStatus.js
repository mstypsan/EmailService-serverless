function emailStatus(emailService, status, timestamp){
  this.emailService = emailService;
  this.status = status;
  this.timestamp = timestamp;
}

module.exports = emailStatus;

