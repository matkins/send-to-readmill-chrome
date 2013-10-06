/*
  If there are supported links in the page the
  content script sends a message. The page action
  icon is then shown
*/
function handleMessageFromContentScript(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  chrome.pageAction.onClicked.addListener(handlePageActionClick);
  sendResponse({});
}

/*
  When the page action icon is clicked, the content
  script is notified
*/
function handlePageActionClick(tab) {
    sendMessageToContentScript(tab, {});
}

/*
  Helper to send a message to the content script running in
  a certain tab
*/
function sendMessageToContentScript(tab, message) {
  chrome.tabs.sendMessage(tab.id, message, function(response) {});
}

/*
  Listen for messages from the content scripts
*/
chrome.extension.onRequest.addListener(handleMessageFromContentScript);
