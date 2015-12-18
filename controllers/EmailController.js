var email = require("emailjs");
var __ = require('underscore');

module.exports.NotifyPostAdmin = function(data, callback) {
	var template = getTemplate_PostAdmin();
	var msg = formatMessage_PostAdmin(template, data);
	var subject = 'Time to Post Your Video!';
	SendMail(data.email, subject, subject, msg, function(success) {
		if (success) {
			callback({'status': 'success'});
		} else {
			callback({'status': 'error sending mail'});
		}
	});
};

module.exports.notifyPostResponders = function(topic, callback) {
	var results = [];
	var complete = function() {
		callback({'status': 'success', 'data': results});
	}
	var finished = __.after(topic.responders.length, complete);
	
	var template = getTemplate_Responder();
	var subject = 'Time to Post Your Video!';
	topic.responders.forEach(function(item, index, array) {
		var data = {
			'category': topic.category,
			'email': item.email,
			'verification_code': item.verification_code,
			'link': 'https://www.youtube.com/watch?v=' + topic.post_admin.youtube_id,
			'thumbnail': 'http://img.youtube.com/vi/' + topic.post_admin.youtube_id + '/maxresdefault.jpg',
			'winner': topic.post_admin.email.split('@')[0]
		};
		var msg = formatMessage_Responder(template, data);
		SendMail(item.email, subject, subject, msg, function(success) {
			if (success) {
				results.push({
					'email': item.email,
					'status': 'success'
				});
			} else {
				results.push({
					'email': item.email,
					'status': 'error'
				});
			}
			finished();
		});
	});
};


//Internal Functions
function SendMail(emlToAddr, emlSubject, emlMessage, emlHtml, callback) {
	
	var server  = email.server.connect({
		user: "no-reply@joepodium.com", 
		password: "ShawnKyleRocks2016!", 
		host: "just46.justhost.com", 
		port: 465,
		ssl: true
	});
	
	var message = {
		text: emlMessage, 
		from: "Joe Podium <no-reply@joepodium.com>", 
		to: emlToAddr,
		subject: emlSubject,
		attachment: 
		[
			{data: emlHtml, alternative:true}
		]
	};  
	
	server.send(message, function(err, message) {
		if (err) {
			console.log(err);
			callback(false);
		} else {
			console.log('Message Sent');
			callback(true);
		}
	});
	
};

