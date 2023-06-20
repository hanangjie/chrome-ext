const open = require("open");
const fs = require("fs");
const { dirPath } = require("./utils");
const list = fs.readdirSync(dirPath("./file"));

let startIndex = 0;
const result = [];
const key = process.argv[2];

doSearch();

function doSearch() {
  const jsonFile = list[startIndex];
  if (jsonFile.includes("json")) {
    const panJson = require(dirPath("./file/" + jsonFile));
    panJson.forEach((element) => {
      if (element?.title?.includes(key) && element?.detail === "multi_file") {
        result.push(element);
        // open(element.url);
      }
    });
  }
  startIndex += 1;
  if (startIndex < list.length) {
    doSearch();
  } else {
    fs.writeFileSync(
      dirPath("./search/" + key + ".json"),
      JSON.stringify(result, "", "\t")
    );
  }
}
