var $jq = jQuery.noConflict(),
	apiUrl = 'http://rest.angryportfolio.com/restapi/',
	api = {};

api.userRegistration = function() {
	var username = $jq('#reg-username').val(),
		email = $jq('#reg-email').val(),
		password = $jq('#reg-password').val(),
		apiEndpoint = apiUrl + 'Registration';
		
	$jq.ajax({
		url: apiEndpoint,
		type: 'post',
		data: {
			UserRegistration: true, 
			username: username, 
			password: password, 
			email: email
		},
		success: function(response){
			console.log(JSON.parse(response));
		}
	});
}

api.userLogin = function() {
	var	username = $jq('#login-username').val(),
		password = $jq('#login-password').val(),
		apiEndpoint = apiUrl + 'LoginAuth';
	
	$jq.ajax({
		url: apiEndpoint,
		type: 'post',
		data: {Authorization: true, username: username, password: password},
		success: function(response){
			console.log(JSON.parse(response));
			response = JSON.parse(response);
			if (response.response_message === 'login_auth_successful') {
				document.cookie = 'token_id=' + response.token_id;
				location.reload();
			}
		}
	});
}

api.userLogOut = function() {
	document.cookie = 'token_id=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	location.reload();
}

api.isUserLoggedIn = function() {
	var cookies = document.cookie,
		loggedIn = false;

	if (cookies.indexOf('token_id') > -1) {
		loggedIn = true;
	}

	console.log('user logged in: ', loggedIn);
	return loggedIn;
}

api.getTokenIdFromCookie = function() {
	var cookieItems = document.cookie.split(';'),
		tokenId;
	
	$jq.each(cookieItems, function(index, value){
		if (value.indexOf('token_id') > -1) {
			tokenId = value.split('=');
			tokenId = tokenId[1];
		}
	});
	
	return tokenId;
}

api.getContentList = function() {
	var apiEndpoint = apiUrl + 'Content',
		content;

	return $jq.ajax({
		url: apiEndpoint,
		type: 'post',
		data: {ListContent: true}
	});
}

api.createContent = function() {
	var title = $jq('#create-content-title').val(),
		content = $jq('#create-content-description').val(),
		apiEndpoint = apiUrl + 'Content',
		token = api.getTokenIdFromCookie;
	
	if(title.length > 0 && content.length > 0) {
		$jq.ajax({
			url: apiHost,
			type: 'post',
			data: {CreateContent: true, title: title, content: content, token: token},
			success: function(response){
				console.log('result: ', response);
			}
		});
	}
}