function getTemplate_PostAdmin() {
	var myString = (function () {
		/*
		<!DOCTYPE html>
<html lang="en">
<head>
<title>Joe Podium | Contest Winner</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<style type="text/css">
    #outlook a{padding:0;} 
    .ReadMsgBody{width:100%;} .ExternalClass{width:100%;}
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} 
    body, table, td, a{-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;} 
    table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} 
    img{-ms-interpolation-mode:bicubic;} 

    body{margin:0; padding:0;}
    img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;}
    table{border-collapse:collapse !important;}
    body{height:100% !important; margin:0; padding:0; width:100% !important;}

    .appleBody a {color:#68440a; text-decoration: none;}
    .appleFooter a {color:#999999; text-decoration: none;}

    @media screen and (max-width: 525px) {

        table[class="wrapper"]{
          width:100% !important;
        }

        td[class="logo"]{
          text-align: left;
          padding: 20px 0 20px 0 !important;
        }

        td[class="logo"] img{
          margin:0 auto!important;
        }

        td[class="mobile-hide"]{
          display:none;}

        img[class="mobile-hide"]{
          display: none !important;
        }

        img[class="img-max"]{
          max-width: 100% !important;
          height:auto !important;
        }

        table[class="responsive-table"]{
          width:100%!important;
        }

        td[class="padding"]{
          padding: 10px 5% 15px 5% !important;
        }

        td[class="padding-copy"]{
          padding: 10px 5% 10px 5% !important;
          text-align: center;
        }

        td[class="padding-meta"]{
          padding: 30px 5% 0px 5% !important;
          text-align: center;
        }

        td[class="no-pad"]{
          padding: 0 0 20px 0 !important;
        }

        td[class="no-padding"]{
          padding: 0 !important;
        }

        td[class="section-padding"]{
          padding: 50px 15px 50px 15px !important;
        }

        td[class="section-padding-bottom-image"]{
          padding: 50px 15px 0 15px !important;
        }

        td[class="mobile-wrapper"]{
            padding: 10px 5% 15px 5% !important;
        }

        table[class="mobile-button-container"]{
            margin:0 auto;
            width:100% !important;
        }

        a[class="mobile-button"]{
            width:80% !important;
            padding: 15px !important;
            border: 0 !important;
            font-size: 16px !important;
        }

    }
    @media (max-width:550px) {
        .starter-vid {
            height: 190px;
        }
    }
</style>
</head>
<body style="margin: 0; padding: 0;">

<!-- HEADER -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#373a47">
            <div align="center" style="padding: 0px 15px 0px 15px;">
                <table border="0" cellpadding="0" cellspacing="0" width="500" class="wrapper">
                    <!-- LOGO/PREHEADER TEXT -->
                    <tr>
                        <td style="padding: 20px 0px 30px 0px;" class="logo">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td bgcolor="#373a47" width="100" align="left"><a href="http://joepodium.com" target="_blank"><img alt="Logo" src="http://173.254.28.46/~joepodiu/img/email/logo.png" width="52" height="auto" style="display: block; font-family: Helvetica, Arial, sans-serif; color: #666666; font-size: 16px;" border="0"></a></td>
                                    <td bgcolor="#373a47" width="400" align="right" class="mobile-hide">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="right" style="padding: 20px 0 0 0; font-size: 14px; font-family: Arial, sans-serif; color: #FFFCE1; text-decoration: none;"><span style="color: #FFFCE1; text-decoration: none;">JoePodium.com<br>Freedom of Speech Matters.</span></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </td>
    </tr>
</table>

<!-- ONE COLUMN SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#FFFCE1" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table">
                <tr>
                    <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>
                                    <!-- HERO IMAGE -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tbody>
                                             <tr>
                                                  <td class="padding-copy">
                                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                          <tr>
                                                              <td style="position: relative;">
                                                                <a target="_blank" href="{{LINK}}"><!-- LINK TO TOPIC OF DISCUSSION -->
                                                                  <!-- <iframe id="postVid" class="starter-vid" width="100%" height="280" src="https://www.youtube.com/embed/0JsiGQMMoe4?enablejsapi=1&amp;amp;wmode=opaque&amp;amp;hd=1&amp;amp;rel=0&amp;amp;autohide=1&amp;amp;showinfo=0amp;origin=file://localhost/" frameborder="0" allowfullscreen=""> 
                                                                    </iframe> -->
                                                                    <!--  USE THIS FOR YOUTUBE THUMBNAIL Below -->
                                                                    <!-- <img style="max-width:100%; height: auto;" src="http://img.youtube.com/vi/0JsiGQMMoe4/0.jpg"> -->

                                                                    <!-- VIDEO PLACEHOLDER IMAGE Replace with youtube thumbnail above-->
                                                                    <img style="max-width:100%; height: auto;" src="{{THUMBNAIL}}">
                                                                    
                                                                    <!--KEEP playbutton for fake video display absolute to relative wrap-->
                                                                    <img src="http://173.254.28.46/~joepodiu/img/email/playbtn.png" style="max-width: 50px; position: absolute; left: 50%; margin-left: -25px;
                                                                    top:50%; margin-top: -25px;
                                                                    "> 
                                                                </a>   
                                                              </td>
                                                            </tr>
                                                       </table>
                                                  </td>
                                              </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!-- COPY -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 30px;" class="padding-copy">Congrats {{USER}}!</td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy"> Your video has <strong>won</strong> the contest in category "{{CATEGORY}}" at <strong>Joe Podium's Contest Web App.</strong>Start your topic manually with your verification code: {{VCODE}}.  Please submit your topic starter video ASAP!  This means your get to lead the conversation!</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!-- BULLETPROOF BUTTON -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center" style="padding: 25px 0 0 0;" class="padding-copy">
                                                <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                    <tr>
                                                        <td align="center"><a href="{{URL}}" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #373a47; border-top: 15px solid #373a47; border-bottom: 15px solid #373a47; border-left: 25px solid #373a47; border-right: 25px solid #373a47; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Start a Topic</a></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- ONE COLUMN W/ BOTTOM IMAGE SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#FFFCE1" align="center" style="padding: 70px 15px 0 15px;" class="section-padding-bottom-image">
            <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table">
                <tr>
                    <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>
                                    <!-- COPY -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333;" class="padding-copy">Multiply your YouTube views, collect revenue, and build your following!</td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">
                                                We all have the need to express ourselfs in these crazy times.  We are interested in hearing your Joe Podium success stories and would love for you to share them with us.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!-- BULLETPROOF BUTTON -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center" style="padding:25px 0 0 0;" class="padding-copy">
                                                <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                    <tr>
                                                        <td align="center"><a href="http://www.facebook.com/plugins/like.
                                                        php?href=http://facebook.com/joepodium&amp;layout=standard&amp;show_faces=
                                                        false&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=427%20" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #373a47; border-top: 15px solid #373a47; border-bottom: 15px solid #373a47; border-left: 25px solid #373a47; border-right: 25px solid #373a47; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Like Us On Facebook</a></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!--  BOTTOM IMAGE -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td style="padding: 20px 0 0 0;" align="center">
                                                <a href="" target="_blank"><img src="http://173.254.28.46/~joepodiu/img/email/line-graph.jpg" width="500" height="180" border="0" alt="Mobile opens are on the rise" class="img-max" style="display: block; padding: 0; font-family: Helvetica, Arial, sans-serif; color: #666666; width: 500px; height: 180px;"></a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- TWO COLUMN SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#FFFCE1" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table">
                <tr>
                    <td>
                        <!-- TITLE SECTION AND COPY -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333;" class="padding-copy">Topics</td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0 20px 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy"> Your have won one topic now it time to try another! </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <!-- TWO COLUMNS -->
                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td valign="top" style="padding: 0;" class="mobile-wrapper">
                                    <!-- LEFT COLUMN -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="47%" align="left" class="responsive-table">
                                        <tr>
                                            <td style="padding: 20px 0 40px 0;">
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#FFFCE1" valign="middle"><a href="http://www.joepodium.com/topic.html?topic=Politics" target="_blank"><img src="http://173.254.28.46/~joepodiu/img/email/politics.jpg" width="240" height="130" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 13px; width: 240px; height: 130px;" alt="Fluid images" border="0" class="img-max"></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 15px 0 0 0; font-family: Arial, sans-serif; color: #333333; font-size: 20px;" bgcolor="#FFFCE1">POLITICS</td>
                                                    </tr> 
                                                    <tr>
                                                        <td align="center" style="padding: 5px 0 0 0; font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 20px;" bgcolor="#FFFCE1"><span class="appleBody">Tell Us how you really feel. Rebuild the world!</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- RIGHT COLUMN -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="47%" align="right" class="responsive-table">
                                        <tr>
                                            <td style="padding: 20px 0 40px 0;">
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#FFFCE1" valign="middle"><a href="http://www.joepodium.com/topic.html?topic=Family" target="_blank"><img src="http://173.254.28.46/~joepodiu/img/email/family.jpg" width="240" height="130" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 13px; width: 240px; height: 130px;" alt="Fluid structures" border="0" class="img-max"></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 15px 0 0 0; font-family: Arial, sans-serif; color: #333333; font-size: 20px;" bgcolor="#FFFCE1">FAMILY</td>
                                                    </tr>  
                                                    <tr>
                                                        <td align="center" style="padding: 5px 0 0 0; font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 20px;" bgcolor="#FFFCE1"><span class="appleBody">A place for friends, family and teams to compete.</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <!-- TWO COLUMNS -->
                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td valign="top" style="padding: 0;" class="mobile-wrapper">
                                    <!-- LEFT COLUMN -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="47%" align="left" class="responsive-table">
                                        <tr>
                                            <td style="padding: 20px 0 40px 0;">
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#FFFCE1" valign="middle"><a href="http://www.joepodium.com/topic.html?topic=Fun" target="_blank"><img src="http://173.254.28.46/~joepodiu/img/email/turntup.jpg" width="240" height="130" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 13px; width: 240px; height: 130px;" alt="Media queries" border="0" class="img-max"></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 15px 0 0 0; font-family: Arial, sans-serif; color: #333333; font-size: 20px;" bgcolor="#FFFCE1">FUN</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 5px 0 0 0; font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 20px;" bgcolor="#FFFCE1"><span class="appleBody">Get turn't Up and lets do this! *Anything Goes&hellip;</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- RIGHT COLUMN -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="47%" align="right" class="responsive-table">
                                        <tr>
                                            <td style="padding: 20px 0 40px 0;">
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#FFFCE1" valign="middle"><a href="http://www.joepodium.com/topic.html?topic=Sports" target="_blank"><img src="http://173.254.28.46/~joepodiu/img/email/sportsbtn.jpg" width="240" height="130" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 13px; width: 240px; height: 130px;" alt="Bulletproof buttons" border="0" class="img-max"></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 15px 0 0 0; font-family: Arial, sans-serif; color: #333333; font-size: 20px;" bgcolor="#FFFCE1">SPORTS</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 5px 0 0 0; font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 20px;" bgcolor="#FFFCE1"><span class="appleBody">Whats your thoughts on this player? A Make or Break?</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!-- BULLETPROOF BUTTON -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center" style="padding:25px 0 0 0;" class="padding-copy">
                                                <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                    <tr>
                                                        <td align="center"><a href="http://www.joepodium.com/leaderboard" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #373a47; border-top: 15px solid #373a47; border-bottom: 15px solid #373a47; border-left: 25px solid #373a47; border-right: 25px solid #373a47; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">View Leader Board</a></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>


<!-- COMPACT ARTICLE SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#FFFCE1" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="500" style="padding:0 0 20px 0;" class="responsive-table">
                <!-- TITLE -->
                <tr>
                    <td align="left" style="padding: 0 0 10px 130px; font-size: 25px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #333333;" class="padding-copy" colspan="2">First Time?</td>
                </tr>
                <tr>
                    <td valign="top" style="padding: 40px 0 0 0;" class="mobile-hide"><img src="http://173.254.28.46/~joepodiu/img/email/icons/microphone.png" alt="Litmus" width="105" height="105" border="0" style="display: block; font-family: Arial; color: #666666; font-size: 14px; width: 105px; height: 105px;"></td>
                    <td style="padding: 40px 0 0 0;" class="no-padding">
                        <!-- ARTICLE -->
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #aaaaaa;" class="padding-meta">Our Purpose</td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #333333;" class="padding-copy">A growing community of people who are ready to speak out.</td>
                            </tr>
                            <tr>
                                 <td align="left" style="padding: 10px 0 15px 25px; font-size: 16px; line-height: 24px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">Share your knowledge and opinions about a topic while learning different views from various areas of the globe.</td>
                            </tr>
                            <tr>
                                <td style="padding:0 0 45px 25px;" align="left" class="padding">
                                    <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center">
                                                <!-- BULLETPROOF BUTTON -->
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                                    <tr>
                                                        <td align="center" style="padding: 0;" class="padding-copy">
                                                            <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                                <tr>
                                                                    <td align="center"><a href="http://www.joepodium.com/contact#about" target="_blank" style="font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #DE564B; border-top: 10px solid #DE564B; border-bottom: 10px solid #DE564B; border-left: 20px solid #DE564B; border-right: 20px solid #DE564B; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Learn More &rarr;</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td valign="top" style="padding: 40px 0 0 0;" class="mobile-hide"><img src="http://173.254.28.46/~joepodiu/img/email/icons/flag.png" alt="Freddie!" width="105" height="105" border="0" style="display: block; font-family: Arial; color: #666666; font-size: 14px; width: 105px; height: 105px;"></td>
                    <td style="padding: 40px 0 0 0;" class="no-padding">
                        <!-- ARTICLE -->
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #aaaaaa;" class="padding-meta">How does it work?</td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #333333;" class="padding-copy">"The Winner" of the previous lottery starts a topic by posting a video</td>
                            </tr>
                            <tr>
                                 <td align="left" style="padding: 10px 0 15px 25px; font-size: 16px; line-height: 24px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">"The Winner" then sets a number of people who will get to signup then compete as responders for the next opprotunity to win the Joe Podium lottery.  If selected, you will get to become the next "The Winner" who then sets the topic of focus!</td>
                            </tr>
                            <tr>
                                <td style="padding:0 0 45px 25px;" align="left" class="padding">
                                    <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center">
                                                <!-- BULLETPROOF BUTTON -->
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                                    <tr>
                                                        <td align="center" style="padding: 0;" class="padding-copy">
                                                            <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                                <tr>
                                                                    <td align="center"><a href="http://www.joepodium.com/contact#about" target="_blank" style="font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #8FB98B; border-top: 10px solid #8FB98B; border-bottom: 10px solid #8FB98B; border-left: 20px solid #8FB98B; border-right: 20px solid #8FB98B; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Guidelines &rarr;</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td valign="top" style="padding: 40px 0 0 0;" class="mobile-hide"><img src="http://173.254.28.46/~joepodiu/img/email/icons/speech.png" alt="Campaign Monitor" width="105" height="105" border="0" style="display: block; font-family: Arial; color: #666666; font-size: 14px; width: 105px; height: 105px;"></td>
                    <td style="padding: 40px 0 0 0;" class="no-padding">
                        <!-- ARTICLE -->
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #aaaaaa;" class="padding-meta">Share on Social Media</td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #333333;" class="padding-copy">Getting your friends involved!</td>
                            </tr>
                            <tr>
                                 <td align="left" style="padding: 10px 0 15px 25px; font-size: 16px; line-height: 24px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">We have the ability to make this web app something extremely fun! Please share the JoePodium experience on all your social media sites to help us grow!</td>
                            </tr>
                            <tr>
                                <td style="padding:0 0 45px 25px;" align="left" class="padding">
                                    <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center">
                                                <!-- BULLETPROOF BUTTON -->
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                                    <tr>
                                                        <td align="center" style="padding: 0;" class="padding-copy">
                                                            <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                                <tr>
                                                                    <td align="center"><a href="https://www.facebook.com/sharer/sharer.php?u=https://joepodiumapi.herokuapp.com/#signup" target="_blank" style="margin-bottom: 20px; min-width: 100px;font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #4e69a2; border-top: 10px solid #4e69a2; border-bottom: 10px solid #4e69a2; border-left: 20px solid #4e69a2; border-right: 20px solid #4e69a2; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Facebook</a></td>
                                                                    
                                                                </tr>
                                                                <tr>
                                                                    <td align="center"><a href="https://twitter.com/intent/tweet?text=@joepodium%20-%20Signup%20for%20Uncensored%27s%20Response%20in%20a%20Censored%20World%20%20https://joepodiumapi.herokuapp.com/#signup" target="_blank" style="margin-bottom: 20px; min-width: 100px; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #55acee; border-top: 10px solid #55acee; border-bottom: 10px solid #55acee; border-left: 20px solid #55acee; border-right: 20px solid #55acee; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Twitter</a></td>
                                                                    
                                                                </tr>
                                                                <tr>
                                                                    <td align="center"><a href="https://plus.google.com/share?url=https://joepodiumapi.herokuapp.com/#signup?sgp=1" target="_blank" style="margin-bottom: 20px; min-width: 100px; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #53A93F; border-top: 10px solid #53A93F; border-bottom: 10px solid #53A93F; border-left: 20px solid #53A93F; border-right: 20px solid #53A93F; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Google</a></td>
                                                                    
                                                                </tr>
                                                                <tr>
                                                                    <td align="center"><a href="mailto:?subject=Signup for Joe Podium&body=Uncensored Response in a Censored World Signup Now https://joepodiumapi.herokuapp.com/#signup" target="_blank" style="min-width: 100px; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #373a47; border-top: 10px solid #373a47; border-bottom: 10px solid #373a47; border-left: 20px solid #373a47; border-right: 20px solid #373a47; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Email</a></td>
                                                                    
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- FOOTER -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#373a47" align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                    <td style="padding: 20px 0px 20px 0px;">
                        <!-- UNSUBSCRIBE COPY -->
                        <table width="500" border="0" cellspacing="0" cellpadding="0" align="center" class="responsive-table">
                            <tr>
                                <td align="center" valign="middle" style="font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;">
                                    <span class="appleFooter" style="color:#FFFCE1;">6267 County Lane 299, Carl Junction, MA 64834, USA</span><br><a class="original-only" style="color: #FFFCE1; text-decoration: none;">Unsubscribe</a><span class="original-only" style="font-family: Arial, sans-serif; font-size: 12px; color: #FFFCE1;">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span><a href="joepodium.com" style="color: #FFFCE1; text-decoration: none;"> Freedom of Speech Matters - JoePodium.com</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</body>
</html>

		*/
	});	
	return myString.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
}

