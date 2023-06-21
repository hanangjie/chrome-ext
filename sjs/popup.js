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
    if (i < 10) {
      RedBall.push("0" + i);
    } else {
      RedBall.push(i);
    }
  }
  for (let i = 1; i < 13; i++) {
    if (i < 10) {
      BlueBall.push("0" + i);
    } else {
      BlueBall.push(i);
    }
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
  let fullResult = "";
  let time = 0;
  let RedResult = [];
  let BlueResult = [];
  $("#start").click(() => {
    RedResult = [];
    BlueResult = [];
    time = new Date().getTime();
    init();
  });
  $("#stop").click(() => {
    time = new Date().getTime() - time;
    if (RedResult.length < 5) {
      RedResult.push(getGroupNumber(time, RedBall));
    } else if (BlueResult.length < 2) {
      BlueResult.push(getGroupNumber(time, BlueBall));
    }
    const result = `<span style="color:red">${numberSort(RedResult).join(
      ", "
    )}</span> | <span  style="color:blue">${numberSort(BlueResult).join(
      ", "
    )}</span>`;
    $("#number").html(fullResult + result);
    if (RedResult.length + BlueResult.length === 7) {
      fullResult += result + "<br/>";
    }
  });
});

function numberSort(numArr) {
  numArr.sort((v1, v2) => {
    return Math.abs(v1) - Math.abs(v2);
  });
  return numArr;
}
