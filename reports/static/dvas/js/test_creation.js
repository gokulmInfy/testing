var ctas = {
    headerAutocompleteValues: [
        { value: 'Accept', data: 'Accept' },
        { value: 'Content-Type', data: 'Content-Type' },
        { value: 'Authorization', data: 'Authorization' },
    ],

    TestCreationTracker: function() {
        this.headerCount = 0;
        this.assertionCount = 0;

        this.addTestStep = function(name, value) {
            var template = $('#headerTemplate').html();
            Mustache.parse(template);
            var view = {
                'name': name,
                'value': value,
                'count': this.headerCount
            };
            var rendered = Mustache.render(template, view);
            var headerHtml = $('#headerHtml');
            headerHtml.append(rendered);
            $('#headerName' + this.headerCount).autocomplete({
                lookup: ctas.headerAutocompleteValues,
            });
            ++this.headerCount;
        };

        this.addAssertion = function(name, operator, value) {
            var template = $('#assertionTemplate').html();
            Mustache.parse(template);
            var view = {
                'name': name,
                'operator': operator,
                'value': value,
                'count': this.assertionCount
            };
            var rendered = Mustache.render(template, view);
            var assertionHtml = $('#assertionHtml');
            assertionHtml.append(rendered);
            ++this.assertionCount;
        };

        this.getTestStepHeaders = function() {
            var headers = Array();
            for (var i = 0; i < this.headerCount; ++i) {
                var headerName = $('#headerName' + i);
                var headerValue = $('#headerValue' + i);
                if (headerName.length > 0) {
                    headers.push(
                        {
                            'name': headerName.val(),
                            'value': headerValue.val(),
                        }
                    )
                }
            }
            return headers;
        };

        this.getAssertions = function() {
            var assertions = Array();
            for (var i = 0; i < this.assertionCount; ++i) {
                var assertionName = $('#assertionName' + i);
                var assertionOperation = $('#assertionOperation' + i);
                var assertionValue = $('#assertionValue' + i);
                if (assertionName.length > 0) {
                    assertions.push(
                        {
                            'name': assertionName.val(),
                            'operator': assertionOperation.val(),
                            'value': assertionValue.val(),
                        }
                    )
                }
            }
            return assertions;
        };
    },
};

$(document).ready(function() {
    Mustache.tags = ['[[', ']]'];
    var testCreationTracker = new ctas.TestCreationTracker();
    $('#btnAddHeader').click(function() {
        testCreationTracker.addTestStep("", "");
    });
    $('#btnAddAssertion').click(function() {
        testCreationTracker.addAssertion("", "", "");
    });
});

// vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:
