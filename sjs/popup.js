var gpList = {};
let initList = null;
let RedBall = [];
let BlueBall = [];
var batch = false;
var batchList = [];

function init() {
  RedBall = [];
  BlueBall = [];
  for (let i = 1; i < 36; i++) {
    RedBall.push(i);
  }
  for (let i = 1; i < 13; i++) {
    BlueBall.push(i);
  }
}

function gz2Number(gz) {
  let gnum = 0,
    znum = 0;
  calendarChange.Gan.forEach((item, index) => {
    if (item === gz.substr(0, 1)) {
      gnum = index;
    }
  });
  calendarChange.Zhi.forEach((item, index) => {
    if (item === gz.substr(1, 1)) {
      znum = index;
    }
  });
  return gnum + "-" + znum;
}

function randomFun(gz, index, seed) {
  if (index <= 4) {
    // blue
    return getGroupNumber(calcNumber(gz, seed), RedBall);
  } else {
    // red
    return getGroupNumber(calcNumber(gz, seed), BlueBall);
  }
}

function getGroupNumber(num, Arr) {
  if (num >= Arr.length) {
    return getGroupNumber(num % Arr.length, Arr);
  } else {
    return Arr.splice(num, 1)[0];
  }
}

function createNumber(number) {
  const time = new Date();
  var tgdz = calendarChange.solar2lunar(
    time.getFullYear(),
    time.getMonth() + 1,
    time.getDate()
  );
  var timeGz =
    gz2Number(tgdz.gzYear) +
    "-" +
    gz2Number(tgdz.gzMonth) +
    "-" +
    gz2Number(tgdz.gzDay) +
    "-" +
    time.getHours() / 2;
  var timeArr = timeGz.split("-");
  let result = [];
  timeArr.forEach((item, index) => {
    result.push(randomFun(item, index, number));
  });

  // $("#code").val(timeGz);
  if (batch) {
    batchList.push(sort(result).join(","));
    if (!batchList.includes($("#code").val())) {
      setTimeout(() => {
        init();
        createNumber(number + 1);
      }, 1);
    } else {
      batch = false;
    }
    $("#number").html(number);
  } else {
    $("#number").html($("#number").html() + "<br/>" + result.join(","));
  }
}

$(function () {
  $("#create").click(() => {
    init();
    var value = $("#code").val();
    createNumber(value);
  });
  $("#batchCreate").click(() => {
    init();
    batch = true;
    createNumber(1);
  });
  $("#stopCreate").click(() => {
    batch = false;
  });
});
