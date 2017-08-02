var dvas = dvas || {};
dvas.utils = {

    init: function() {
        $('button').button('reset')
        Mustache.tags = ['[[', ']]'];
        var csrftoken = $.cookie('csrftoken');
        var csrfSafeMethod = function(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    },

    /* TODO: finish errorCallback */
    formsToAjax: function(successCallback, errorCallback, resetButton) {
        $("form").each(function() {
            var form = $(this);
            form.unbind('submit');
            form.submit(function(e){
                var btn = form.find(':submit');
                btn.button('loading');
                $.ajax({ 
                    url: form.attr('action'),
                    type: form.attr('method'),
                    data: form.serialize(),
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

    renderMustacheHtml: function(idSelector, view) {
        var template = $(idSelector).html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, view);
        return rendered;
    },

    textResponse: function(type, text) {
        var view = {
            'type': type,
            'text': text
        };
        var rendered = dvas.utils.renderMustacheHtml('#responseTemplate', view);
        $('#responseHtml').html(rendered);
    },

    getProgressHtml: function() {
        return dvas.utils.renderMustacheHtml('#progressTemplate', {});
    },
};

// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:
