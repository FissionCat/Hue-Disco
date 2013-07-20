var fs = require("fs");
var http = require("http");

var HUE_IP = "192.168.1.144";

// Pages
var indexHtml = fs.readFileSync("static/html/index.html", {encoding: "utf8"});
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

exports.index = function index(req, res) {
	res.writeHeader(200, {"Content-Type": "text/html"});
	res.write(indexHtml);
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
}