function getTemplate_Responder() {
	var myString = (function () {
		/*
		<!DOCTYPE html>
<html lang="en">
<head>
<title>Joe Podium | Lottery Contestant</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<style type="text/css">
    #outlook a{padding:0;} 
    .ReadMsgBody{width:100%;} .ExternalClass{width:100%;}
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} 
    body, table, td, a{-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;} 
    table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} 
    img{-ms-interpolation-mode:bicubic;}

    body{margin:0; padding:0;}
    img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;}
    table{border-collapse:collapse !important;}
    body{height:100% !important; margin:0; padding:0; width:100% !important;}

    .appleBody a {color:#68440a; text-decoration: none;}
    .appleFooter a {color:#999999; text-decoration: none;}

    @media screen and (max-width: 525px) {

        table[class="wrapper"]{
          width:100% !important;
        }

        td[class="logo"]{
          text-align: left;
          padding: 20px 0 20px 0 !important;
        }

        td[class="logo"] img{
          margin:0 auto!important;
        }

        td[class="mobile-hide"]{
          display:none;}

        img[class="mobile-hide"]{
          display: none !important;
        }

        img[class="img-max"]{
          max-width: 100% !important;
          height:auto !important;
        }

        table[class="responsive-table"]{
          width:100%!important;
        }

        td[class="padding"]{
          padding: 10px 5% 15px 5% !important;
        }

        td[class="padding-copy"]{
          padding: 10px 5% 10px 5% !important;
          text-align: center;
        }

        td[class="padding-meta"]{
          padding: 30px 5% 0px 5% !important;
          text-align: center;
        }

        td[class="no-pad"]{
          padding: 0 0 20px 0 !important;
        }

        td[class="no-padding"]{
          padding: 0 !important;
        }

        td[class="section-padding"]{
          padding: 50px 15px 50px 15px !important;
        }

        td[class="section-padding-bottom-image"]{
          padding: 50px 15px 0 15px !important;
        }

        td[class="mobile-wrapper"]{
            padding: 10px 5% 15px 5% !important;
        }

        table[class="mobile-button-container"]{
            margin:0 auto;
            width:100% !important;
        }

        a[class="mobile-button"]{
            width:80% !important;
            padding: 15px !important;
            border: 0 !important;
            font-size: 16px !important;
        }

    }
    @media (max-width:550px) {
        .starter-vid {
            height: 190px;
        }
    }
    .video-overlay {
        height: 290px;
        display: table;
    }
    .playbtn {
        display: table-cell;
        vertical-align: middle;
    }
</style>
</head>
<body style="margin: 0; padding: 0;">

<!-- HEADER -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#373a47">
            <div align="center" style="padding: 0px 15px 0px 15px;">
                <table border="0" cellpadding="0" cellspacing="0" width="500" class="wrapper">
                    <!-- LOGO/PREHEADER TEXT -->
                    <tr>
                        <td style="padding: 20px 0px 30px 0px;" class="logo">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td bgcolor="#373a47" width="100" align="left"><a href="http://joepodium.com" target="_blank"><img alt="Logo" src="http://www.joepodium.com/img/email/logo.png" width="52" height="auto" style="display: block; font-family: Helvetica, Arial, sans-serif; color: #666666; font-size: 16px;" border="0"></a></td>
                                    <td bgcolor="#373a47" width="400" align="right" class="mobile-hide">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="right" style="padding: 20px 0 0 0; font-size: 14px; font-family: Arial, sans-serif; color: #FFFCE1; text-decoration: none;"><span style="color: #FFFCE1; text-decoration: none;">JoePodium.com<br>Freedom of Speech LIVES.</span></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </td>
    </tr>
</table>

<!-- ONE COLUMN SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#FFFCE1" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table">
                <tr>
                    <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>
                                    <!-- HERO IMAGE -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tbody>
                                             <tr>
                                                  <td class="padding-copy">
                                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                          <tr>
                                                              <td style="position: relative; overflow: hidden;">
                                                                    <a target="_blank" href="{{LINK}}"><!-- LINK TO TOPIC OF DISCUSSION -->
                                                                      <!-- LINK TO TOPIC OF DISCUSSION -->
                                                                      
                                                                      <!-- <iframe id="postVid" class="starter-vid" width="100%" height="280" src="https://www.youtube.com/embed/0JsiGQMMoe4?enablejsapi=1&amp;amp;wmode=opaque&amp;amp;hd=1&amp;amp;rel=0&amp;amp;autohide=1&amp;amp;showinfo=0amp;origin=file://localhost/" frameborder="0" allowfullscreen=""> 
                                                                        </iframe> -->
                                                                        <!--  USE THIS FOR YOUTUBE THUMBNAIL Below -->
                                                                        <!-- <img style="max-width:100%; height: auto;" src="http://img.youtube.com/vi/0JsiGQMMoe4/0.jpg"> -->

                                                                        <!-- VIDEO PLACEHOLDER IMAGE Replace with youtube thumbnail above-->
                                                                        <img style="max-width:100%; height: auto;" src="{{THUMBNAIL}}">
                                                                        
                                                                        <!--KEEP playbutton for fake video display absolute to relative wrap-->
                                                                        <img src="http://www.joepodium.com/img/email/playbtn.png" style="max-width: 50px; position: absolute; left: 50%; margin-left: -25px;
                                                                        top:50%; margin-top: -25px;
                                                                        "> 
                                                                    </a>
                                                                 </td>
                                                            </tr>
                                                       </table>
                                                  </td>
                                              </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!-- COPY -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 30px;" class="padding-copy">Congrats {{USER}}!</td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy"> You have been selected to participate in the category "{{CATEGORY}}" about "{{WINNER}}" video at <strong>Joe Podium's Contest Web App.</strong> Give your response manually with your verification code: {{VCODE}}.   Please submit your response video ASAP!  We are rooting for you to win!</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!-- BULLETPROOF BUTTON -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center" style="padding: 25px 0 0 0;" class="padding-copy">
                                                <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                    <tr>
                                                        <td align="center"><a href="{{URL}}" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #373a47; border-top: 15px solid #373a47; border-bottom: 15px solid #373a47; border-left: 25px solid #373a47; border-right: 25px solid #373a47; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Give Response</a></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- ONE COLUMN W/ BOTTOM IMAGE SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#FFFCE1" align="center" style="padding: 70px 15px 0 15px;" class="section-padding-bottom-image">
            <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table">
                <tr>
                    <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>
                                    <!-- COPY -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333;" class="padding-copy">Multiply your YouTube views, collect revenue, and build your following!</td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">
                                                We all have the need to express ourselfs in these crazy times.  Why not have fun and make money from montizing your videos.  We are interested in hearing your Joe Podium success stories and would love for you to share them with us.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!-- BULLETPROOF BUTTON -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center" style="padding:25px 0 0 0;" class="padding-copy">
                                                <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                    <tr>
                                                        <td align="center"><a href="http://www.facebook.com/plugins/like.
                                                        php?href=http://facebook.com/joepodium&amp;layout=standard&amp;show_faces=
                                                        false&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=427%20" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #373a47; border-top: 15px solid #373a47; border-bottom: 15px solid #373a47; border-left: 25px solid #373a47; border-right: 25px solid #373a47; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Like Us On Facebook</a></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!--  BOTTOM IMAGE -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td style="padding: 20px 0 0 0;" align="center">
                                                <a href="#" target="_blank"><img src="http://www.joepodium.com/img/email/line-graph.jpg" width="500" height="180" border="0" alt="Mobile opens are on the rise" class="img-max" style="display: block; padding: 0; font-family: Helvetica, Arial, sans-serif; color: #666666; width: 500px; height: 180px;"></a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- TWO COLUMN SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#FFFCE1" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table">
                <tr>
                    <td>
                        <!-- TITLE SECTION AND COPY -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333;" class="padding-copy">Recent Topics</td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 0 20px 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">The past week's winners.</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <!-- TWO COLUMNS -->
                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td valign="top" style="padding: 0;" class="mobile-wrapper">
                                    <!-- LEFT COLUMN -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="47%" align="left" class="responsive-table">
                                        <tr>
                                            <td style="padding: 20px 0 40px 0;">
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#FFFCE1" valign="middle"><a href="http://www.joepodium.com/topic.html?topic=Politics" target="_blank"><img src="http://www.joepodium.com/img/email/politics.jpg" width="240" height="130" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 13px; width: 240px; height: 130px;" alt="Fluid images" border="0" class="img-max"></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 15px 0 0 0; font-family: Arial, sans-serif; color: #333333; font-size: 20px;" bgcolor="#FFFCE1">POLITICS</td>
                                                    </tr>                                      
                                                    <tr>
                                                        <td align="center" style="padding: 5px 0 0 0; font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 20px;" bgcolor="#FFFCE1"><span class="appleBody">Tell Us how you really feel. Rebuild the world!</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- RIGHT COLUMN -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="47%" align="right" class="responsive-table">
                                        <tr>
                                            <td style="padding: 20px 0 40px 0;">
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#FFFCE1" valign="middle"><a href="http://www.joepodium.com/topic.html?topic=Family" target="_blank"><img src="http://www.joepodium.com/img/email/family.jpg" width="240" height="130" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 13px; width: 240px; height: 130px;" alt="Fluid structures" border="0" class="img-max"></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 15px 0 0 0; font-family: Arial, sans-serif; color: #333333; font-size: 20px;" bgcolor="#FFFCE1">FAMILY</td>
                                                    </tr> 
                                                    <tr>
                                                        <td align="center" style="padding: 5px 0 0 0; font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 20px;" bgcolor="#FFFCE1"><span class="appleBody">A place for friends, family and teams to compete.</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <!-- TWO COLUMNS -->
                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td valign="top" style="padding: 0;" class="mobile-wrapper">
                                    <!-- LEFT COLUMN -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="47%" align="left" class="responsive-table">
                                        <tr>
                                            <td style="padding: 20px 0 40px 0;">
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#FFFCE1" valign="middle"><a href="http://www.joepodium.com/topic.html?topic=Fun" target="_blank"><img src="http://www.joepodium.com/img/email/turntup.jpg" width="240" height="130" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 13px; width: 240px; height: 130px;" alt="Media queries" border="0" class="img-max"></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 15px 0 0 0; font-family: Arial, sans-serif; color: #333333; font-size: 20px;" bgcolor="#FFFCE1">FUN</td>
                                                    </tr> 
                                                    <tr>
                                                        <td align="center" style="padding: 5px 0 0 0; font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 20px;" bgcolor="#FFFCE1"><span class="appleBody">Get turn't Up and lets do this! *Anything Goes&hellip;</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- RIGHT COLUMN -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="47%" align="right" class="responsive-table">
                                        <tr>
                                            <td style="padding: 20px 0 40px 0;">
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#FFFCE1" valign="middle"><a href="http://www.joepodium.com/topic.html?topic=Sports" target="_blank"><img src="http://www.joepodium.com/img/email/sportsbtn.jpg" width="240" height="130" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 13px; width: 240px; height: 130px;" alt="Bulletproof buttons" border="0" class="img-max"></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 15px 0 0 0; font-family: Arial, sans-serif; color: #333333; font-size: 20px;" bgcolor="#FFFCE1">SPORTS</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="padding: 5px 0 0 0; font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 20px;" bgcolor="#FFFCE1"><span class="appleBody">Whats your thoughts on this player? A Make or Break?</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!-- BULLETPROOF BUTTON -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center" style="padding:25px 0 0 0;" class="padding-copy">
                                                <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                    <tr>
                                                        <td align="center"><a href="http://joepodium.com/leaderboard" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #373a47; border-top: 15px solid #373a47; border-bottom: 15px solid #373a47; border-left: 25px solid #373a47; border-right: 25px solid #373a47; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">View Leader Board</a></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>


<!-- COMPACT ARTICLE SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#FFFCE1" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="500" style="padding:0 0 20px 0;" class="responsive-table">
                <!-- TITLE -->
                <tr>
                    <td align="left" style="padding: 0 0 10px 130px; font-size: 25px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #333333;" class="padding-copy" colspan="2">First Time?</td>
                </tr>
                <tr>
                    <td valign="top" style="padding: 40px 0 0 0;" class="mobile-hide"><img src="http://www.joepodium.com/img/email/icons/microphone.png" alt="Litmus" width="105" height="105" border="0" style="display: block; font-family: Arial; color: #666666; font-size: 14px; width: 105px; height: 105px;"></td>
                    <td style="padding: 40px 0 0 0;" class="no-padding">
                        <!-- ARTICLE -->
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #aaaaaa;" class="padding-meta">Our Purpose</td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #333333;" class="padding-copy">A growing community of people who are ready to speak out.</td>
                            </tr>
                            <tr>
                                 <td align="left" style="padding: 10px 0 15px 25px; font-size: 16px; line-height: 24px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">Share your knowledge and opinions about a topic while learning different views from various areas of the globe.</td>
                            </tr>
                            <tr>
                                <td style="padding:0 0 45px 25px;" align="left" class="padding">
                                    <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center">
                                                <!-- BULLETPROOF BUTTON -->
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                                    <tr>
                                                        <td align="center" style="padding: 0;" class="padding-copy">
                                                            <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                                <tr>
                                                                    <td align="center"><a href="http://www.joepodium.com/contact#about" target="_blank" style="font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #DE564B; border-top: 10px solid #DE564B; border-bottom: 10px solid #DE564B; border-left: 20px solid #DE564B; border-right: 20px solid #DE564B; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Learn More &rarr;</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td valign="top" style="padding: 40px 0 0 0;" class="mobile-hide"><img src="http://www.joepodium.com/img/email/icons/flag.png" alt="Freddie!" width="105" height="105" border="0" style="display: block; font-family: Arial; color: #666666; font-size: 14px; width: 105px; height: 105px;"></td>
                    <td style="padding: 40px 0 0 0;" class="no-padding">
                        <!-- ARTICLE -->
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #aaaaaa;" class="padding-meta">How does it work?</td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #333333;" class="padding-copy">"The Responders" - A group of people speaking on a topic set by the "The Winner's Topic"</td>
                            </tr>
                            <tr>
                                 <td align="left" style="padding: 10px 0 15px 25px; font-size: 16px; line-height: 24px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">"The Responders" of the topic get the opprotunity to express their thoughts and opions while competing to get the most views. </td>
                            </tr>
                            <tr>
                                <td style="padding:0 0 45px 25px;" align="left" class="padding">
                                    <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center">
                                                <!-- BULLETPROOF BUTTON -->
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                                    <tr>
                                                        <td align="center" style="padding: 0;" class="padding-copy">
                                                            <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                                <tr>
                                                                    <td align="center"><a href="http://www.joepodium.com/contact#about" target="_blank" style="font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #8FB98B; border-top: 10px solid #8FB98B; border-bottom: 10px solid #8FB98B; border-left: 20px solid #8FB98B; border-right: 20px solid #8FB98B; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Guidelines &rarr;</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td valign="top" style="padding: 40px 0 0 0;" class="mobile-hide"><img src="http://www.joepodium.com/img/email/icons/speech.png" alt="Campaign Monitor" width="105" height="105" border="0" style="display: block; font-family: Arial; color: #666666; font-size: 14px; width: 105px; height: 105px;"></td>
                    <td style="padding: 40px 0 0 0;" class="no-padding">
                        <!-- ARTICLE -->
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #aaaaaa;" class="padding-meta">Share on Social Media</td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 0 0 5px 25px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #333333;" class="padding-copy">Getting your friends involved!</td>
                            </tr>
                            <tr>
                                 <td align="left" style="padding: 10px 0 15px 25px; font-size: 16px; line-height: 24px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">We have the ability to make this web app something extremely fun! Please share the JoePodium experience on all your social media sites to help us grow!</td>
                            </tr>
                            <tr>
                                <td style="padding:0 0 45px 25px;" align="left" class="padding">
                                    <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                        <tr>
                                            <td align="center">
                                                <!-- BULLETPROOF BUTTON -->
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                                    <tr>
                                                        <td align="center" style="padding: 0;" class="padding-copy">
                                                            <table border="0" cellspacing="0" cellpadding="0" class="responsive-table">
                                                                <tr>
                                                                    <td align="center"><a href="https://www.facebook.com/sharer/sharer.php?u=https://joepodiumapi.herokuapp.com/#signup" target="_blank" style="margin-bottom: 20px; min-width: 100px;font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #4e69a2; border-top: 10px solid #4e69a2; border-bottom: 10px solid #4e69a2; border-left: 20px solid #4e69a2; border-right: 20px solid #4e69a2; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Facebook</a></td>
                                                                    
                                                                </tr>
                                                                <tr>
                                                                    <td align="center"><a href="https://twitter.com/intent/tweet?text=@joepodium%20-%20Signup%20for%20Uncensored%27s%20Response%20in%20a%20Censored%20World%20%20https://joepodiumapi.herokuapp.com/#signup" target="_blank" style="margin-bottom: 20px; min-width: 100px; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #55acee; border-top: 10px solid #55acee; border-bottom: 10px solid #55acee; border-left: 20px solid #55acee; border-right: 20px solid #55acee; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Twitter</a></td>
                                                                    
                                                                </tr>
                                                                <tr>
                                                                    <td align="center"><a href="https://plus.google.com/share?url=https://joepodiumapi.herokuapp.com/#signup?sgp=1" target="_blank" style="margin-bottom: 20px; min-width: 100px; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #53A93F; border-top: 10px solid #53A93F; border-bottom: 10px solid #53A93F; border-left: 20px solid #53A93F; border-right: 20px solid #53A93F; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Google</a></td>
                                                                    
                                                                </tr>
                                                                <tr>
                                                                    <td align="center"><a href="mailto:?subject=Signup for Joe Podium&body=Uncensored Response in a Censored World Signup Now https://joepodiumapi.herokuapp.com/#signup" target="_blank" style="min-width: 100px; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #373a47; border-top: 10px solid #373a47; border-bottom: 10px solid #373a47; border-left: 20px solid #373a47; border-right: 20px solid #373a47; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button">Email</a></td>
                                                                    
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- FOOTER -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#373a47" align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                    <td style="padding: 20px 0px 20px 0px;">
                        <!-- UNSUBSCRIBE COPY -->
                        <table width="500" border="0" cellspacing="0" cellpadding="0" align="center" class="responsive-table">
                            <tr>
                                <td align="center" valign="middle" style="font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;">
                                    <span class="appleFooter" style="color:#FFFCE1;">6267 County Lane 299, Carl Junction, MA 64834, USA</span><br><a class="original-only" style="color: #FFFCE1; text-decoration: none;">Unsubscribe</a><span class="original-only" style="font-family: Arial, sans-serif; font-size: 12px; color: #FFFCE1;">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span><a href="joepodium.com" style="color: #FFFCE1; text-decoration: none;"> Freedom of Speech Matters - JoePodium.com</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</body>
</html>

		*/
	});	
	return myString.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
}

function formatMessage_PostAdmin(template, data) {
	var msg = template.replace('{{CATEGORY}}', data.category);
	msg = msg.replace('{{URL}}', 'http://www.joepodium.com/admin-login.html?email=' + data.email + '&vc=' + data.verification_code);
	return msg.replace('{{VCODE}}', data.verification_code).replace('{{USER}}', data.email).replace('{{LINK}}}', data.link).replace('{{THUMBNAIL}}', data.thumbnail);
}

function formatMessage_Responder(template, data) {
	var msg = template.replace('{{CATEGORY}}', data.category).replace('{{WINNER}}', data.winner);
	msg = msg.replace('{{URL}}', 'http://www.joepodium.com/login.html?email=' + data.email + '&vc=' + data.verification_code);
	return msg.replace('{{VCODE}}', data.verification_code).replace('{{USER}}', data.email).replace('{{LINK}}}', data.link).replace('{{THUMBNAIL}}', data.thumbnail);
}