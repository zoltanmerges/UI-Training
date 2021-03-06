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
		return $jq.ajax({
			url: apiEndpoint,
			type: 'post',
			data: {CreateContent: true, title: title, content: content, token: token},
			success: function(response){
				console.log('result: ', response);
			}
		});
	}
}

var view = {};

$jq(document).on('click', '.menu-link', function() {
	var itemId = $jq(this).attr('data-menu-item-id'),
		sectionSelector = '#' + itemId + '-section';

	$jq('.menu-link').removeClass('active');
	$jq(this).addClass('active');
	
	$jq('.content-section').removeClass('visible');
	$jq(sectionSelector).addClass('visible');
	
	switch (itemId) {
		case 'login': view.setLoginFormView(); break;
		case 'registration': view.setRegistrationFormView(); break;
		case 'create-content': view.setCreateContentView(); break;
		case 'logout': api.userLogOut(); break;
	}
});

view.setContentList = function() {
	var contentListHtml = '',
		contentListObj = api.getContentList(),
		contentListTemplate = $jq.get('assets/templates/article.html', function(response) {
		    return response;
		});

	$jq.when(contentListObj, contentListTemplate).then(function(contentObj, contentTemplate){
		var article = '';

		contentObj = JSON.parse(contentObj[0]);
		contentTemplate = contentTemplate[0];

		$jq.each(contentObj, function(index, value){
			article = contentTemplate;
			article = article.replace('{{article_header}}', value.post_title);
			article = article.replace('{{article_content}}', value.post_content);

			contentListHtml += article;
		});

		$jq('#main-content-section').html(contentListHtml);
		$jq('#main-content-section').addClass('visible');
	});
}

view.setLoginFormView = function() {
	$jq('#content-header-section').load('assets/templates/login.html');
}

view.setRegistrationFormView = function() {
	$jq('#content-header-section').load('assets/templates/registration.html');
}

view.setCreateContentView = function() {
	$jq('#content-header-section').load('assets/templates/create-content.html');
}

view.createArticle = function(contentDetails) {
	var articleTemplate = $jq.get('assets/templates/article.html', function(response) {
	    return response;
	});

	contentDetails = JSON.parse(contentDetails);

	$jq.when(articleTemplate).then(function(template){
		template = template.replace('{{article_header}}', contentDetails.content_title);
		template = template.replace('{{article_content}}', contentDetails.content_description);

		$jq('#create-content-title').val('');
		$jq('#create-content-description').val('');

		$jq('#main-content-section').prepend(template);
	});
}

view.setMainMenuView = function(menuType) {
	$jq('#main-menu-container').load('assets/templates/main-menu-' + menuType + '.html');
}

view.setLoggedInView = function() {
	view.setMainMenuView('logged-in');
	view.setCreateContentView();
}

view.setLoggedOutView = function() {
	view.setMainMenuView('logged-out');
	view.setLoginFormView();
}
if (api.isUserLoggedIn()) {
	console.log('token id: ', api.getTokenIdFromCookie());
	
	view.setCreateContentView();
	view.setMainMenuView('logged-in');
} else {
	view.setLoginFormView();
	view.setMainMenuView('logged-out');
}

view.setContentList();

$jq(document).on('click', '.add-action', function() {
	var sectionId = $jq(this).attr('data-section-id');

	switch (sectionId) {
		case 'registration': api.userRegistration(); break;
		case 'login': api.userLogin(); break;
		case 'create-content': createContent(); break;
	}

	function createContent() {
		var createContentResult = api.createContent();

		$jq.when(createContentResult).then(function(result){
			view.createArticle(result);
		});
	}
});