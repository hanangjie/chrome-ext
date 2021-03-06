// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.
// 发送到页面的可执行js
var links = [].slice.apply(document.getElementsByTagName('a'));
links = links.map(function(element) {
  // Return an anchor's href attribute, stripping any URL fragment (hash '#').
  // If the html specifies a relative path, chrome converts it to an absolute
  // URL.
  var href = element.href;
  /*if(href.indexOf("/share/home")!=-1){
    return href;
  }
  return 1;*/
 /* var hashIndex = href.indexOf('#');
  if (hashIndex >= 0) {
    href = href.substr(0, hashIndex);
  }*/
    return element;
});

links.sort();

// Remove duplicates and invalid URLs.
var kBadPrefix = 'javascript';
for (var i = 0; i < links.length;) {
  if (((i > 0) && (links[i] == links[i - 1])) ||
      (kBadPrefix == links[i].getAttribute("href").toLowerCase().substr(0, kBadPrefix.length))||
      (links[i].getAttribute("href").indexOf("/share/home")<0)||
      (links[i].getAttribute("href").indexOf("view=share")<0)||
      (links[i].getElementsByTagName("b").length<1)||
      (links[i].getElementsByTagName("b").length>0&&links[i].getElementsByTagName("b")[0].innerHTML==0)
      ) {
    links.splice(i, 1);
  } else {
    ++i;
  }
}

links = links.map(function(element) {
  // Return an anchor's href attribute, stripping any URL fragment (hash '#').
  // If the html specifies a relative path, chrome converts it to an absolute
  // URL.
  var href = element.href;
  /*if(href.indexOf("/share/home")!=-1){
    return href;
  }
  return 1;*/
 /* var hashIndex = href.indexOf('#');
  if (hashIndex >= 0) {
    href = href.substr(0, hashIndex);
  }*/
    return href;
});
console.log(links.length)


chrome.extension.sendRequest(links);
