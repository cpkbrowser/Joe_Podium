var __ = require('underscore');
var mongoose = require('mongoose');
var util = require('../controllers/UtilitiesController');

module.exports.getLotteryRequests = function(category, callback) {
	try {
		var Requests = connection.model('lottery_request');		
		Requests.find({'topic': category}, function(err, rslt) {
			if (err) {
				callback({'status': 'Database Error', 'data': null});
			} else if (rslt == null) {
				callback({'status': 'not found', 'data': null});
			} else {
				util.mergeSort(rslt, 'lottery_id', function(rslt2) {
					callback({'status': 'success', 'data': rslt2});
				});				
			}
		});
	} catch (ex) {
		callback({'status': 'error', 'data': 'Unknown error occured, please contact support.'});
	}
};

module.exports.saveLotteryRequest = function(request, callback) {
	try {
		request.save(function(err, rslt) {
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
