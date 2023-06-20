const p = require("path");
function dirPath(pa) {
  return p.join(__dirname, pa);
}

function getDetail(html) {
  const type = html.match("window.SHAREPAGETYPE='([a-z_]+)'");
  return type ? type[1] : "";
}

module.exports = {
  dirPath,
  getDetail,
};
