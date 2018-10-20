const fs = require("fs");
const http = require("http");
const lame = require("lame");
const Speaker = require("speaker");
const stream = require("stream");
const qs = require("querystring");

// Pages
const indexHtml = fs.readFileSync("static/html/index.html", {encoding: "utf8"});
const dancerJs = fs.readFileSync("static/js/dancer.js", {encoding: "utf8"});
const jqueryJs = fs.readFileSync("static/js/jquery.js", {encoding: "utf8"});
const indexJs = fs.readFileSync("static/js/index.js", {encoding: "utf8"});
const css = fs.readFileSync("static/css/index.css", {encoding: "utf8"});

module.exports = function(hue_ip, username) {
  return {
    getLights: function getLights(req, res) {
      var options = {
        host: hue_ip,
        path: `/api/${username}/lights`,
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
              host: hue_ip,
              path: `/api/${username}/lights/${reqId}/state`,
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

    createUser: function createUser(req, res) {
      const postData = JSON.stringify({
        devicetype: "hue-disco"
      });
      const hueReq = http.request({
        host: hue_ip,
        path: "/api",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
        }
      }, function(hueRes) {
        let output = "";
        hueRes.on("data", function(chunk) {
          output += chunk;
        });

        hueRes.on("end", function() {
          const outputJson = JSON.parse(output);
          if (outputJson.success && outputJson.success.username) {
            fs.writeFileSync("config.json", JSON.stringify({username: outputJson[0].success.username}));
          }

          res.write(output);
          res.end();
        });
      });

      hueReq.write(postData);
      hueReq.end();
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
