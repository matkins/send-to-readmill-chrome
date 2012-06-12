function onRequest(request, sender, sendResponse) {
  sendResponse({});
};
chrome.extension.onRequest.addListener(onRequest);
