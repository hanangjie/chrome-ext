var key = [];
var line = new Array(26);
var fs = require("fs");
var head = "ca";

var queryList = [];
for (var i = 0; i < line.length; i++) {
  key.push(String.fromCharCode(65 + i).toLocaleLowerCase());
  key.push(String.fromCharCode(65 + i));
  if (i < 10) {
    key.push(i);
  }
}

// for (var i = 0; i < key.length; i++) {
//   var a = "";
//   a += key[i];
for (var q = 0; q < key.length; q++) {
  var b = head;
  b = b + key[q];
  for (var i1 = 0; i1 < key.length; i1++) {
    var b1 = head;
    b1 = b + key[i1];
    for (var q1 = 0; q1 < key.length; q1++) {
      var b2 = "";
      b2 = b1 + key[q1];
      for (var q2 = 0; q2 < key.length; q2++) {
        var c = "";
        c = b2 + key[q2];
        queryList.push(c);
      }
    }
  }
}
// }

fs.writeFileSync("./list/" + head + ".json", JSON.stringify(queryList));
