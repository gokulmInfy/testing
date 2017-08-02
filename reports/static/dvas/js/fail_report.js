var dvas = dvas || {};
dvas.fail_report_config = {
  selectAll: function() {
    $('.test-group').children().each(function(i) {
      var label = $(this);
      var testGroup = label.attr('name');
      var panelElem = $('#panel-' + testGroup);
      if (panelElem.hasClass("hidden")) {
        label.click();
      }
    });
  },

  unselectAll: function() {
    $('.test-group').children().each(function(i) {
      var label = $(this);
      var testGroup = label.attr('name');
      var panelElem = $('#panel-' + testGroup);
      if (!panelElem.hasClass("hidden")) {
        label.click();
      }
    });
  },

  init: function() {
    $('[data-toggle="tooltip"]').tooltip()

    $('#panelInputSelects').find('input:checkbox').change(function() {
      var checkbox = $(this);
      if (checkbox.is(':checked')) {
        $('#panel-' + checkbox.val()).removeClass('hidden');
      } else {
        $('#panel-' + checkbox.val()).addClass('hidden');
      }

    });

    $('#btnSelectAll').click(function(e) {
      dvas.fail_report_config.selectAll();
    });
    $('#btnUnselectAll').click(function(e) {
      dvas.fail_report_config.unselectAll();
    });

    $('.test-group').children().each(function(i) {
      var label = $(this);
      label.click(function() {
        var testGroup = label.attr('name');
        var panelElem = $('#panel-' + testGroup);
        if (panelElem.hasClass('hidden')) {
          panelElem.removeClass('hidden');
        } else {
          panelElem.addClass('hidden');
        }
      });
    });

  },
};

$(document).ready(function(){
  dvas.fail_report_config.init();
});

// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: