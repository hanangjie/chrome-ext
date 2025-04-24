const url = "/s/";
var fs = require("fs");
const p = require('path')
var https = require("https");
function dirPath(pa) {
    return p.join(__dirname, pa)
}
let startIndex = 1650; // 根据file里的doIndex页的第几个
let resultIndex = 2;
let doIndex = 33 // 根据file里的内容的尾数 定义开始的索引

function doPa(fileIndex) {
    const BATCH_SIZE = 10;
    let currentBatch = 0;
    const resourcePath = 'hash_' + fileIndex;
    var queryList = require(dirPath("./hashList/" + resourcePath + ".json"));
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
            console.log("statusCode:" + index, res.statusCode, fileIndex, "https://pan.baidu.com" + options.path);
            if (res.statusCode === 200) {
                res.on("data", (d) => {
                    html += d;
                });
                res.on("end", () => {
                    if (!html.includes("百度网盘-链接不存在")) {
                        const title = getTitle(html)
                        result.push({
                            url: "https://pan.baidu.com" + url + fullPath,
                            title: getTitle(html),
                            detail: getDetail(html)
                        });
                    }
                    if (currentBatch > 0) {
                        currentBatch--;
                    }
                    if (currentBatch === 0) {
                        continueQuery(index);
                    }
                });
            } else {
                if (currentBatch > 0) {
                    currentBatch--;
                }
                if (currentBatch === 0) {
                    continueQuery(index);
                }
            }
        });

        req.on("error", (e) => {
            if (currentBatch > 0) {
                currentBatch--;
            }
            if (currentBatch === 0) {
                continueQuery(index);
            }
            console.error(e);
        });

        req.end();
    }

    function continueQuery(index) {
        if (index + 1 < queryList.length) {
            if (result.length >= 100) {
                fs.writeFileSync(
                    dirPath("./result/" + resourcePath + "_" + resultIndex + ".json"),
                    JSON.stringify(result, "", "\t")
                );
                result = [];
                resultIndex = resultIndex + 1;
            }
            index++;
            query(index);
            // while (currentBatch < BATCH_SIZE && index < queryList.length) {
            //     query(index);
            //     index++;
            //     currentBatch++;
            // }
        } else {
            fs.writeFileSync(
                dirPath("./result/" + resourcePath + ".json"),
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
                dirPath(`./result/${+new Date()}_INTERRUPTED.json`),
                JSON.stringify(result, "", "\t")
            );
            console.log(`已保存中断数据到 ${+new Date()}_INTERRUPTED.json`);
        }
        process.exit(0);
    });

}
doPa(doIndex);
