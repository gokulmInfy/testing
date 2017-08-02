var dvas = dvas || {};
dvas.test_step = {
  assertionCount: 0,
  headerCount: 0,
  queryCount: 0,
  contextVarCount: 0,

  clear: function() {
    $("#testStepRequest").addClass('hidden');
    $("#divHttpBody").addClass('hidden');

    $('#assertionHtml').html('');
    $('#headerHtml').html('');
    $('#queryHtml').html('');
    $('#contextHtml').html('');
    $('#settingsDiv').html('');

    dvas.test_step.assertionCount = 0;
    dvas.test_step.headerCount = 0;
    dvas.test_step.queryCount = 0;
    dvas.test_step.contextVarCount = 0;
    dvas.test_step.code_mirror.setValue('');
  },

  template_request: function(action, params, successCallback) {
    var templatesUrl = $("#templates_url").val();
    var projectName = $("#project_name").val();
    params['project'] = projectName
    params['action'] = action
    var progressHtml = dvas.utils.getProgressHtml();
    $('#divProgress').html(progressHtml);
    $.get(templatesUrl, params).done(function(data) {
      $("#divProgress").html('');
      successCallback(data);
    });
  },

  category_load: function(hook) {
    var category = $('#category option:selected').val();
    var params = { 'category': category };
    dvas.test_step.template_request('names', params, function(data) {
      $("#divTemplate").removeClass("hidden");
      var names = data.names;
      var template = $("#templateSelectTemplate").html();
      Mustache.parse(template);
      var view = { 'names': names };
      var rendered = Mustache.render(template, view);
      var selectHtml = $('#template');
      selectHtml.html(rendered);
      if (hook !== undefined) {
        hook();
      }
    });
  },

  template_parse: function(responseTemplate) {
    if ('http_template' in responseTemplate) {
      $("#testStepRequest").removeClass('hidden');
      var httpTemplate = responseTemplate.http_template;
      $('#resourceUrl').val(httpTemplate.url_path);
      $('#httpVerb').val(httpTemplate.verb);
      $('#postDelay').val(httpTemplate.post_delay);
      if (httpTemplate.query_params !== null) {
        for (var query_key in httpTemplate.query_params) {
          var query_value = httpTemplate.query_params[query_key];
          dvas.test_step.add_query_param(query_key, query_value);
        }
      }
      if (httpTemplate.headers !== null 
          && !($.isEmptyObject(httpTemplate.headers))) {
        for (var header_key in httpTemplate.headers) {
          var header_value = httpTemplate.headers[header_key];
          dvas.test_step.add_header(header_key, header_value);
        }
      }
      var verb = $('#httpVerb').val();
      if(verb === "POST" || verb === "PUT" || verb === "PATCH") {
        code_mirror = dvas.test_step.code_mirror;
        $("#divHttpBody").removeClass('hidden');
        code_mirror.refresh();
        code_mirror.setValue(httpTemplate.body);
      }

      for (var i = 0; i < httpTemplate.settings.length; ++i) {
        var setting = httpTemplate.settings[i];
        var template = $('#templateSetting').html();
        Mustache.parse(template);
        var view = {
          'name': setting.name,
          'label': setting.label,
          'options': setting.options,
          'options_json': JSON.stringify(setting.options),
        }
        var rendered = Mustache.render(template, view);
        $('#settingsDiv').append(rendered);
        if (setting.selected !== null) {
          $('#setting-name-' + setting.name).val(setting.selected);
        }
      }

      for (var i = 0; i < httpTemplate.assertions.length; ++i) {
        var assertion = httpTemplate.assertions[i];
        dvas.test_step.add_assertion(
          assertion.option, assertion.lhs, assertion.operator, assertion.rhs
        );
      }
      for (var i = 0; i < httpTemplate.context_vars.length; ++i) {
        var context_var = httpTemplate.context_vars[i];
        dvas.test_step.add_context_variable(
          context_var.name, context_var.selector_type, context_var.selector
        );
      }
    }
  },

  template_load: function() {
    var templateName = $('#template option:selected').val();
    var category = $('#category option:selected').val();
    var params = { 'category': category, 'name': templateName, }
    dvas.test_step.clear();
    dvas.test_step.template_request('template', params, function(data) {
      var responseTemplate = data.template;
      dvas.test_step.template_parse(responseTemplate);
    });
  },

  update_assertops: function(count, lhs) {
    var selected = $('#assertionOption' + count + ' option:selected').val();
    var view = {
      'count': count,
      'lhs': lhs
    }

    var options_template = $('#assertionOptionValidOpsTemplate' + selected).html();
    Mustache.parse(options_template);
    var options_rendered = Mustache.render(options_template, view);
    $('#assertionOperator' + count).html(options_rendered);

    var valid_lhs_template = $('#assertionValidLhsTemplate' + selected).html();
    Mustache.parse(valid_lhs_template);
    var valid_lhs_rendered = Mustache.render(valid_lhs_template, view);
    $('#lhsAssertionValue' + count).html(valid_lhs_rendered);
  },

  init_asserts: function(count, option, lhs, operator, rhs) {
    // set defaults if passed in
    if (option) {
      $('#assertionOption' + count + ' option:selected').prop(
        'selected', false);
      $('#assertionOption' + count + ' option[value=' + option + ']').prop(
        'selected', true
      );
    }
    dvas.test_step.update_assertops(count, lhs);
    if (operator) {
      $('#assertionOperator' + count + ' option:selected').prop(
        'selected', false);
      $('#assertionOperator' + count + ' option[value=' + operator + ']').prop(
        'selected', true
      );
    }
  },

  add_assertion: function(option, lhs, operator, rhs) {
    var template = $("#assertionTemplate").html();
    Mustache.parse(template);
    var count = dvas.test_step.assertionCount;
    var view = { 
      'count': count, 
      'option': option,
      'lhs': lhs,
      'operator': operator,
      'rhs': rhs,
    };
    var rendered = Mustache.render(template, view);
    $("#assertionHtml").append(rendered);

    dvas.test_step.init_asserts(count, option, lhs, operator, rhs);
    $('#assertionOption' + count).change(function(){
      dvas.test_step.update_assertops(count, lhs);
    });

    $('#btnRemoveAssertion' + count).click(function() {
      $("#assertionDiv" + count).html('');
    });

    dvas.test_step.assertionCount++;
  },

  add_header: function(name, value) {
    var template = $("#headerTemplate").html();
    Mustache.parse(template);
    var count = dvas.test_step.headerCount;
    var view = {
        'name': name,
        'value': value,
        'count': count,
    };
    var rendered = Mustache.render(template, view);
    var headerHtml = $('#headerHtml');
    headerHtml.append(rendered);
    $('#btnRemoveHeader' + count).click(function() {
      $("#headerDiv" + count).html('');
    });
    dvas.test_step.headerCount++;
  },

  add_context_variable: function(name, selector_type, selector) {
    var template = $("#contextTemplate").html();
    Mustache.parse(template);
    // TODO: handle count
    var count = dvas.test_step.contextVarCount;
    var view = {
        'count': count,
        'contextName': name,
        'contextSelector': selector,
    };
    var rendered = Mustache.render(template, view);
    var contextHtml = $('#contextHtml');
    contextHtml.append(rendered);
    if (selector_type != "") {
      $("#contextSelectorType" + count).val(selector_type)
    }

    $('#btnRemoveContext' + count).click(function() {
      $("#contextDiv" + count).html('');
    });
    dvas.test_step.contextVarCount++;
  },

  add_query_param: function(name, value) {
    var template = $("#queryTemplate").html();
    Mustache.parse(template);
    var count = dvas.test_step.queryCount;
    var view = {
        'name': name,
        'value': value,
        'count': dvas.test_step.queryCount,
    };
    var rendered = Mustache.render(template, view);
    var queryHtml = $('#queryHtml');
    queryHtml.append(rendered);

    $('#btnRemoveQuery' + count).click(function() {
      $("#queryDiv" + count).html('');
    });
    dvas.test_step.queryCount++;
  },

  init: function() {
    dvas.utils.init();
    var httpBody = document.getElementById("httpBody");
    var config = {
      lineNumbers: true,
      mode: { name: "javascript", json: true },
    };
    dvas.test_step.code_mirror = CodeMirror.fromTextArea(httpBody, config);
    var code_mirror = dvas.test_step.code_mirror;
    $('#btnAddHeader').click(function() {
      dvas.test_step.add_header("", "");
    });
    $('#btnAddQueryParam').click(function() {
      dvas.test_step.add_query_param("", "");
    });
    $('#btnAddAssertion').click(function() {
      dvas.test_step.add_assertion("", "", "", "");
    });
    $('#btnAddContextVar').click(function() {
      dvas.test_step.add_context_variable("", "", "");
    });

    var initial_vals = $("#initial_vals").val();
    if (initial_vals !== "") { 
      // TODO: finish handling initial vals
      var template = JSON.parse(initial_vals).template;
      $("#category").val(template.category);
      dvas.test_step.category_load(function() {
        $("#template").val(template.name);
        dvas.test_step.template_parse(template);
      });
    }

    $('#template').change(function() {
      dvas.test_step.template_load();
    });

    $('#category').change(function() {
        dvas.test_step.category_load();
    });

    $('#httpVerb').change(function(){
       if ($(this).val() == "POST" ||
          $(this).val() == "PUT" ||
          $(this).val() == "PATCH") {
          $("#divHttpBody").removeClass('hidden');
      }else{
          $("#divHttpBody").addClass('hidden');
      }
    })
  },
};

$(document).ready(function(){
  dvas.test_step.init();
});

// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
