var http = require("http");
var api = require("./api");
var route = require("./router").route;
var url = require("url");

var handle = {
	"/": api.index,
	"/getlights": api.getLights,
	"/setlight": api.setLight,
	"/js/dancer.js": api.dancer,
	"/js/jquery.js": api.jQuery,
	"/js/index.js": api.indexJs,
	"/mp3/wantyougone": api.mp3
}

function onRequest(req, res) {
	var pathname = url.parse(req.url).pathname;
	console.log("Request for " + pathname + " received");
	route(handle, pathname, req, res);
}

http.createServer(onRequest).listen(9191);
console.log("Server started on port 9191");