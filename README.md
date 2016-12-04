# EmailService
Simple e-mail service API that is responsible for sending an e-mail to a single recipient. It uses 2 different e-mail providers, Sendgrid and Mailgun, in order to send the e-mail. It will start by using by default Sendgrid and if Sendgrid fails, it will try again using Mailgun. So this way it ensures that the e-mail will successfully be sent. It is a backend service built in node.js and exposes APIs that can be used to pass the necessary information and then send the e-mail.
The service will later listen to webhook events from both Sendgrid and Mailgun, in order to get the status from the e-mail. This way we ensure that bounced, or dropped emails are recorded. More specifically the event the service subscribes to is delivered, bounce, dropped, spamreport, deferred for Sendgrid and delivered, bounced, dropped, complained for Mailgun.

# Example
You can send an e-mail with a POST request

**<code> POST </code> /email-service/email/send** 

##Parameters##
- **subject** _(required)_ The subject of the e-mail.
- **content** _(required)_ The content of the e-mail.
- **recipient** _(required)_ The recipient of the e-mail.

**Request body**
```JSON
{
    "subject":"Subject of the e-mail", 
    "content":"Content of the e-mail", 
    "recipient":"email@email.com"
}
``` 

**Response**
The response will have a status of 200 if the e-mail is accepted indicating that it will be processed. The response will also contain the id of the e-mail message which the client can later use to retrieve the status of the e-mail.

You can check the status of only a single e-mail with a GET request

<code> GET </code> /email-service/email/{emailMessageId}

##Parameter##
- **emailMessageId** _(required)_ — The id of the e-mail message.

**Response**
The response will display the status of the e-mail
##Example##
```JSON
"email": {
"id": "12345",
"sender": "email@email.com",
"recipient": "email@email.com",
"emailStatus": [
  {
    "status": "delivered",
    "timestamp": 1480873296
   }
]
}
```

The service is deployed using Amazon's serverless services, AWS lambda and AWS Api Gateway. AWS lambda is hosted by Amazon that ensures high availability and scaling according to the number of requests. And API gateway helps at exposing HTTP endpoints that later communicates with AWS lambda.
The API Gateway is responsible for mapping the response of lambda to the actual http status code. The mapping is not really flexible at this point and it causes some configuration problems. Another issue that was faced here is how to accept POST with Content-Type: application/x-www-form-urlencoded. Some extra mappings had been used from https://gist.github.com/199911/68a43f83fd933b1e3ac6 in order to support it.
Overall the configuration on the API Gateway made the development more difficult.

##Running tests##
You can run tests using mocha by just running mocha test.


##Limitations
- AWS lambda does not allow for the payload to be more than 128KB http://docs.aws.amazon.com/lambda/latest/dg/limits.html#limits-list
- The service is build using only one e-mail recipient. 
- It currently does not support any authorization and it is public for everyone.
- The service accepts both text and html e-mails. But it is not possible to configure that through the API. If the content is of type html, it will be sent to the recipient as html.
- The sender of the e-mails is currently hard coded in an environment variable because of security reasons. 
- The mailgun provider is currently running on a Sandbox domain, which means that it will only send e-mails to the whitelisted recipients
