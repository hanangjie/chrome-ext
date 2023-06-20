const fs = require("fs");
var https = require("https");
const { dirPath, getDetail } = require("./utils");
const list = fs.readdirSync(dirPath("./file"));
let listIndex = 0;
let item = null;

buqiDo(listIndex);

function buqiDo() {
  item = list[listIndex];
  if (listIndex < list.length) {
    if (item.includes("json")) {
      const jsonList = require(dirPath("./file/" + item));
      if (jsonList[0] && jsonList[0].detail === undefined) {
        query(0, jsonList);
      } else {
        listIndex = listIndex + 1;
        buqiDo();
      }
    }
  } else {
    console.log("end");
  }
}

function query(index, jsonList) {
  console.log(jsonList[index].url.replace("https://pan.baidu.com", ""));
  const options = {
    hostname: "pan.baidu.com",
    port: 443,
    path: jsonList[index].url.replace("https://pan.baidu.com", ""),
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
        jsonList[index].detail = getDetail(html);
        if (index + 1 < jsonList.length) {
          query(index + 1, jsonList);
        } else {
          fs.writeFileSync(
            dirPath("./file/" + item),
            JSON.stringify(jsonList, "", "\t")
          );
          listIndex = listIndex + 1;
          buqiDo();
        }
      });
    } else {
      if (index + 1 < jsonList.length) {
        query(index + 1, jsonList);
      } else {
        fs.writeFileSync(
          dirPath("./file/" + item),
          JSON.stringify(jsonList, "", "\t")
        );
        listIndex = listIndex + 1;
        buqiDo();
      }
    }
  });

  req.on("error", (e) => {
    console.error(e);
  });

  req.end();
}
