var fs = require("fs");
const p = require("path");
var https = require("https");
const zlib = require("zlib");
const lodash = require("lodash");
function dirPath(pa) {
  return p.join(__dirname, pa);
}
let startIndex = 0;
let resultIndex = 0;
const result = [];

function query(index) {
  const options = {
    hostname: "www.baidu.com",
    port: 443,
    path: `/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB&oq=%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB&rsv_pq=f397d95f00085b59&rsv_t=e8e1bs4W%2F3abqCgg%2FenGbcjyqbeht4eJ4L0fkhFur%2Fpgh1%2BGgzpAoUVlAkY&rqlang=cn&rsv_dl=tb&rsv_enter=1&si=quark.cn&ct=2097152&bs=%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB&rsv_jmp=fail&pn=${index}`,
    method: "GET",
    headers: {
      "Content-Type": "text/html",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      Cookie:
        "BIDUPSID=D34BD63A109477255A51DB1CBA61ABCD; PSTM=1687246211; BAIDUID=D34BD63A10947725BB1DE8F3BF0F6B4D:FG=1; delPer=0; BD_CK_SAM=1; PSINO=5; BD_UPN=12314753; BAIDUID_BFESS=D34BD63A10947725BB1DE8F3BF0F6B4D:FG=1; BA_HECTOR=808gag24250584aha40h840o1i92lc51o; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; ZFY=GiqMQ0lvByTDmPhThuOds7duVq45Gj2Zhwf5BpnekXA:C; H_PS_PSSID=38515_36545_38687_38876_38797_38792_38844_38809_38838_38635_26350; H_PS_645EC=7872pDdkKbVw2e8JZuOgIrs6pom9zmTtOWW432%2Fg2ZXvmdwzf%2F%2FCHIz0MwU; COOKIE_SESSION=5_0_5_5_0_3_1_0_5_2_0_3_0_0_0_0_0_0_1687246326%7C5%230_0_1687246326%7C1",
      Host: "www.baidu.com",
      Pragma: "no-cache",
      Referer:
        "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB&oq=%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB&rsv_pq=f397d95f00085b59&rsv_t=e8e1bs4W%2F3abqCgg%2FenGbcjyqbeht4eJ4L0fkhFur%2Fpgh1%2BGgzpAoUVlAkY&rqlang=cn&rsv_dl=tb&rsv_enter=1&si=quark.cn&ct=2097152",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": 1,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
    },
  };

  var html = "";
  const req = https.request(options, (res) => {
    console.log("statusCode:" + index, res.statusCode);
    // res.setEncoding("utf-8");
    var gunzip = zlib.createBrotliDecompress();
    console.log(res.headers);
    res.pipe(gunzip);
    // if (res.statusCode === 200) {
    gunzip.on("data", (d) => {
      html += d;
    });
    res.on("end", () => {
      // fs.writeFileSync(dirPath("./file/a.html"), html);
      getData(html).forEach((item) => {
        result.push({
          url: item,
          key: item.replace("https://pan.quark.cn/s/", ""),
        });
      });
      fs.writeFileSync(
        dirPath("./file/list_" + resultIndex + ".json"),
        JSON.stringify(result, "", "\t")
      );
      if (result.length >= 1000) {
        result = [];
        resultIndex = resultIndex + 1;
      }
      query(index + 10);
    });
    // }
  });

  req.on("error", (e) => {
    console.error(e);
  });
  req.end();
}

query(startIndex);

function getData(text) {
  var data = lodash.uniq(text.match(/https:\/\/pan.quark.cn[a-z0-9/]+/g));
  return data;
}
