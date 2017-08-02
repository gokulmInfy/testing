var dvas = dvas || {};
dvas.test_execution = {
  messageQueue: [],
  websocket: null,
  selectedScenarios: {},
  sent_template_messages: 0,
  received_template_messages: 0,
  already_executed: false,
  report_id: null,

  onopen: function() {
    while(dvas.test_execution.messageQueue.length > 0) {
      var msg = dvas.test_execution.messageQueue.pop();
      dvas.test_execution.websocket.send(msg);
    }
  },

  onmessage: function(evt) {
    var data = JSON.parse(evt.data);
    // TODO: incorportate message type
    // var type = data.type;
    if (data.type == "template") {
      if (++dvas.test_execution.received_template_messages
            === dvas.test_execution.sent_template_messages) {
        $("#divProgress").html('');
      }
      var msg = data.msg;
      for (var test_group in msg) {
        scenarios = msg[test_group];
        for (var scenario_name in scenarios) {
          var selectedScenarios = dvas.test_execution.selectedScenarios;
          var scenario_view = scenarios[scenario_name];
          var scenarioId = scenario_view.scenario_id;
          var scenarioElem = $('#' + scenarioId + '-scenario-div');
          var selected = scenarioId in selectedScenarios;
          if (!selected || scenarioElem.length) {
            continue;
          }
          scenario_view['test_group'] = test_group;
          scenario_view['scenario_name'] = scenario_name;
          var template = $('#executionTemplate').html();
          Mustache.parse(template);
          var rendered = Mustache.render(template, scenario_view);
          $('#executionHtml').append(rendered);
        }
      }
    } else if (data.type == "status") {
      var resultId = data['result_id'];
      var stepId = data['step_id'];
      var statusStr = data['status'];
      var latency = data['latency'];
      var stepElem = $("#step" + stepId);
      if (statusStr.toLowerCase() === 'pass') {
        stepElem.removeClass('warning');
        stepElem.addClass('success');
      } else if (statusStr.toLowerCase() === 'fail') {
        stepElem.removeClass('warning');
        stepElem.addClass('danger');
      }

      var latencyElem = $("#step" + stepId + '-latency');
      latencyElem.html(latency);

      var template = $('#resultLinkTemplate').html();
      Mustache.parse(template);
      var view = {
        'result_id': resultId,
        'status': statusStr,
      }
      var rendered = Mustache.render(template, view);
      $('#step' + stepId + '-result').html(rendered);
    } else if (data.type == "finished_scenario") {
      var scenarioId = data['scenario_id'];
      var statusStr = data['status'];
      var scenarioElem = $('#' + scenarioId + '-scenario-div');
      var scenarioStatus = $('#' + scenarioId + '-status');
      scenarioStatus.html(statusStr);
      if (statusStr.toLowerCase() === 'pass') {
        scenarioElem.removeClass('panel-warning');
        scenarioElem.addClass('panel-success');
      } else if (statusStr.toLowerCase() === 'fail') {
        scenarioElem.removeClass('panel-warning');
        scenarioElem.addClass('panel-danger');
      }
    } else if (data.type == "finished_execution") {
      var btn = $('#btnSubmit');
      btn.button('reset');
      dvas.test_execution.already_executed = true;
      var view = {
        'report_id': dvas.test_execution.report_id,
      };
      var rendered = dvas.utils.renderMustacheHtml('#reportLinkTemplate', view);
      $('#responseHtml').html(rendered);
    }

  },

  send_message: function(msg) {
    if (dvas.test_execution.websocket === null
        || dvas.test_execution.websocket.readyState == WebSocket.CLOSING
        || dvas.test_execution.websocket.readyState == WebSocket.CLOSED) {
      dvas.test_execution.messageQueue.push(msg);
      var url = $('#websocketsUrl').val();
      dvas.test_execution.websocket = new WebSocket(url);
      dvas.test_execution.websocket.onopen = dvas.test_execution.onopen;
      dvas.test_execution.websocket.onmessage = dvas.test_execution.onmessage;
      dvas.test_execution.websocket.onclose = function() {
        // TODO: handle close?
      };
    } else if (dvas.test_execution.websocket.readyState === WebSocket.OPEN) {
      dvas.test_execution.websocket.send(msg)
    } else {
      dvas.test_execution.messageQueue.push(msg);
    }
  },

  run_tests: function(data, form) {
    $('#responseHtml').html('');
    if (dvas.test_execution.already_executed === true) {
      // TODO (pk9069): would be better to regenerate html using Mustache
      // templates...
      $('.panel').each(function(i) {
        var panel = $(this);
        panel.removeClass('panel-success');
        panel.removeClass('panel-danger');
        panel.addClass('panel-warning');
      });

      $('.step-color').each(function(i) {
        var stepColor = $(this);
        stepColor.removeClass('success');
        stepColor.removeClass('danger');
        stepColor.addClass('warning');
      });

      $('.step-latency').each(function(i) {
        var stepLatency = $(this);
        stepLatency.html('N/A');
      });
      $('.step-result').each(function(i) {
        var stepResult = $(this);
        stepResult.html('N/A');
      });
      $('.scenario-status').each(function(i) {
        var scenarioStatus = $(this);
        scenarioStatus.html('Waiting to start...');
      });
    }

    var btn = $('#btnSubmit');
    if (data['status'] === 'error') {
      dvas.utils.textResponse('danger', data.message);
      btn.button('reset');
    } else {
      var report_id = data.report_id;
      dvas.test_execution.report_id = report_id;
      var msg = {
        'uuid': report_id,
      }
      dvas.test_execution.send_message(JSON.stringify(msg));
      var selectedScenarios = dvas.test_execution.selectedScenarios;
      for (var selectedScenario in selectedScenarios) {
        if (selectedScenarios[selectedScenario] === true) {
          var scenarioStatusElem = $('#' + selectedScenario + '-status');
          scenarioStatusElem.html('Running...');
        }
      }
    }
  },

  /* TODO: finish errorCallback */
  formToAjax: function(table, resetButton) {
    successCallback = dvas.test_execution.run_tests;
    $("form").each(function() {
        var form = $(this);
    //var form = $('#executionOptionsForm');
    form.unbind('submit');

    form.submit(function(e){
      var table_data = table.$('input, select').serialize();
      var btn = $('#btnSubmit');
      btn.button('loading');
      $.ajax({
          url: form.attr('action'),
          type: form.attr('method'),
          data: (form.serialize() + '&' + table_data),
          success: function(data, textStatus, jqXHR) {
              if (resetButton !== undefined && resetButton == true) {
                  btn.button('reset')
              }
              successCallback(data, textStatus, jqXHR)
          }
      });
      return false;
    });
      });
  },

  init: function() {
    var hasWebsockets = "WebSocket" in window;
    if (!hasWebsockets) {
      // TODO: handle no websocket support more elegantly
      alert(
          'Your browser does not support the WebSocket protocol, which is'
          + ' required for this page to work.'
      );
      return;
    }
    dvas.utils.init();


    // Firefox autocomplete can really get in the way sometimes....
    var allInputs = $(":input");
    $(allInputs).attr('autocomplete', 'off');

    table = $('#scenario-table').dataTable();
    dvas.test_execution.formToAjax(table);

    $('#btnExpandAll').click(function(e) {
      $('.panel-collapse').collapse('show');
    });
    $('#btnCollapseAll').click(function(e) {
      $('.panel-collapse').collapse('hide');
    });

    table.$('label').click(function() {
      var label = $(this);
      var scenarioId = label.attr('name');
      var scenarioElem = $('#' + scenarioId + '-scenario-div');

      var selectedScenarios = dvas.test_execution.selectedScenarios;
      if (scenarioId in selectedScenarios) {
        delete selectedScenarios[scenarioId];
        if (scenarioElem.length) {
          scenarioElem.addClass('hidden');
        }
      } else {
        selectedScenarios[scenarioId] = true
        if (scenarioElem.length) {
          scenarioElem.removeClass('hidden');
        } else {
          var msg = {
            'templates': [ scenarioId ],
          };
          dvas.test_execution.send_message(JSON.stringify(msg));
          ++dvas.test_execution.sent_template_messages;
          var progressHtml = dvas.utils.getProgressHtml();
          $('#divProgress').html(progressHtml);
        }
      }
    });

    // TODO: set up listener for selecting test groups
  },
};

$(document).ready(function(){
  dvas.test_execution.init();
});

// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
