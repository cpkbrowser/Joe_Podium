var express = require('express');
var request = require('request');
var moment = require('moment');

module.exports.getVideoByID = function(id, callback) {
	try {
		var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics%2Csnippet%2CcontentDetails&id=' + id + '&key=AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU';
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var rslt = JSON.parse(body);
				callback({'status': 'success', 'rslt': rslt});
			} else {
				callback({'status': 'error', 'rslt': response.statusCode});
			}
		});
	} catch (ex) {
		callback({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
};

module.exports.getVideosByKeywords = function(phrase, callback) {
	try {
		var keywords = phrase.replace('/ /g', '+');
		var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=' + keywords + '&key=AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU';
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var rslt = JSON.parse(body);
				callback({'status': 'success', 'rslt': rslt});
			} else {
				callback({'status': 'error', 'rslt': response.statusCode});
			}
		});
	} catch (ex) {
		callback({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
};

module.exports.validateVideo = function(id, max_duration, callback) {
	try {
		var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics%2Csnippet%2CcontentDetails&id=' + id + '&key=AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU';
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var rslt = JSON.parse(body);
				var duration = rslt.items[0].contentDetails.duration;
				try {
					duration = moment.duration(duration).asMinutes();
					if (duration <= max_duration) {
						var time_data = rslt.items[0].snippet.publishedAt;
						var start_time = moment().subtract(8, 'days').format();
						console.log('start: ' + start_time);
						var end_time = moment().format();
						if (isBetweenDates(start_time, time_data, end_time)) {
							callback({'status': 'success', 'details': '', 'rslt': duration});
						} else {
							callback({'status': 'warning', 'details': 'Video is too old.', 'rslt': time_data});
						}
					} else {
						callback({'status': 'warning', 'details': 'Video Duration Too Long', 'rslt': float2int(duration) + ' min.'});
					}
				} catch (ex) {
					callback({'status': 'error', 'details': 'Unknown Error', 'rslt': ex});
				}			
			} else {
				callback({'status': 'error', 'details': 'Error Gathering Youtube Data', 'rslt': response.statusCode});
			}
		});
	} catch (ex) {
		callback({'status': 'error', 'rslt': 'Unknown error occured, please contact support.'});
	}
}

function float2int(value) {
    return value | 0;
}

function isBetweenDates(startDate, date, endDate) {
	try {
		if (startDate <= date && date <= endDate) {
			return true;
		} else {
			return false;
		}
	} catch (ex) {
		return false;
	}
}