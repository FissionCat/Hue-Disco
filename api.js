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
var css = fs.readFileSync("static/css/index.css", {encoding: "utf8"});

module.exports = function(ip) {
	var HUE_IP = ip;
	return {
		getLights: function getLights(req, res) {
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
		},

		setLight: function setLight(req, res) {
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
							if (reqObj[key] !== true && reqObj[key] !== "true") {
								reqObj[key] = parseInt(reqObj[key]);
							}
							if (reqObj[key] === "true") {
								reqObj[key] = true;
							}
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
								if ("success" in outputObj[0]) {
									// Nasty hack
									var id = Object.keys(outputObj[0].success)[0].replace(/(^.+\D)(\d+)(\D.+$)/i,'$2');
									res.write(id);
									res.end();
								} else {
									// Light doesn't exist
									var id = outputObj[0].error.address.replace(/(^.+\D)(\d+)(\D.+$)/i,'$2');
									res.write(id);
									res.end();
								}
							});
						});

						hueReq.write(JSON.stringify(reqObj));
						hueReq.end();
					}
				});
			}
		},

		indexServe: function index(req, res) {
			res.writeHeader(200, {"Content-Type": "text/html"});
			res.write(indexHtml);
			res.end();
		},

		dancer: function dancer(req, res) {
			res.writeHeader(200, {"Content-Type": "application/javascript"});
			res.write(dancerJs);
			res.end();
		},

		jQuery: function jQuery(req, res) {
			res.writeHeader(200, {"Content-Type": "application/javascript"});
			res.write(jqueryJs);
			res.end();
		},

		indexJs: function indexJS(req, res) {
			res.writeHeader(200, {"Content-Type": "application/javascript"});
			res.write(indexJs);
			res.end();
		},

		indexCss: function indexCss(req, res) {
			res.writeHeader(200, {"Content-Type": "text/css"});
			res.write(css);
			res.end();
		},

		mp3: function mp3(req, res) {
			var bestStream = fs.createReadStream("static/mp3/Portal2-13-Want_You_Gone.mp3");
			bestStream.pipe(res);
		}
	};
};