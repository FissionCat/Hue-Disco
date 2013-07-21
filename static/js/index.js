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
			url: "/setlight",
			type: "PUT",
			data: {id: 1},
			dataType: "json"
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

	$("#radio").on("click", function(e) {
		e.preventDefault();
		e.stopPropogation();
	});

	var lightChange = [false, false, false];
	var timeout = [null, null, null];
	// Lights!
	dancer.load(document.getElementsByTagName("audio")[0]);
	var kick = dancer.createKick({
		onKick: function(mag) {
			for (var i = 0; i < 3; i++) {
				if (lightChange[i] === false) {
					lightChange[i] = true;
					console.log("Kicking! " + i);
					// Defaults
					var hue = Math.floor(Math.random()*65536);
					var sat = Math.floor(Math.random()*256);
					if ($("#mag").is(":checked")) {
						hue = Math.floor(mag*65536);
						sat = Math.floor(mag*256);
					}
					$.ajax({
						url: "/setlight",
						type: "PUT",
						data: {id: i + 1, hue: hue, sat: sat},
						dataType: "json"
					}).done(function(id) {
						timeout[id - 1] = setTimeout(function() {
							lightChange[id - 1] = false;
							console.log("timed out " + id);
						}, 100);
					});
				}
			}
		}
	});
	kick.on();
});