var fs = require("fs");
var http = require("http");
var lame = require("lame");
var Speaker = require("speaker");
var stream = require("stream");
var qs = require("querystring");

var HUE_IP = "192.168.1.144";

// Pages
var indexHtml = fs.readFileSync("static/html/index.html", {encoding: "utf8"});
var dancerJs = fs.readFileSync("static/js/dancer.js", {encoding: "utf8"});
var jqueryJs = fs.readFileSync("static/js/jquery.js", {encoding: "utf8"});
var indexJs = fs.readFileSync("static/js/index.js", {encoding: "utf8"});

exports.getLights = function getLights(req, res) {
	var options = {
		host: HUE_IP,
		path: "/api/newdeveloper/lights",
		method: "GET"
	};

	var hueReq = http.request(options, function(hueRes) {
		var output = "";
		hueRes.on("data", function(chunk) {
			output += chunk;
		});

		hueRes.on("end", function() {
			res.write(output);
			res.end();
		});
	});

	hueReq.end();
};

exports.setLight = function setLight(req, res) {
	if (req.method.toLowerCase() === "put") {
		var body = "";
		req.on("data", function(chunk) {
			body += chunk;
		});
		req.on("end", function() {
			reqObj = qs.parse(body);
			var reqId = reqObj.id;
			delete reqObj.id;
			// Object might be empty!
			if (JSON.stringify(reqObj) !== "{}") {
				// Change numbers back to ints
				for (key in reqObj) {
					reqObj[key] = parseInt(reqObj[key]);
				}

				// Send put to chosen light
				var options = {
					host: HUE_IP,
					path: "/api/newdeveloper/lights/" + reqId + "/state",
					method: "PUT"
				};

				var hueReq = http.request(options, function(hueRes) {
					var output = "";
					hueRes.on("data", function(chunk) {
						output += chunk;
					});

					hueRes.on("end", function() {
						// Need id for callback!
						var outputObj = JSON.parse(output);
						console.log(outputObj)
						// Nasty hack
						var id = Object.keys(outputObj[0].success)[0].replace(/(^.+\D)(\d+)(\D.+$)/i,'$2');
						res.write(id);
						res.end();
					});
				});
	console.log(JSON.stringify(reqObj));
				hueReq.write(JSON.stringify(reqObj));
				hueReq.end();
			}
		});
	}
	// Assume 3 lights

	// for (var i = 0; i < 3; i++) {
	// 	var options = {
	// 		host: HUE_IP,
	// 		path: "/api/newdeveloper/lights/" + i + "/state",
	// 		method: "PUT"
	// 	};
	// 	var hue = Math.floor(Math.random()*65536);
	// 	var sat = Math.floor(Math.random()*256);

	// 	var hueReq = http.request(options);

	// 	hueReq.write("{\"hue\":" + hue + ", \"sat\": " + sat + "}");
	// 	hueReq.end();
	// }
	// res.end();
};

exports.playMusic = function(req, res) {
	// var encoder = lame.Encoder();
	// encoder.on("data", function(data) {
	// 	console.log(data);
	// 	res.write(data);
	// });
	// encoder.on("end", function() {
	// 	res.end();
	// });
	// var decoder = lame.Decoder();
	// decoder.on("format", function(format) {
	// 	decoder.pipe(encoder);
	// })
	var speaker = new Speaker();
	speaker.on("data", function() {
		console.log(data);
	})
	fs.createReadStream("static/mp3/Portal2-13-Want_You_Gone.mp3")
		.pipe(new lame.Decoder)
		.on("format", console.log)
		.pipe(speaker);
};

exports.index = function index(req, res) {
	res.writeHeader(200, {"Content-Type": "text/html"});
	res.write(indexHtml);
	res.end();
};

exports.dancer = function dancer(req, res) {
	res.writeHeader(200, {"Content-Type": "application/javascript"});
	res.write(dancerJs);
	res.end();
};

exports.jQuery = function jQuery(req, res) {
	res.writeHeader(200, {"Content-Type": "application/javascript"});
	res.write(jqueryJs);
	res.end();
};

exports.indexJs = function indexJS(req, res) {
	res.writeHeader(200, {"Content-Type": "application/javascript"});
	res.write(indexJs);
	res.end();
};

exports.mp3 = function mp3(req, res) {
	var bestStream = fs.createReadStream("static/mp3/Portal2-13-Want_You_Gone.mp3");
	//var bestStream = fs.createReadStream("static/mp3/Hello Atari.mp3");
	bestStream.pipe(res);
};