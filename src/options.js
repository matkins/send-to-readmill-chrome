//storage.remove('disabledFiletypes');
$(document).ready(function(){
  // Load stored filetypes options
  storage.get({'disabledFiletypes':''}, function(items){
    var disabledFiletypes = items.disabledFiletypes.split(',');
    // Set checkboxes to reflect options
    $.each(filetypes, function(idx, filetype){
      $('#detect_' + filetype).prop("checked", ($.inArray(filetype, disabledFiletypes) == -1));
    });
  });
  // Bind to filetypes checkbox change event
  $('input[type="checkbox"].filetypes').change(function(){
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

  storage.get({'pageActionEnabled':false}, function(obj){
    // Set checkbox to reflect option
    $('#pageaction_enabled')[0].checked = obj.pageActionEnabled;
  });
  // Bind to page action checkbox change event
  console.log($('input[type="checkbox"].pageaction'))
  $('input[type="checkbox"].pageaction').change(function(){
    storage.set({'pageActionEnabled': this.checked }, function(){});
  });
});
