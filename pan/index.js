var url = "/s/";
var fs = require("fs");

var queryList = require("./list/ca.json");
var https = require("https");
query(0);

function query(index) {
  const path = queryList[index];
  const fullPath = '1' + path;
  const options = {
    hostname: "pan.baidu.com",
    port: 443,
    path: url + fullPath,
    method: "GET",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      Host: "yun.baidu.com",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
  };

  var html = "";
  const req = https.request(options, (res) => {
    console.log("statusCode:"+index, res.statusCode);
    if (res.statusCode === 200) {
      res.on("data", (d) => {
        html += d;
      });
      res.on("end", () => {
        fs.writeFileSync("./file/" + fullPath + ".html", html);
        if (index + 1 < queryList.length) {
          query(index + 1);
        }
      });
    } else {
      if (index + 1 < queryList.length) {
        query(index + 1);
      }
    }
  });

  req.on("error", (e) => {
    console.error(e);
  });

  req.end();
}
