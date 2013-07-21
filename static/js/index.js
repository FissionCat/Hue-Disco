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

	var lightChange = [false, false, false, false, false];
	var timeout = [null, null, null, null, null];
	var baseThreshold = 0.33;
	var midThreshhold = 0.1;
	var highThreshold = 0.04;
	// Lights!
	dancer.load(document.getElementsByTagName("audio")[0]);
	var baseKick = dancer.createKick({
		onKick: function(mag) {
			if ($("#random").is(":checked")) {
				var length = 5;
				for (var i = 0; i < length; i++) {
					if (lightChange[i] === false) {
						lightChange[i] = true;
						
						// Defaults
						var hue = Math.floor(Math.random()*65536);
						var sat = Math.floor(Math.random()*256);
						var bri = Math.floor(Math.random()*256);
						//console.log("Kicking! " + i + " " + bri);
						$.ajax({
							url: "/setlight",
							type: "PUT",
							data: {id: i + 1, hue: hue, sat: sat},
							dataType: "json"
						}).done(function(id) {
							timeout[id - 1] = setTimeout(function() {
								lightChange[id - 1] = false;
							}, 100);
						});
					}
				}
			} else {
				if (lightChange[0] === false) {
					lightChange[0] = true;
					
					// Defaults
					var hue = Math.floor(Math.random()*65536);
					var sat = Math.floor(Math.random()*256);
					var bri = Math.floor(Math.random()*256);
					if ($("#mag").is(":checked")) {
						hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%65536);
						sat = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
						bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					}
					if ($("#red").is(":checked")) {
						hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%7000);
						sat = 255;
						bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					}
					if ($("#green").is(":checked")) {
						hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+24653;
						sat = 255;
						bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					}
					if ($("#blue").is(":checked")) {
						hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+40000;
						sat = 255;
						bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					}
					//console.log("Kicking! " + i + " " + bri);
					$.ajax({
						url: "/setlight",
						type: "PUT",
						data: {id: 1, hue: hue, sat: sat},
						dataType: "json"
					}).done(function(id) {
						timeout[id - 1] = setTimeout(function() {
							lightChange[id - 1] = false;
						}, 100);
					});
				}

				if (lightChange[4] === false) {
					lightChange[4] = true;
					
					// Defaults
					var hue = Math.floor(Math.random()*65536);
					var sat = Math.floor(Math.random()*256);
					var bri = Math.floor(Math.random()*256);
					if ($("#mag").is(":checked")) {
						hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%65536);
						sat = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
						bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					}
					if ($("#red").is(":checked")) {
						hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%7000);
						sat = 255;
						bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					}
					if ($("#green").is(":checked")) {
						hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+24653;
						sat = 255;
						bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					}
					if ($("#blue").is(":checked")) {
						hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+40000;
						sat = 255;
						bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					}
					//console.log("Kicking! " + i + " " + bri);
					$.ajax({
						url: "/setlight",
						type: "PUT",
						data: {id: 5, hue: hue, sat: sat},
						dataType: "json"
					}).done(function(id) {
						timeout[id - 1] = setTimeout(function() {
							lightChange[id - 1] = false;
						}, 100);
					});
				}
			}
		},
		frequency: [0, 10],
		threshold: baseThreshold
	});
	var midKick = dancer.createKick({
		onKick: function(mag) {
			// Only work on not random
			if (!$("#random").is(":checked") && lightChange[1] === false) {
				lightChange[1] = true;
				//console.log("Kicking! 1 " + mag);
				// Defaults
				var hue = Math.floor(Math.random()*65536);
				var sat = Math.floor(Math.random()*256);
				var bri = Math.floor(Math.random()*256);
				if ($("#mag").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%65536);
					sat = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				if ($("#red").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%7000);
					sat = 255;
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				if ($("#green").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+24653;
					sat = 255;
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				if ($("#blue").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+40000;
					sat = 255;
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				$.ajax({
					url: "/setlight",
					type: "PUT",
					data: {id: 2, hue: hue, sat: sat},
					dataType: "json"
				}).done(function(id) {
					timeout[id - 1] = setTimeout(function() {
						lightChange[id - 1] = false;
					}, 100);
				});
			}

			if (!$("#random").is(":checked") && lightChange[3] === false) {
				lightChange[3] = true;
				// Defaults
				var hue = Math.floor(Math.random()*65536);
				var sat = Math.floor(Math.random()*256);
				var bri = Math.floor(Math.random()*256);
				if ($("#mag").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%65536);
					sat = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				if ($("#red").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%7000);
					sat = 255;
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				if ($("#green").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+24653;
					sat = 255;
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				if ($("#blue").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+40000;
					sat = 255;
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				$.ajax({
					url: "/setlight",
					type: "PUT",
					data: {id: 4, hue: hue, sat: sat},
					dataType: "json"
				}).done(function(id) {
					timeout[id - 1] = setTimeout(function() {
						lightChange[id - 1] = false;
					}, 100);
				});
			}
		},
		frequency: [10, 30],
		threshold: midThreshhold
	});
	var highKick = dancer.createKick({
		onKick: function(mag) {
			// Only work on not random
			if (!$("#random").is(":checked") && lightChange[2] === false) {
				lightChange[2] = true;
				//console.log("Kicking! 2 " + mag);
				// Defaults
				var hue = Math.floor(Math.random()*65536);
				var sat = Math.floor(Math.random()*256);
				var bri = Math.floor(Math.random()*256);
				if ($("#mag").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%65536);
					sat = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				if ($("#red").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%7000);
					sat = 255;
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				if ($("#green").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+24653;
					sat = 255;
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				if ($("#blue").is(":checked")) {
					hue = Math.floor((mag*65536*(Math.random()*10/baseThreshold))%9000)+40000;
					sat = 255;
					bri = Math.floor((mag*256*(Math.random()*10/baseThreshold))%256);
				}
				$.ajax({
					url: "/setlight",
					type: "PUT",
					data: {id: 3, hue: hue, sat: sat},
					dataType: "json"
				}).done(function(id) {
					timeout[id - 1] = setTimeout(function() {
						lightChange[id - 1] = false;
					}, 100);
				});
			}
		},
		frequency: [50, 100],
		threshold: highThreshold
	});

	baseKick.on();
	midKick.on();
	highKick.on();
});