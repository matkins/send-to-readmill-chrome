// If Send to Readmill isn't already implemented
if (typeof (Readmill) === "undefined") {
  // If there any links to ePUB files
  var links = $('a:regex(href,\\.epub([\\.\\?]|$))');
  if (links.length > 0) {
    // Add Send to Readmill anchors
    $(links).each(function (index, link) {
      var btn = $('<div/>', {
        'class': 'send-to-readmill',
        'data-display': 'small',
        'data-download-url': link.href,
        'data-buy-url': window.location.href
      });
      // Create wrapper div
      var wrapper = $('<div />',{'class': 'send-to-readmill-wrapper'});
      wrapper.html(btn)
      $(link).after(wrapper);
    });
    // Load Send to Readmill script
    (function() {
      var st = document.createElement('script'); st.type = 'text/javascript'; st.async = true;
      st.src = 'https://platform.readmill.com/send.js';
      var p = document.getElementsByTagName('script')[0]; p.parentNode.insertBefore(st, p);
    })();
  };
}