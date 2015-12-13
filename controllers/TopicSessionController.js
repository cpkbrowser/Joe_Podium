var cpkAuth = require('../routes/cpkAuth');
var __ = require('underscore');
var TopicController = require('../controllers/TopicController');
var sbController = require('../controllers/ScoreboardController');
var util = require('../controllers/UtilitiesController');
var email = require('../controllers/EmailController');

module.exports.closeAllTopics = function(callback) {
	TopicController.getAllTopics(function(rslt) {
		
		var results = [];
		function ProcessComplete() {
			callback({'status': 'success', 'data': results});
		}
		
		var finished = __.after(rslt.data.length, ProcessComplete);		
		rslt.data.forEach(function(item, index, array) {
			closeTopicSession(item.category, null, function(rslt2) {
				results.push(rslt2);
				finished();
			});	
		});
		
	});
};

module.exports.restartTopic = function(topic, starter, callback) {
	console.log('restarting topic session');
	closeTopicSession(topic, starter, function(rslt) {
		callback(rslt);
	});
};

function closeTopicSession(category, starter_override, callback) {
	TopicController.getTopic(category, function(rslt) {
		if (rslt.status == "success") {
			var topic = rslt.data;
			console.log('generating scoreboard');
			sbController.generateScoreboard(topic, function(rslt2) {
				if (rslt2.status == 'success' || starter_override != null) {
					console.log('closing old topic');
					TopicController.closeTopic(topic, function(rslt3) {
						if (rslt3.status = 'success') {
							var newID = util.getNewPostID(topic.post_id);
							var starter, y_id;
							if (starter_override != null) {
								starter = starter_override;
								y_id = 'RD3ukNwwh7s';
							} else {
								starter = rslt2.data.winner;
								y_id = rslt2.data.rankings[0].id;
							}
							TopicController.createTopic(topic.category, newID, starter, function(rslt4) {
								var newTopic = rslt4.data;
								if (rslt4.status == 'success') {
									TopicController.saveTopic(newTopic, function(rslt5) {
										if (rslt5.status == 'success') {
											var notify = {
												'category': newTopic.category,
												'email': newTopic.post_admin.email,
												'verification_code': newTopic.post_admin.verification_code,
												'link': 'https://www.youtube.com/watch?v=' + y_id,
												'thumbnail': 'http://img.youtube.com/vi/' + y_id + '/maxresdefault.jpg'
											};
											email.NotifyPostAdmin(notify, function(rslt6) {
												callback(rslt6);
											});
										} else {
											callback(rslt5);
										}
									});
								} else {
									callback(rslt4);
								}
							});
						} else {
							callback(rslt3);
						}
					});
				} else {
					callback(rslt2);
				}
			});
		} else {
			callback(rslt);
		}
	});
};

