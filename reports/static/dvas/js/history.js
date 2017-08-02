$(document).ready(function() {
  $.extend($.expr[':'], {
      'containsi': function(elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').toLowerCase()
        .indexOf((match[3] || "").toLowerCase()) >= 0;
      }
    });
  function search(element, term) {
    $(element).not(":containsi('" + term + "')").each(function(e)   {
      $(this).addClass('hidden');
    });
    $(element+":containsi('" + term + "')").each(function(e) {
      $(this).removeClass('hidden');
    });
  }
  $(".test-search").keyup(function(){
    var term = $(".test-search").val();
    search(".test", term);
  });
  $(".config-search").keyup(function(){
    var term = $(".config-search").val();
    search(".config", term);
  });
  $('#test_report_table').dataTable({
    aaSorting: [[0, 'desc']],
    stripeClasses: [],
    "oLanguage": {
      "sLengthMenu": "Display _MENU_ per page:",
      "sEmptyTable": "No reports found",
      "sSearch": "<img src=/static/dvas/images/forminfo-hover.png\
      id=search title='Search by timestamp, configuration, whether the test" +
      "passed and failed, and test group.'> Search:"
    }
  });

  dvas.utils.init();
  $('#btnExpandFilter').on('click', function(){
    $('#filter-form').collapse("show");
  });
  $('#btnCollapseFilter').on('click', function(){
    $('#filter-form').collapse("hide");
  })
  $('#btnSelectAllGroup').on('click', function() {
    $('.test-group').children().each(function(i) {
      var label = $(this);
      label.addClass('active');
      label.find('input').prop('checked', true);
    });
  });

  $('#btnUnselectAllGroup').on('click', function() {
    $('.test-group').children().each(function(i) {
      var label = $(this);
      label.removeClass('active');
      label.find('input').prop('checked', false);
    });
  });
  $('#btnSelectAllConfig').on('click', function() {
    $('.config-group').children().each(function(i) {
      var label = $(this);
      label.addClass('active');
      label.find('input').prop('checked', true);
    });
  });
  $('#btnUnselectAllConfig').on('click', function() {
    $('.config-group').children().each(function(i) {
      var label = $(this);
      label.removeClass('active');
      label.find('input').prop('checked', false);
    });
  });
  // $('#search').attr("data-toggle", "tooltip");
  // $('#search').attr("data-placement", "left");
  // $('#search').attr("type", "text");
  // $('#search').attr("data-original-title", "Search by timestamp, configuration, whether the test passed and failed, and test group.");

  // $('#search').uitooltip({
  //   position: {
  //     my: "left"
  //   }
  // });
  // $('[data-toggle="tooltip"]').tooltip();
});
