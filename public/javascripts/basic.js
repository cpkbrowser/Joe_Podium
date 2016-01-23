var static_url = window.location;

$(document).ready(function() {
	//placeholder
});

function login() {
	var postData = {
		email: $("#in_usr").val(),
		password: $("#in_pass").val()
	}	 
	
	$.ajax({
		url: "http://localhost:3000/login",
        type: "POST",
		data: postData,
		contentType: 'application/x-www-form-urlencoded',
		dataType: 'json',
        success: function (rslt) {
            sessionStorage.token = rslt.rslt.token;
			sessionStorage.nonce = rslt.rslt.nonce;
        },
        error: function (rslt) {
            alert('Error connecting to server, please contact support.');
        }
    });	
}

function test() {
	var postData = {
		//id: 'yKYkxwKVU7E', //this video is too long
		id: '9XP2An7lTXQ',
		email: 'info@cpkbrowser.com',
		verification_code: '1234'
	}
	var respData = {
		id: '9XP2An7lTXQ',
		email: 'media@cpkbrowser.com',
		verification_code: '4567'
	}
	var x = 1;
	$.ajax({
		//url: "http://localhost:3000/updateTopic/post-video",
		url: "http://localhost:3000/updateTopic/responder-video",
		//url: 'http://localhost:3000/youtube/id',
		type: "POST",
		data: respData,
		headers: {
			token: sessionStorage.token,
			nonce: sessionStorage.nonce
		},
		contentType: 'application/x-www-form-urlencoded',
		dataType: 'json',
		success: function (rslt) {
			var x = 1;
		},
		error: function (rslt) {
			alert('Error connecting to server, please contact support.');
		}
	});		
}

