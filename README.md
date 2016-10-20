# EmailService-serverless
Simple e-mail service API that is responsible for sending an e-mail to a single recipient. It uses 2 different e-mail providers, Sendgrid and Mailgun, in order to send the e-mail. The idea behind the e-mail service is to make it robust, highly available and scalable, so that the client does not have to worry whether the e-mail is successfully sent or not. 

It will start by using by default Sendgrid and if Sendgrid fails, it will try again using Mailgun. So this way it ensures that the e-mail will successfully be sent. It is a backend service built in node.js and exposes an API that can be used to pass the necessary information and then send the e-mail.

# Example
You can use any HTTP Client to create a POST request

**<code> POST </code> /email-service/email/send** 

##Parameters##
- **subject** _(required)_ — The subject of the e-mail.
- **content** _(required)_ — The content of the e-mail.
- **recipient** _(required)_ — The recipient of the e-mail.

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

The response will have a status of 200 if the e-mail is accepted indicating that it is processed.


##Details
The service is deployed using Amazon's serverless services, AWS lambda and AWS Api Gateway. AWS lambda is hosted by Amazon that ensures high availability and scaling according to the number of requests. And Api gateway exposes HTTP endpoints that later communicate with AWS lambda. The mapping of the lambda response to an HTTP response is configured in the Api gateway.


##Limitations
- The service is build using only one e-mail recipient. 
- It currently does not support any authorization and it is public for everyone.
- The processed e-mails are not saved somewhere. The same applies when there is an internal error from the service and the e-mail remains unprocessed.
- The service accepts both text and html e-mails. But it is not possible to configure that through the API. If the content is of type html, it will be sent to the recipient as html.
- The sender of the e-mails is currently hard coded in an environment variable because of security reasons. 
- The mailgun provider is currently running on a Sandbox domain, which means that it will only send e-mails to the whitelisted recipients
