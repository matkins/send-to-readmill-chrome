/*
  Return 'Send to Readmill' button DOM element
  for a given URL
*/
function readmillButton(url){
  var btn = $('<div/>', {
    'class': 'send-to-readmill',
    'data-display': 'small',
    'data-download-url': url,
    'data-buy-url': url
  });
  return $('<div />',{'class': 'send-to-readmill-wrapper'}).html(btn);
}

/*
  Checks for enabled filetypes in the options store.
  Returns a jQuery.Promise that passes an array of filetypes when resolved
*/
function getEnabledFiletypes() {
  var d = $.Deferred();
  // Work out which filetypes are enabled
  var enabledFiletypes = filetypes;
  storage.get({'disabledFiletypes':''}, function(items){
    var disabledFiletypes = items.disabledFiletypes.split(",");
    $.each(disabledFiletypes, function(idx, filetype){
      var index = $.inArray(filetype, enabledFiletypes);
      if (index >= 0){
        enabledFiletypes.splice(index,1);
      }
    });

    d.resolve(enabledFiletypes);
  });
  return d.promise();
}

function linksToEnabledFiletypesInDocument(enabledFiletypes) {
  return $('a:regex(href,\\.(' + enabledFiletypes.join('|') + ')([\\.\\?]|$))');
}

/*
  Add buttons to all enabled filetypes in the document
*/
function addLinksToAllEnabledFiletypes(enabledFiletypes) {
  // Don't apply links if Readmill already in the page
  if (!sendToReadmillNotImplemented()) { return; }

  var loadReadmillJs = false;
  // Add links to all enabled filetypes
  if(enabledFiletypes.length > 0){
    var links = linksToEnabledFiletypesInDocument(enabledFiletypes);
    if (links.length > 0) {
      // Add Send to Readmill anchors
      $(links).each(function (index, link) {
        $(link).after(readmillButton(link.href));
      });
      loadReadmillJs = true;
    }
    // If on manybooks.net
    if (($.inArray('epub', enabledFiletypes) >= 0) && (/^https?:\/\/.*manybooks\.net\//.test(document.location.href))){
      var tid = $('input[name="tid"]').val();
      if (tid && $('select[name="book"]').find('option[value$="epub"]').length){
        var url = "http://s3.amazonaws.com/manybooksepub_new/" + tid + "epub.epub";
        $('#submit_button').after(readmillButton(url));
        loadReadmillJs = true;
      }
    }
    if(loadReadmillJs){
      // Load Send to Readmill script
      (function() {
        var st = document.createElement('script'); st.type = 'text/javascript'; st.async = true;
        st.src = 'https://platform.readmill.com/send.js';
        var p = document.getElementsByTagName('script')[0]; p.parentNode.insertBefore(st, p);
      })();
    };
    readmillLoaded = true;
  }
}

/*
  Returns a jQuery.Promise that resolves to a boolean
  stating whether the page action should be used
*/
function shouldUsePageAction() {
  var d = $.Deferred();
  storage.get({'pageActionEnabled':false}, function(obj){
    d.resolve(obj.pageActionEnabled);
  });
  return d.promise();
}

/*
  Show a page action in the URL bar. When clicked the
  the links are embedded into the document
*/
function showPageActionToEmbedLinks(files) {
  // Show page action
  chrome.extension.sendRequest({}, function(response) {});
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      addLinksToAllEnabledFiletypes(files);
    }
  );
}

/*
  Returns a boolean indicated that Send to Readmill
  isn't implemented in the document yet
*/
function sendToReadmillNotImplemented() {
  return ($('script[src="https://platform.readmill.com/send.js"]').length === 0) && (typeof (Readmill) !== "object");
}

/*
  The main code
*/
if (sendToReadmillNotImplemented()) {
  // Check the config
  $.when(getEnabledFiletypes(), shouldUsePageAction())
    .done(function (enabledFiletypes, shouldUsePageAction) {
      if (enabledFiletypes.length > 0) {
        if (   shouldUsePageAction
            && linksToEnabledFiletypesInDocument(enabledFiletypes).length > 0) {
          showPageActionToEmbedLinks(enabledFiletypes);
        } else {
          addLinksToAllEnabledFiletypes(enabledFiletypes);
        }
      }
    });
}
