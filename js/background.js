chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({url: chrome.runtime.getURL('main.html')});
});
