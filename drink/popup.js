var gpList = {};
let initList = null;


$(function () {
  chrome.storage.sync.get("value", function (item) {
    // Notify that we saved.
    gpList = item.value || 0;
    $("#list").html('喝水：'+gpList+'次')
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
      var num = (item.value || 0) + 1;
      $("#list").html('喝水：'+num+'次')
      chrome.storage.sync.set({ value: num }, function () {
        // Notify that we saved.
      });
    });
  });
   $("#reduce").click(() => {
    chrome.storage.sync.get("value", function (item) {
      // Notify that we saved.
      var num = (item.value || 0)-1;
      $("#list").html('喝水：'+num+'次')
      chrome.storage.sync.set({ value: num }, function () {
        // Notify that we saved.
      });
    });
  });
});
