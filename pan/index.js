const url = "/s/";
var fs = require("fs");
const p = require('path')
const { HttpsProxyAgent } = require('https-proxy-agent');
var https = require("https");
const index = process.argv.slice(2)[0] ? process.argv.slice(2)[0].replace('--worker=', '') : 1
var config = require("./config.js"); // 引入confi
function dirPath(pa) {
  return p.join(__dirname, pa)
}
let startIndex = config.itemIndex; // 根据file里的doIndex页的第几个
let resultIndex = config.saveIndex;
let doIndex = config.fileIndex + ((+index - 1) * 100)  // 根据f ile里的内容的尾数 定义开始的索引

function doPa(fileIndex) {
  const file = config.head;
  const resourcePath = file + fileIndex;
  var queryList = require(dirPath("./list/" + file + "/" + resourcePath + ".json"));
  query(startIndex);
  let result = [];

  function query(index) {
    const path = queryList[index];
    const fullPath = "1" + path;
    const randomUA = config.userAgents[Math.floor(Math.random() * config.userAgents.length)];

    // 修改请求配置
    const options = {
      hostname: "pan.baidu.com",
      port: 443,
      path: url + fullPath,
      method: "GET",
      agent: new HttpsProxyAgent('http://127.0.0.1:7890'),
      headers: {
        "X-Forwarded-For": Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.'),
        "X-Real-IP": Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.'),
        "User-Agent": randomUA,
        // ...保留原有headers...
      }
    };

    var html = "";
    const req = https.request(options, (res) => {
      console.log("c:" + index, res.statusCode, fileIndex, options.path);
      if (res.statusCode === 200) {
        res.on("data", (d) => {
          html += d;
        });
        res.on("end", () => {
          if (!html.includes("百度网盘-链接不存在")) {
            console.log('y')
            const title = getTitle(html)
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
      continueQuery(index);
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
  process.on('SIGINT', () => {
    console.log('\n捕获中断信号，保存当前进度...');
    if (result.length > 0) {
      fs.writeFileSync(
        dirPath(`./file/${+new Date()}_INTERRUPTED.json`),
        JSON.stringify(result, "", "\t")
      );
      console.log(`已保存中断数据到 ${+new Date()}_INTERRUPTED.json`);
    }
    process.exit(0);
  });

}
doPa(doIndex);
