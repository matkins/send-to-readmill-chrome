//storage.remove('disabledFiletypes');
$(document).ready(function(){
  // Load stored options
  storage.get({'disabledFiletypes':''}, function(items){
    var disabledFiletypes = items.disabledFiletypes.split(',');
    // Set checkboxes to reflect options
    $.each(filetypes, function(idx, filetype){
      $('#detect_' + filetype).prop("checked", ($.inArray(filetype, disabledFiletypes) == -1));
    });
  });
  // Bind to checkbox change event
  $('input[type="checkbox"]').change(function(){
    var filetype = $(this).attr('id').replace('detect_', '')
    storage.get({'disabledFiletypes': ''}, function(items){
      var disabledFiletypes = items.disabledFiletypes.split(',');      
      var index = $.inArray(filetype, disabledFiletypes);
      if(index >= 0){
        // Was disabled
        disabledFiletypes.splice(index,1);
      } else {
        // Was enabled
        disabledFiletypes.push(filetype);
      }
      storage.set({'disabledFiletypes': disabledFiletypes.join(',')}, function(){});
    });

  });
});