var gpList = {};
let initList = null;

function createEventSource() {
  const sseId = Object.keys(gpList).map((item) => {
    if (item.slice(0, 1) === "6") {
      return "1." + item;
    } else {
      return "0." + item;
    }
  });
  eventSource = new EventSource(
    "https://1.push2.eastmoney.com/api/qt/ulist/sse?invt=3&pi=0&pz=100&mpi=2000&secids=" +
      sseId.join(",") +
      "&ut=6d2ffaa6a585d612eda28417681d58fb&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100,f62&po=1"
  );
  eventSource.addEventListener("message", function (e) {
    const result = JSON.parse(e.data);
    var html = "";
    const data = result.data.diff;
    let total = 0;
    if (!initList) {
      initList = data;
    } else {
      for (let key in initList) {
        initList[key] = {
          ...initList[key],
          ...data[key],
        };
      }
    }
    const dataList = Object.values(initList);
    dataList.sort((v1, v2) => {
      if (v1.f12 === "000001") {
        return -1;
      } else if (v2.f12 === "000001") {
        return 1;
      } else {
        return v2.f2 / v2.f18 - 1 - (v1.f2 / v1.f18 - 1);
      }
    });
    console.log(dataList);
    dataList.forEach((item) => {
      const zf = (item.f2 / item.f18 - 1) * 100;
      const valChange = item.f4 / 100;
      total = total + +(gpList[item.f12].gu || 0) * valChange;
      const textCode = `${item.f13 === 0 ? "sz" : "sh"}${item.f12}`;
      html += `<li style="color:${
        zf > 0 ? "red" : "green"
      }"><a style="text-decoration: none;color:${
        zf > 0 ? "red" : "green"
      }" href="https://quote.eastmoney.com/${textCode}.html#fullScreenChart" target="_blank">${
        item.f12
      } ${item.f14} ${(item.f2 / 100).toFixed(2)} ${zf.toFixed(2)}%</a>
      <span style="float:right;margin-left:5px" data-id="${
        item.f12
      }" >删除 </span>
      <a style="float:right;margin-left:5px" href="https://quote.eastmoney.com/f1.html?newcode=${
        item.f13
      }.${item.f12}"  target="_blank">分时 </a>
      <a style="float:right;margin-left:5px" href="https://data.eastmoney.com/zjlx/${
        item.f12
      }.html#chart-k-cyq"  target="_blank">资金 </a>
      <a style="float:right;margin-left:5px" href="https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=${
        item.f13 === 0 ? "SZ" : "SH"
      }${item.f12}&color=b#/gdyj"  target="_blank">股东</a>
      &nbsp;换 ${(item.f8 / 100).toFixed(2)}%</li>`;
    });
    // $("#list").html(html + `<li>盈亏：${total}</li>`);
    $("#list").html(html);
  });
}

$(function () {
  chrome.storage.sync.get("value", function (item) {
    // Notify that we saved.
    gpList = item.value || {};
    createEventSource();
  });
  console.log(chrome.dom);
  let strWindowFeatures = `
  left=1000,
  menubar=no,
  location=no,
  resizable=no,
  scrollbars=no,
  status=no
`;
  // window.open("./popup.html", "blank", strWindowFeatures);
  $("#add").click(() => {
    var value = $("#code").val();
    if (value.includes("$")) {
      const valInfo = value.split("$");
      gpList[valInfo[0]] = { gu: valInfo[1] };
      chrome.storage.sync.set({ value: gpList }, function () {
        // Notify that we saved.
      });
    } else {
      gpList[value] = { gu: 0, cb: 11.026 };
      chrome.storage.sync.set({ value: gpList }, function () {
        // Notify that we saved.
      });
      eventSource.close();
      createEventSource();
    }
  });
  $("#list").on("click", (item) => {
    var data = $(item.target).data();
    delete gpList[data.id];
    chrome.storage.sync.set({ value: gpList }, function () {
      // Notify that we saved.
    });
  });
  $("#code").on("change", () => {
    var that = $(this);
  });
});
