var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var TopicController = require('../controllers/TopicController');

router.post('/postadmin', function(req, res) {
	try {
		var Topic = connection.model('topic');
		Topic.find({}, function(err, rslt) {
			if (err) {
				res.json({'status': 'error', 'data': err});
			} else if (rslt == null) {
				res.json({'status': 'not found', 'data': null});
			} else {
				var found;
				rslt.forEach(function(item, index, array) {
					if (item.post_admin.email == req.body.email && item.post_admin.verification_code == req.body.verification_code) {
						found = item;
					}
				});
				if (found != null) {
					auth.createSession(
						function (response) {
							var token_data = {
								'token': response.sessionToken,
								'nonce': response.nonce,
								'expires': response.expirationDateTime
							};
							res.json({'status': 'success', 'token_data': token_data, 'category': found.category});
						},
						function(error) {
							console.log('error message: %s', error.message);
							res.json({'status': 'error', 'data': 'Error generating session.'});
						}
					);
				} else {
					res.json({'status': 'not found', 'data': null});
				}
			}
		});
	} catch (ex) {
		res.json({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
});

router.post('/responder', function(req, res) {
	try {
		var Topic = connection.model('topic');
		Topic.find({}, function(err, rslt) {
			if (err) {
				res.json({'status': 'error', 'data': err});
			} else if (rslt == null) {
				res.json({'status': 'not found', 'data': null});
			} else {
				var found;
				rslt.forEach(function(item, index, array) {
					item.responders.forEach(function(item2, index2, array2) {
						if (item2.email == req.body.email && item2.verification_code == req.body.verification_code) {
							found = item;
						}
					});
				});
				if (found != null) {
					auth.createSession(
						function (response) {
							var token_data = {
								'token': response.sessionToken,
								'nonce': response.nonce,
								'expires': response.expirationDateTime
							};
							res.json({'status': 'success', 'token_data': token_data, 'category': found.category});
						},
						function(error) {
							console.log('error message: %s', error.message);
							res.json({'status': 'error', 'data': 'Error generating session.'});
						}
					);
				} else {
					res.json({'status': 'not found', 'data': null});
				}
			}
		});
	} catch (ex) {
		res.json({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
});

module.exports = router;