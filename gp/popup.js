var gpList = {};
let initList = null;

function createEventSource() {
  const sseId = Object.keys(gpList).map((item) => {
    if (
      (item.slice(0, 2) === "00" || item.slice(0, 2) === "30") &&
      item.slice(0, 6) !== "000001"
    ) {
      return "0." + item;
    } else {
      return "1." + item;
    }
  });
  eventSource = new EventSource(
    "https://1.push2.eastmoney.com/api/qt/ulist/sse?invt=3&pi=0&pz=9&mpi=2000&secids=" +
      sseId.join(",") +
      "&ut=6d2ffaa6a585d612eda28417681d58fb&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100&po=1"
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
    dataList.forEach((item) => {
      const zf = (item.f2 / item.f18 - 1) * 100;
      const valChange = item.f4 / 100;
      total = total + +(gpList[item.f12].gu || 0) * valChange;
      html += `<li style="color:${
        zf > 0 ? "red" : "green"
      }"><a style="text-decoration: none;color:${
        zf > 0 ? "red" : "green"
      }" href="https://www.baidu.com/s?wd=${item.f14}" target="_blank">${
        item.f12
      } ${item.f14} ${(item.f2 / 100).toFixed(2)} ${zf.toFixed(2)}% ${(
        item.f8 / 100
      ).toFixed(2)}</a>
      <span data-id="${item.f12}" >删除</span></li>`;
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
