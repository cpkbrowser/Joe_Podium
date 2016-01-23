var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var YoutubeControler = require('../controllers/YouTubeController');

router.get('/id', function(req, res){
	try {
		auth.validateSession(req.headers.token, req.headers.nonce,
		function(response) {
			YoutubeControler.getVideoByID(req.query.id, function(rslt) {
				res.json(rslt);
			});
		},
		function(error) {
			res.json({'status': 'error', 'rslt': 'Error validating session.'});
		});	
	} catch (ex) {
		res.json({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
});

router.get('/keywords', function(req, res){
	try {
		auth.validateSession(req.headers.token, req.headers.nonce,
		function(response) {
			YoutubeControler.getVideosByKeywords(req.query.keywords, function(rslt) {
				res.json(rslt);
			});
		},
		function(error) {
			console.log(error);
			res.json({'status': 'error', 'rslt': 'Error validating session.'});
		});	
	} catch (ex) {
		res.json({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
});

module.exports = router;