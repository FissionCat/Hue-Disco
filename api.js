var fs = require("fs");
var http = require("http");
var lame = require("lame");
var Speaker = require("speaker");
var stream = require("stream");

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

exports.setLight = function setLights(req, res) {
	// req should be 
	var options = {
		host: HUE_IP,
		path: "/api/newdeveloper/lights/1/state",
		method: "PUT"
	};
	var hue = Math.floor(Math.random()*65536);
	var sat = Math.floor(Math.random()*256);

	var hueReq = http.request(options, function(hueRes) {
		var output = "";
		hueRes.on("data", function(chunk) {
			output += chunk;
		});

		hueRes.on("end", function() {
			res.write(output);
			res.end();
		})
	});

	hueReq.write("{\"hue\":" + hue + ", \"sat\": " + sat + "}");
	hueReq.end();
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

	bestStream.pipe(res);
};