var express = require('express');
var mongoose = require('mongoose');
var cpkAuth = require('../routes/cpkAuth');
var __ = require('underscore');
var moment = require('moment');
var YoutubeController = require('../controllers/YouTubeController');
var utilities = require('../controllers/UtilitiesController');
var lottery = require('../controllers/LotteryController');

module.exports.getTopic = function(category, callback) {
	try {
		var Topic = connection.model('topic');
		Topic.findOne({$and: [{'category': category}, {'active': 'true'}]}, function(err, rslt1) {
			if (err) {
				callback({'status': 'Database Error', 'data': null});
			} else if (rslt1 == null) {
				callback({'status': 'not found', 'data': null});
			} else {
				callback({'status': 'success', 'data': rslt1});
			}
		});
	} catch (ex) {
		callback({'status': 'error', 'data': 'Unknown error occured, please contact support.'});
	}
};

module.exports.getAllTopics = function(callback) {
	try {
		var Topics = connection.model('topic');		
		Topics.find({'active': 'true'}, 'category', function(err, rslt) {
			if (err) {
				callback({'status': 'Database Error', 'data': null});
			} else if (rslt == null) {
				callback({'status': 'not found', 'data': null});
			} else {	
				callback({'status': 'success', 'data': rslt});
			}
		});
	} catch (ex) {
		callback({'status': 'error', 'data': 'Unknown error occured, please contact support.'});
	}
};

module.exports.getTopicVideos = function(topic, callback) {
	try {
		var ids = '';
		var emails = [];
		topic.responders.forEach(function(item, index, array) {
			ids = (ids + item.youtube_id + ',');
			emails.push(item.email.split('@')[0]);
		});
		ids = ids.substring(0, ids.length - 1);
		console.log(ids);
		YoutubeController.getVideoByID(ids, function(rslt) {
			rslt = tieEmailToVideo(emails, rslt);
			rslt.postVid = topic.post_admin.youtube_id;
			callback(rslt);
		});
	} catch (ex) {
		callback({'status': 'error', 'data': 'Unknown error occured, please contact support.'});
	}
};

module.exports.accessTopic_PostAdmin = function(email, verification_code, callback) {
	try {
	var Topic = connection.model('topic');
		Topic.find({}, function(err, rslt) {
			if (err) {
				callback({'status': 'error', 'data': err});
			} else if (rslt == null) {
				callback({'status': 'not found', 'data': null});
			} else {
				var found;
				rslt.forEach(function(item, index, array) {
					if (item.post_admin.email == email && item.post_admin.verification_code == verification_code) {
						found = item;
					}
				});
				if (found != null) {
					callback({'status': 'success', 'data': found});
				} else {
					callback({'status': 'not found', 'data': null});
				}
			}
		});	
	} catch (ex) {
		callback({'status': 'error', 'data': 'Unknown error occured, please contact support.'});
	}
};

module.exports.accessTopic_Responder = function(email, verification_code, callback) {
	try {
		var Topic = connection.model('topic');
		Topic.find({}, function(err, rslt) {
			if (err) {
				callback({'status': 'error', 'data': err});
			} else if (rslt == null) {
				callback({'status': 'not found', 'data': null});
			} else {
				var found, num;
				rslt.forEach(function(item, index, array) {
					item.responders.forEach(function(item2, index2, array2) {
						if (item2.email == email && item2.verification_code == verification_code) {
							found = item;
							num = index2;
							console.log('index:' + index2);
						}
					});
				});
				if (found != null) {
					callback({'status': 'success', 'data': found, 'index': num});
				} else {
					callback({'status': 'not found', 'data': null});
				}
			}
		});	
	} catch (ex) {
		callback({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
};

module.exports.getViewCounts = function(topic, callback) {
	try {
		if (topic.max_responders == 0) {
			callback({'status': 'Max responders was never set on this topic'});
		} else {
			var errors = [];
			var scores = [];
			function ProcessComplete() {
				if (scores.length > 0) {
					utilities.mergeSort(scores, 'count', function(arr) {
						callback({'status': 'success', 'scores': arr, 'errors': errors});
					});
				} else {
					callback({'status': 'no videos were posted by the topic responders'});
				}		
			}
			
			var finished = __.after(topic.responders.length, ProcessComplete);
			topic.responders.forEach(function(item, index, array) {
				if (item.youtube_id != "") {
					YoutubeController.getVideoByID(item.youtube_id, function(data) {
						if (data.rslt.items[0] != null) {
								if (data.status == 'success') {
								scores.push({'email': item.email, 'id': item.youtube_id, 'count': data.rslt.items[0].statistics.viewCount});
							} else {
								errors.push({'email': item.email, 'id': item.youtube_id, 'error': data.rslt});
							}
							finished();
						} else {
							finished();
						}			
					});
				} else {
					finished();
				}
			});
		}
	} catch (ex) {
		callback({'status': 'error', 'data': 'Unknown error occured, please contact support.'});
	}
};

module.exports.createTopic = function(category, post_id, poster, callback) {
	try {
		//need to implement lottery function here
		//fill in 20 responders, leave max_responders = 0
		//once topic admin has set responder threshold, send email to x amount of responders.
		console.log('creating topic');
		var Topics = connection.model('topic');
		var topicUser = connection.model('topic_user');
		var start = moment().utc().startOf('day').add(1, 'milliseconds');
		var end =  moment().utc().startOf('day').add(1, 'week');
		lottery.getLotteryRequests(category, function(rslt) {
			if (rslt.status == 'success') {
				var responders = [];
				var max = max_topic_responder;
				if (max == null || max == 0) {
					max = 5;
				}
				if (rslt.data.length < max) { max = rslt.data.length };
				for (i = 0; i < max && i < rslt.data.length; i++) {
					responders.push(new topicUser({
						email: rslt.data[i].email,
						youtube_id: '',
						verification_code: newVerificationCode()
					}));
					rslt.data[i].remove();
				}
				var newTopic = new Topics({
					post_id: post_id,
					category: category,
					post_admin: {
						email: poster,
						youtube_id: '',
						verification_code: newVerificationCode()
					},
					max_responders: 0,
					max_duration: 0,
					responders: responders,
					responders_notified: false,
					active: 'true',
					active_date: start,
					exp_date: end
				});
				callback({'status': 'success', 'data': newTopic});
			} else {
				callback(rslt);
			}
		});	
	} catch (ex) {
		callback({'status': 'error', 'data': 'Unknown error occured, please contact support.'});
	}
}

module.exports.saveTopic = function(topic, callback) {
	try {
		topic.save(function(err, rslt) {
			if (err) {
				callback({'status': 'error', 'data': err});
			} else {
				callback({'status': 'success', 'data': rslt});
			}
		});
	} catch (ex) {
		callback({'status': 'error', 'data': 'Unknown error occured, please contact support.'});
	}
};

module.exports.closeTopic = function(topic, callback) {
	try {
		topic.active = 'false';
		topic.save(function(err, rslt) {
			if (err) {
				callback({'status': 'error', 'data': err});
			} else {
				callback({'status': 'success', 'data': rslt});
			}
		});	
	} catch (ex) {
		callback({'status': 'error', 'data': 'Unknown error occured, please contact support.'});
	}
};

//Internal Functions
function newVerificationCode() {
	try {
		return parseInt(Math.random() * (9999 - 1000) + 1000);
	} catch (ex) {
		return 1111;
	}
}

function tieEmailToVideo(emails, videos) {
	videos.rslt.items.forEach(function(item, index, array) {
		item.email = emails[index];
	});
	return videos;
}