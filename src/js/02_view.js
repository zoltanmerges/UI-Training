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
	var contentListHtml = '';

	$jq.when(api.getContentList()).then(function(response){
		response = JSON.parse(response);
		$jq.each(response, function(index, value){
			contentListHtml += '<article class="article">' +
				'<h3 class="article-header">' + value.post_title + '</h3>' +
				'<div class="article-content">' + value.post_content + '</div>' +
			'</article>';
		});
		
		console.log(contentListHtml);
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