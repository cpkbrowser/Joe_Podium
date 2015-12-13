var express = require('express');
var request = require('request');

module.exports.getVideoByID = function(id, callback) {
	var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics%2Csnippet%2CcontentDetails&id=' + id + '&key=AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU';
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var rslt = JSON.parse(body);
			callback({'status': 'success', 'rslt': rslt});
		} else {
			callback({'status': 'error', 'rslt': response.statusCode});
		}
	});
};

module.exports.getVideosByKeywords = function(phrase, callback) {
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
};

module.exports.checkVideoDuration = function(id, max_duration, callback) {
	var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics%2Csnippet%2CcontentDetails&id=' + id + '&key=AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU';
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var rslt = JSON.parse(body);
			var duration = rslt.items[0].contentDetails.duration;
			try {
				var temp = duration.split('M')[0].replace('PT', '');
				duration = parseInt(temp);
				if (duration < max_duration) {
					callback({'status': 'success', 'details': '', 'rslt': duration});
				} else {
					callback({'status': 'warning', 'details': 'Video Duration Too Long', 'rslt': duration});
				}
			} catch (ex) {
				callback({'status': 'error', 'details': 'Unknown Error', 'rslt': ex});
			}			
		} else {
			callback({'status': 'error', 'details': 'Error Gathering Youtube Data', 'rslt': response.statusCode});
		}
	});
}