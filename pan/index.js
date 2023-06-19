const url = "/s/";
var fs = require("fs");
const p = require('path')
var https = require("https");
function dirPath(pa) {
  return p.join(__dirname, pa)
}
let startIndex = 2000;
let resultIndex = 2;
let doIndex = 59

function doPa(fileIndex) {
  const file = "ca";
  const resourcePath = file + fileIndex;
  var queryList = require(dirPath("./list/" + file + "/" + resourcePath + ".json"));
  query(startIndex);
  let result = [];

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
              detail: getDetail(html)
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
          dirPath("./file/" + resourcePath + "_" + resultIndex + ".json"),
          JSON.stringify(result, "", "\t")
        );
        result = [];
        resultIndex = resultIndex + 1;
      }
      query(index + 1);
    } else {
      fs.writeFileSync(
        dirPath("./file/" + resourcePath + ".json"),
        JSON.stringify(result, "", "\t")
      );
      startIndex = 0;
      doPa(fileIndex + 1);
      resultIndex = 0;
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
  function getDetail(html) {
    const type = html.match('window.SHAREPAGETYPE=\'([a-z_]+)\'')
    return type ? type[1] : '';
  }
}
doPa(doIndex);
