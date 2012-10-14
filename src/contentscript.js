// If Send to Readmill isn't already implemented
if (typeof (Readmill) === "undefined") {
  // Define function to create button
  function readmillButton(url){
    var btn = $('<div/>', {
      'class': 'send-to-readmill',
      'data-display': 'small',
      'data-download-url': url,
      'data-buy-url': url
    });
    return $('<div />',{'class': 'send-to-readmill-wrapper'}).html(btn);
  }
  var loadReadmillJs = false;
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
    // Add links to all enabled filetypes
    if(enabledFiletypes.length > 0){
      var links = $('a:regex(href,\\.(' + enabledFiletypes.join('|') + ')([\\.\\?]|$))');
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
    }
  });
}