$(".tile").click(function(){
	id = $(this).children("h3").attr('id');
	window.location.href= "/" + id;
});