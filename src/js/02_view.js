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