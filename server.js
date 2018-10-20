const fs = require("fs");
const http = require("http");
const route = require("./router").route;
const url = require("url");

const PORT = 9191;
let username = null;

try {
  username = JSON.parse(fs.readFileSync("config.json", {encoding: "utf8"})).username;
} catch {
  console.log(`config.json not found - please press the link button on your Hue bridge and open localhost:${PORT}/createuser in your browser`);
}

const api = require("./api")(process.argv[2], username);

const handle = {
  "/": api.indexServe,
  "/getlights": api.getLights,
  "/setlight": api.setLight,
  "/createuser": api.createUser,
  "/js/dancer.js": api.dancer,
  "/js/jquery.js": api.jQuery,
  "/js/index.js": api.indexJs,
  "/css/index.css": api.indexCss,
  "/mp3/wantyougone": api.mp3
}

function onRequest(req, res) {
  const pathname = url.parse(req.url).pathname;
  console.log(`Request for ${pathname} received`);
  route(handle, pathname, req, res);
}

http.createServer(onRequest).listen(PORT);
console.log(`Server started on port ${PORT}`);
