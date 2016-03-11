(function(jQuery){
	var $jq = jQuery,
		apiUrl = 'http://rest.angryportfolio.com/restapi/';
	
	$jq('.add-action').on('click', function(){
		var sectionId = $jq(this).attr('data-section-id');
		switch (sectionId) {
			case 'registration': userRegistration(); break;
			case 'login': userLogin(); break;
		}
	});
	
	function userRegistration() {
		var username = $('#reg-username').val(),
			email = $('#reg-email').val(),
			password = $('#reg-password').val(),
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
				console.log(response);
			}
		});
	}
	
	function userLogin() {
		console.log('user login');
	}
})(jQuery)