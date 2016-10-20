# EmailService-serverless
Simple e-mail service API that is responsible for sending an e-mail to a single recipient. It uses 2 different e-mail providers, Sendgrid and Mailgun, in order to send the e-mail. The idea behind the e-mail service is to make it robust and highly available and scalable. So that the client does not have to worry on whether the e-mail is successfully sent or not. 

It will starts by default using Sendgrid and if Sendgrid fails will try again using Mailgun. So this way it ensures that the e-mail will successfully be sent. It a backend node.js and exposes an API that can be used to send to pass the necessary information and then send the e-mail.

# Example
You can use any HTTP Client to create a POST request

**<code> POST </code> /email-service/email/send** 

##Parameter##
- **subject** _(required)_ � The subject of the e-mail.
- **content** _(required)_ � The content of the e-mail.
- **recipient** _(required)_ � The recipient of the e-mail.

##Example##
**Request body**
```JSON
{
    "subject":"Subject of the e-mail", 
    "content":"Content of the e-mail", 
    "recipient":"email@email.com"
}
``` 

**Response**
The response will have a status of 200 if the e-mail is accepted indicating that it will be processed.


##Scalability
The service is deployed using Amazon's serverless services, AWS lambda and AWS Api Gateway. AWS lambda is hosted by Amazon that ensures high availability and scaling according to the number of requests. And API gateway helps at exposing HTTP endpoints that later communicates with AWS lambda

## Service deployment
.env file

##Limitations
- The service is build using only one e-mail recipient. 
- The processed e-mails are not saved somewhere. Especially an unprocessed e-mail something that could be caused from an internal error of the service, is not currently saved somewhere.
- The service accepts both text and html e-mails. But it is not possible to configure that through the API. If the content is of type html, it will be sent to the recipient as html.
- The sender of the e-mails is currently hard coded because of security reasons. 
- The mailgun provider is currently running on a Sandbox domain, which means that it will only send e-mails the whitelisted recipients
