$(function() {
	$("#getter").on("click", function(e) {
		$.get("/getlights", function(data) {
			$("#text").val(data);
		});
	});

	$("#random").on("click", function(e) {
		$.ajax({
			url: "/setlights",
			type: "GET"
		}).done(function(data) {
			console.log(data);
		});
	})
});