var gpList = {};
let initList = null;


$(function () {
  const now = new Date()
  const time = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  chrome.storage.sync.get("value", function (item) {
    // Notify that we saved.
    gpList = item.value?.[time] || 0;
    $("#list").html('喝完：'+gpList+'次')
    let html = ''
    Object.keys(item.value).forEach((key) => {
      html +=`<div>${key}: ${item.value[key]}次</div>`
    })
    $('#history').html(html)
  });
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
    chrome.storage.sync.get("value", function (item) {
      // Notify that we saved.
      var num = (item.value?.[time] || 0) + 1;
      $("#list").html('喝完：'+num+'次')
      chrome.storage.sync.set({ value: {...item.value,[time]:num} }, function () {
        // Notify that we saved.
      });
    });
  });
   $("#reduce").click(() => {
    chrome.storage.sync.get("value", function (item) {
      // Notify that we saved.
      var num = (item.value?.[time] || 0)-1;
      $("#list").html('喝完：'+num+'次')
      chrome.storage.sync.set({ value: {...item.value,[time]:num} }, function () {
        // Notify that we saved.
      });
    });
  });
});
