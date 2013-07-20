$(function() {
	// Button events
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
	});

	// Lights!
	var dancer = new Dancer();
	dancer.load({src: "mp3/wantyougone"});
	var kick = dancer.createKick({
		onKick: function(mag) {
			console.log("Kicking!");
		},
		offKick: function(mag) {
			console.log("No kick :(");
		}
	});
	kick.on();
	dancer.play();
});