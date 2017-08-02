var dvas = dvas || {};
dvas.configuration_detail = {
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

    $('#btnExpandAll').click(function(e) {
      $('.panel-collapse').collapse('show');
    });
    $('#btnCollapseAll').click(function(e) {
      $('.panel-collapse').collapse('hide');
    });

    $('#btnSelectAll').click(function(e) {
      dvas.configuration_detail.selectAll();
    });
    $('#btnTEST').click(function(e) {
      dvas.configuration_detail.selectAll();
    });
    $('#btnTEST1').click(function(e) {
      dvas.configuration_detail.unselectAll();
    });
    $('#btnUnselectAll').click(function(e) {
      dvas.configuration_detail.unselectAll();
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
  dvas.configuration_detail.init();
});

// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
