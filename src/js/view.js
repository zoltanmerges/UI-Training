$jq('.menu-link').on('click', function(){
	var itemId = $jq(this).attr('data-menu-item-id'),
		sectionSelector = '#' + itemId + '-section';

	$jq('.menu-link').removeClass('active');
	$jq(this).addClass('active');
	
	$jq('.content-section').removeClass('visible');
	$jq(sectionSelector).addClass('visible');
});