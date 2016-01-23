var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var __ = require('underscore');
var TopicSessionController = require('../controllers/TopicSessionController');

router.post('/restart_topic', function(req, res){
	try {
		console.log('validation restart');
		auth.validateSession(req.headers.token, req.headers.nonce,
		function(response) {
			console.log('validated properly');
			if (req.body.topic == null) {
				res.json({'status': 'error', 'rslt': 'Topic Not Selected'});
			} else if (req.body.starter == null) {
				res.json({'status': 'error', 'rslt': 'Topic Starter Not Selected'});
			} else {
				TopicSessionController.restartTopic(req.body.topic, req.body.starter, function(rslt) {
					res.json(rslt);
				});
			}	
		});		
	} catch (ex) {
		res.json({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
});

module.exports = router;