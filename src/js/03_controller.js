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
		case 'create-content': api.createContent(); break;
	}
});