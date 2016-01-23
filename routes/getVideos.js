var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var __ = require('underscore');
var mongoose = require('mongoose');
var TopicController = require('../controllers/TopicController');

router.post('/', function(req, res){
	try {
		TopicController.getTopic(req.body.category, function(rslt) {
			TopicController.getTopicVideos(rslt.data, function(rslt2) {
				res.json(rslt2);
			});
		});
	} catch (ex) {
		res.json({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
});

module.exports = router;