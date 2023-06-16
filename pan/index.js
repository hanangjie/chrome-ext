const url = "/s/";
var fs = require("fs");
var https = require("https");

function doPa() {
  const file = "ca";
  const fileIndex = 1;
  const path = file + fileIndex;
  var queryList = require("./list/" + file + "/" + path + ".json");
  query(0);
  let result = [];
  let resultIndex = 0;

  function query(index) {
    const path = queryList[index];
    const fullPath = "1" + path;
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
      console.log("statusCode:" + index, res.statusCode);
      if (res.statusCode === 200) {
        res.on("data", (d) => {
          html += d;
        });
        res.on("end", () => {
          if (!html.includes("百度网盘-链接不存在")) {
            result.push({
              url: "https://pan.baidu.com" + url + fullPath,
              title: getTitle(html),
            });
          }
          continueQuery(index);
        });
      } else {
        continueQuery(index);
      }
    });

    req.on("error", (e) => {
      console.error(e);
    });

    req.end();
  }

  function continueQuery(index) {
    if (index + 1 < queryList.length) {
      if (result.length >= 100) {
        fs.writeFileSync(
          "./file/" + path + "_" + resultIndex + ".json",
          JSON.stringify(result, "", "\t")
        );
        result = [];
        resultIndex = resultIndex + 1;
      }
      query(index + 1);
    } else {
      fs.writeFileSync(
        "./file/" + path + ".json",
        JSON.stringify(result, "", "\t")
      );
    }
  }

  function getTitle(html) {
    const title = html.match(/<title>(.+)<\/title>/);
    if (title) {
      return title[0]
        .replace("<title>", "")
        .replace("</title>", "")
        .replace("_免费高速下载|百度网盘-分享无限制", "");
    }
  }
}
doPa();
