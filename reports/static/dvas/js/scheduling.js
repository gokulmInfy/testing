var dvas = dvas || {};
dvas.scheduling = {
  init: function() {
    dvas.utils.init();
    $('#startdatepicker').datetimepicker();
    $('#enddatepicker').datetimepicker();
  },
};

$(document).ready(function(){
  dvas.scheduling.init();
});

// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
