var emailSender = require('./emailSenderApi');
var mailgunWebhook = require('./mailgunWebhookSubscriber');


var testEmailSend = function() {
  //var text = '<span>The review was updated:</span><br><br><div style="color: #333333; border: 1px solid #dddddd; border-radius: 3px; padding: 20px">        <div style="background: #f47324; border-radius: 3px; float: left; margin: 0 3px 0 0; padding: 3px; line-height: 1em">        <img src="https://images-static.trustpilot.com/community/shared/sprite_star.png" style="width: 20px; vertical-align: middle">    </div>        <div style="background: #f47324; border-radius: 3px; float: left; margin: 0 3px 0 0; padding: 3px; line-height: 1em">        <img src="https://images-static.trustpilot.com/community/shared/sprite_star.png" style="width: 20px; vertical-align: middle">    </div>            <div style="background: #c8c8c8; border-radius: 3px; float: left; margin: 0 3px 0 0; padding: 3px; line-height: 1em">        <img src="https://images-static.trustpilot.com/community/shared/sprite_star.png" style="width: 20px; vertical-align: middle">    </div>        <div style="background: #c8c8c8; border-radius: 3px; float: left; margin: 0 3px 0 0; padding: 3px; line-height: 1em">        <img src="https://images-static.trustpilot.com/community/shared/sprite_star.png" style="width: 20px; vertical-align: middle">    </div>        <div style="background: #c8c8c8; border-radius: 3px; float: left; margin: 0 3px 0 0; padding: 3px; line-height: 1em">        <img src="https://images-static.trustpilot.com/community/shared/sprite_star.png" style="width: 20px; vertical-align: middle">    </div>        <div style="font-size: 20px; font-weight: 500; margin-top: 2px; float: left; margin-left: 10px;">www.trustpilot.co.uk</div>    <br>    ';

  var text = "test this email";

  var body = {"subject":"Locally1", "content":text, "recipient":"mstypsan@gmail.com"};

  var context = { succeed:function(args){console.log(args);}, fail:function(args){console.log(args);} };

  emailSender.sendEmail(body, context, function(error){
    if(error) {
      console.log(error);
    }
  });
};

var testMailGunWebhook = function() {
  console.log("Test Mailgun webhook");
  var context = { succeed:function(args){console.log(args);}, fail:function(args){console.log(args);} };
  var event = { body: {messageId:"0342ce70-af16-11e6-86a0-a53e86895075", "event":"bounced", "code":12, error:"lal error", "recipient":"mstypsan@gmail.com"}};

  mailgunWebhook.receiveWebhook(event, context, function(error) {
    if(error) {
      console.log(error);
    }
  });
};
//testEmailSend();
testMailGunWebhook();