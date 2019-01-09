#实现逻辑

popup.js
将send_link.js发送给当前页面
可以在当前页面进行js操作
通过chrome.extension.sendRequest 发送请求到插件页面 
chrome.extension.onRequest.addListener 进行数据接受
完成页面操作