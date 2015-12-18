var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var TopicController = require('../controllers/TopicController');
var youtube = require('../controllers/YouTubeController');
var EmailController = require('../controllers/EmailController');

router.post('/responder-video', function(req, res){
	auth.validateSession(req.headers.token, req.headers.nonce,
	function(response) {
		TopicController.accessTopic_Responder(req.body.email, req.body.verification_code, function(rslt) {
			if (rslt.status != null) {
				var topic = rslt.data;
				topic.responders[rslt.index].youtube_id = req.body.id;
				TopicController.saveTopic(topic, function(rslt2) {
					res.json(rslt2);
				});
			} else {
				res.json(rslt);
			}
		});
	},
	function(error) {
		res.json({'status': 'error', 'rslt': 'Error validating session.'});
	});	
});

router.post('/post-video', function(req, res){
	console.log('updating starter video.');
	auth.validateSession(req.headers.token, req.headers.nonce,
	function(response) {
		youtube.checkVideoDuration(req.body.id, 20, function(duration_data) {
			if (duration_data.status == 'success') {
				TopicController.accessTopic_PostAdmin(req.body.email, req.body.verification_code, function(rslt) {
					if (rslt.status != null) {
						var topic = rslt.data;
						topic.post_admin.youtube_id = req.body.id;
						if (req.body.max_responders != null) {
							topic.max_responders = req.body.max_responders;
						} else {
							if (topic.max_responders == 0) {
								topic.max_responders = 10;
							}
						}
						if (req.body.max_duration != null) {
							topic.max_duration = req.body.max_duration;
						} else {
							if (topic.max_duration == 0) {
								topic.max_duration = 5;
							}
						}
						if (topic.responders_notified) {
							TopicController.saveTopic(topic, function(rslt2) {
								res.json(rslt2);
							});
						} else {
							EmailController.notifyPostResponders(topic, function(rslt2) {
								if (rslt2.status == "success") {
									topic.responders_notified = true;
									TopicController.saveTopic(topic, function(rslt3) {
										res.json(rslt3);
									});
								} else {
									res.json(rslt2);
								}
							});	
						}
					} else {
						res.json(rslt);
					}
				});
			} else {
				res.json(duration_data);
			}
		});				
	},
	function(error) {
		res.json({'status': 'error', 'rslt': 'Error validating session.'});
	});	
});

module.exports = router;