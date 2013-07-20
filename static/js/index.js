$(function() {
	var dancer = new Dancer();
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

	$("#audio").on("pause", function(e) {
		dancer.pause();
	});

	$("#audio").on("play", function(e) {
		dancer.play()
	});

	// Lights!
	dancer.load(document.getElementsByTagName("audio")[0]);
	var kick = dancer.createKick({
		onKick: function(mag) {
			console.log("Kicking!");
		},
		offKick: function(mag) {
			console.log("No kick :(");
		}
	});
	kick.on();
});