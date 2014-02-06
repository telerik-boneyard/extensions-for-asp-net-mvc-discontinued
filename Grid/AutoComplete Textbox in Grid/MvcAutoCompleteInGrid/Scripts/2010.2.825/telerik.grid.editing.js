(function ($) {

    var $t = $.telerik;

    $.validator.addMethod("regex", function (value, element, params) {
        if (this.optional(element))
            return true;

        var match = new RegExp(params).exec(value);
        return match && match.index == 0 && match[0].length == value.length;
    });

    $.validator.addMethod('number', function (value, element) {
        var groupSize = $t.cultureInfo.numericgroupsize;
        var builder = new $t.stringBuilder();

        builder.cat('^-?(?:\\d+|\\d{1,')
               .cat(groupSize)
               .cat('}(?:')
               .cat($t.cultureInfo.numericgroupseparator)
               .cat('\\d{')
               .cat(groupSize)
               .cat('})+)(?:\\')
               .cat($t.cultureInfo.numericdecimalseparator)
               .cat('\\d+)?$');

        return this.optional(element) || new RegExp(builder.string()).test(value);
    });

    function __MVC_ApplyValidator_Range(object, min, max) {
        object["range"] = [min, max];
    }

    function __MVC_ApplyValidator_RegularExpression(object, pattern) {
        object["regex"] = pattern;
    }

    function __MVC_ApplyValidator_Required(object) {
        object["required"] = true;
    }

    function __MVC_ApplyValidator_StringLength(object, maxLength) {
        object["maxlength"] = maxLength;
    }

    function __MVC_ApplyValidator_Unknown(object, validationType, validationParameters) {
        object[validationType] = validationParameters;
    }

    function __MVC_CreateFieldToValidationMessageMapping(validationFields) {
        var mapping = {};

        for (var i = 0; i < validationFields.length; i++) {
            var thisField = validationFields[i];
            mapping[thisField.FieldName] = "#" + thisField.ValidationMessageId;
        }

        return mapping;
    }

    function __MVC_CreateErrorMessagesObject(validationFields) {
        var messagesObj = {};

        for (var i = 0; i < validationFields.length; i++) {
            var thisField = validationFields[i];
            var thisFieldMessages = {};
            messagesObj[thisField.FieldName] = thisFieldMessages;
            var validationRules = thisField.ValidationRules;

            for (var j = 0; j < validationRules.length; j++) {
                var thisRule = validationRules[j];
                if (thisRule.ErrorMessage) {
                    var jQueryValidationType = thisRule.ValidationType;
                    switch (thisRule.ValidationType) {
                        case "regularExpression":
                            jQueryValidationType = "regex";
                            break;

                        case "stringLength":
                            jQueryValidationType = "maxlength";
                            break;
                    }

                    thisFieldMessages[jQueryValidationType] = thisRule.ErrorMessage;
                }
            }
        }

        return messagesObj;
    }

    function __MVC_CreateRulesForField(validationField) {
        var validationRules = validationField.ValidationRules;

        // hook each rule into jquery
        var rulesObj = {};
        for (var i = 0; i < validationRules.length; i++) {
            var thisRule = validationRules[i];
            switch (thisRule.ValidationType) {
                case "range":
                    __MVC_ApplyValidator_Range(rulesObj,
                        thisRule.ValidationParameters["minimum"], thisRule.ValidationParameters["maximum"]);
                    break;

                case "regularExpression":
                    __MVC_ApplyValidator_RegularExpression(rulesObj,
                        thisRule.ValidationParameters["pattern"]);
                    break;

                case "required":
                    __MVC_ApplyValidator_Required(rulesObj);
                    break;

                case "stringLength":
                    __MVC_ApplyValidator_StringLength(rulesObj,
                        thisRule.ValidationParameters["maximumLength"]);
                    break;

                default:
                    __MVC_ApplyValidator_Unknown(rulesObj,
                        thisRule.ValidationType, thisRule.ValidationParameters);
                    break;
            }
        }

        return rulesObj;
    }

    function __MVC_CreateValidationOptions(validationFields) {
        var rulesObj = {};
        for (var i = 0; i < validationFields.length; i++) {
            var validationField = validationFields[i];
            var fieldName = validationField.FieldName;
            rulesObj[fieldName] = __MVC_CreateRulesForField(validationField);
        }

        return rulesObj;
    }

    function __MVC_EnableClientValidation(validationContext) {
        var theForm = $("#" + validationContext.FormId);

        var fields = validationContext.Fields;
        var rulesObj = __MVC_CreateValidationOptions(fields);
        var fieldToMessageMappings = __MVC_CreateFieldToValidationMessageMapping(fields);
        var errorMessagesObj = __MVC_CreateErrorMessagesObject(fields);

        var options = {
            errorClass: "input-validation-error",
            errorElement: "span",
            errorPlacement: function (error, element) {
                var messageSpan = fieldToMessageMappings[element.attr("name")];
                $(messageSpan).empty()
                                .removeClass("field-validation-valid")
                                .addClass("field-validation-error")

                error.removeClass("input-validation-error")
                     .attr("_for_validation_message", messageSpan)
                     .appendTo(messageSpan);
            },
            messages: errorMessagesObj,
            rules: rulesObj,
            success: function (label) {
                var messageSpan = $(label.attr("_for_validation_message"));
                $(messageSpan).empty()
                              .addClass("field-validation-valid")
                              .removeClass("field-validation-error");
            }
        };
        theForm.validate(options);
    }

    function getCommand(columns, name) {
        for (var i = 0, len = columns.length; i < len; i++) {
            if (columns[i].commands) {
                var commands = columns[i].commands;
                for (var j = 0, length = commands.length; j < length; j++) {
                    if (commands[j].name == name) return commands[j];
                }
            }
        }
        return {};
    }

    $t.editing = {};

    $t.editing.initialize = function (grid) {
        $.extend(grid, this.implementation);
        var $element = $(grid.element);

        if (grid.isAjax()) {
            $element.delegate('.t-grid-edit', 'click', $t.stopAll(function (e) {
                grid.editRow($(this).closest('tr'));
            }))
            .delegate('.t-grid-cancel', 'click', $t.stopAll(function (e) {
                grid.cancel();
            }))
            .delegate('.t-grid-delete', 'click', $t.stopAll(function (e) {
                grid.deleteRow($(this).closest('tr'));
            }))
            .delegate('.t-grid-update', 'click', $t.stopAll(function (e) {
                grid.save(this, $.proxy(function () {
                    grid.updateRow($(this).closest('form').closest('tr'));
                }, this));
            }))
            .delegate('.t-grid-add', 'click', $t.stopAll(function (e) {
                grid.addRow();
            }))
            .delegate('.t-grid-insert', 'click', $t.stopAll(function (e) {
                grid.save(this, $.proxy(function () {
                    grid.insertRow($(this).closest('form').closest('tr'));
                }, this));
            }))
        } else {
            $element.delegate('.t-grid-delete', 'click', $t.stop(function (e) {
                if (grid.editing.confirmDelete !== false && !confirm(grid.localization.deleteConfirmation))
                    e.preventDefault();
            }));

            grid.validation();
        }

        $element.delegate(':input:not(.t-button)', 'keydown', $t.stop(function (e) {
            var keyMap = { 13: '.t-grid-update, .t-grid-insert', 27: '.t-grid-cancel' };
            $(this).closest('tr').find(keyMap[e.keyCode]).click();
        }));
    }

    function popup(options) {
        var result = $('#' + options.element.id + 'PopUp');
        if (!result.length)
            result = $('<div />', { id: options.element.id + 'PopUp' })
                .appendTo(options.element)
                .css({ top: 0, left: '50%', marginLeft: -90 })
                .tWindow(options.settings)
                .delegate('.t-grid-cancel', 'click', $t.stopAll(function () {
                    result.data('tWindow').close()
                }));
        $.each(['insert', 'update'], function (index, value) {
            if (options[value])
                result.undelegate('.t-grid-' + value, 'click')
                      .delegate('.t-grid-' + value, 'click', $t.stopAll(function (e) {
                          options[value](e.target, result);
                      }));
        });

        result.find('> .t-content')
              .empty()
              .append(options.content);

        var wnd = result.data('tWindow');
        wnd.title(options.title);
        wnd.open();

        return result;
    }

    $t.editing.implementation = {
        insertRow: function ($tr) {
            var values = this.extractValues($tr);

            if ($t.trigger(this.element, 'save', { mode: 'insert', values: values, form: $tr.find('form')[0] }))
                return;

            this.sendValues(values, 'insertUrl');
        },

        updateRow: function ($tr) {
            var dataItem = this.dataItem($tr.data('tr') || $tr);
            var values = this.extractValues($tr, true);
            if ($t.trigger(this.element, 'save', { mode: 'edit', dataItem: dataItem, values: values, form: $tr.find('form')[0] }))
                return;

            this.sendValues(values, 'updateUrl');
        },

        deleteRow: function ($tr) {
            if ($t.trigger(this.element, 'delete', { dataItem: this.dataItem($tr) }))
                return;

            if (this.editing.confirmDelete === false || confirm(this.localization.deleteConfirmation))
                this.sendValues(this.extractValues($tr, true), 'deleteUrl');
        },

        editRow: function ($tr) {
            this.cancel();
            var html = new $t.stringBuilder();

            var edit = getCommand(this.columns, 'edit');

            this.form(html,
                      [{ name: 'update', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr },
                       { name: 'cancel', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr}],
                      $tr.find('.t-hierarchy-cell').find('.t-icon').hasClass('t-plus'));

            var dataItem = this.dataItem($tr);
            var $td = $(html.string());
            $td.children().hide();

            var cells = $td.find('tr:first td:not(.t-group-cell, .t-hierarchy-cell)');

            var mode = this.editing.mode;

            if (mode != 'PopUp') {
                $tr.html($td);
            } else {
                popup({
                    title: this.localization.edit,
                    element: this.element,
                    settings: this.editing.popup,
                    content: $td,
                    update: $.proxy(function (target, $popup) {
                        this.save(target, $.proxy(function () {
                            $popup.data('tr', $tr);
                            this.updateRow($popup);
                            $popup.data('tWindow')
                                  .close();
                        }, this));
                    }, this)
                });
            }

            $.each(this.columns, function (i) {
                if (this.edit)
                    $td.find(':input[name$="' + this.member + '"]')
                       .val(this.edit(dataItem) + '')
                       .parent()
                       .filter('.t-numerictextbox')
                       .each($.proxy(function (index, element) {
                           $(element).data('tTextBox').value(this.edit(dataItem));
                       }, this))
                       .end()
                       .find(':checkbox[name$="' + this.member + '"]')
                       .attr('checked', this.edit(dataItem) == true);

                if (mode == 'InLine' && this.readonly)
                    cells.eq(i).html(this.display(dataItem));
            });

            $td.children().show();
            $t.trigger(this.element, 'edit', {
                mode: 'edit',
                form: $td.find('form')[0] || $td[0],
                dataItem: dataItem
            });

            this.validation();
        },

        addRow: function () {
            this.cancel();
            var html = new $t.stringBuilder();
            var mode = this.editing.mode;
            var edit = getCommand(this.columns, 'edit');
            var $td;

            if (mode != 'PopUp') {
                html.cat('<tr class="t-grid-new-row">');
                this.form(html, [{ name: 'insert', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr },
                                 { name: 'cancel', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr}]);
                html.cat('</tr>');
                $td = $(html.string()).prependTo(this.$tbody);
            } else {
                this.form(html, [{ name: 'insert', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr },
                                 { name: 'cancel', attr: edit.attr, buttonType: edit.buttonType, imageAttr: edit.imageAttr}]);

                $td = $(html.string());

                popup({
                    title: this.localization.insert,
                    element: this.element,
                    settings: this.editing.popup,
                    content: $td,
                    insert: $.proxy(function (target, $popup) {
                        this.save(target, $.proxy(function () {
                            this.insertRow($popup);
                            $popup.data('tWindow').close()
                        }, this));
                    }, this)
                });
            }

            $t.trigger(this.element, 'edit', { mode: 'insert', form: $td.find('form')[0] || $td[0] })

            this.validation();
        },

        extractValues: function ($tr, extractKeys) {
            var values = {};
            $.each(this.columns, function () {
                var member = this.member;
                if (this.edit)
                    $tr.find(':input[name$="' + member + '"]')
                       .each(function () {
                           values[member] = $(this).val();
                       })
                       .end()
                       .find(':checkbox[name$="' + member + '"]')
                       .each(function () {
                           values[member] = $(this).attr('checked');
                       });
            });
            if (extractKeys) {
                var dataItem = this.dataItem($tr.data('tr') || $tr);

                for (var dataKey in this.dataKeys)
                    values[this.ws ? dataKey : this.dataKeys[dataKey]] = this.valueFor({ member: dataKey })(dataItem);
            }
            return values;
        },

        cancelRow: function ($tr) {
            if (!$tr.length)
                return;

            if ($tr.is('.t-grid-new-row')) {
                $tr.remove();
                return;
            }

            var dataItem = this.dataItem($tr);
            var html = new $t.stringBuilder();

            var expanding = $tr.find('.t-hierarchy-cell').find('.t-icon').hasClass('t-plus');

            html.rep('<td class="t-groupcell" />', this.groups.length)
                .catIf('<td class="t-hierarchy-cell"><a href="#" class="t-icon ' + (expanding ? 't-plus' : 't-minus') + '"></a></td>', this.detail);

            $.each(this.columns, $.proxy(function (i, c) {
                html.cat('<td')
                  .cat(c.attr)
                  .catIf(' class="t-last"', i == this.columns.length - 1)
                  .cat('>');

                if (c.display)
                    html.cat(c.display(dataItem));

                this.appendCommandHtml(c.commands, html);

                html.cat('</td>');

            }, this));

            $tr.html(html.string());

            $t.trigger(this.element, 'rowDataBound', { row: $tr[0], dataItem: dataItem });
        },

        form: function (html, commands, expanding) {
            var colgroup = this.$tbody.siblings('colgroup');

            var mode = this.editing.mode;

            if (mode != 'PopUp')
                html.cat('<td class="t-edit-container" colspan="')
                    .cat(this.columns.length + this.groups.length + (this.detail ? 1 : 0))
                    .cat('">');

            html.cat('<form class="t-edit-form" action="#" method="post" id="')
                .cat(this.formId())
                .cat('">');

            if (mode == 'InLine') {
                html.cat('<table cellspacing="0"><colgroup>');

                this.$tbody.siblings('colgroup').children()
                    .each(function () {
                        var width = $(this).css('width');

                        if (width != '0px')
                            html.cat('<col style="width:').cat(width).cat('" />');
                        else
                            html.cat('<col />');
                    });

                var hierarchyCellHtml = new $t.stringBuilder();
                hierarchyCellHtml.cat('<td class="t-hierarchy-cell">')
                                 .catIf('<a href="#" class="t-icon ' + (expanding ? 't-plus' : 't-minus') + '"></a>', expanding != undefined)
                                 .cat('</td>');

                html.cat('</colgroup><tbody><tr>')
                    .rep('<td class="t-groupcell" />', this.groups.length)
                    .catIf(hierarchyCellHtml.string(), this.detail);

                $.each(this.columns, $.proxy(function (i, c) {
                    html.cat('<td')
                        .cat(c.attr)
                        .catIf(' class="t-last"', i == this.columns.length - 1)
                        .cat('>')
                        .catIf(c.editor, c.editor)
                        .catIf('&nbsp;', !c.editor && !c.commands);

                    if (c.commands)
                        this.appendCommandHtml(commands, html);

                    html.cat('</td>');
                }, this));

                html.cat('</tr></tbody></table>');
            } else {
                html.cat('<div class="t-edit-form-container">')
                    .cat(this.editing.editor)
                    .cat('<div>');

                $.each(this.columns, $.proxy(function (i, c) {
                    if (c.commands)
                        this.appendCommandHtml(commands, html);
                }, this));

                html.cat('</div></div>');
            }

            html.cat('</form>')
            html.catIf('</td>', mode != 'PopUp');
        },

        save: function (element, callback) {
            $(element).closest('form').validate().form() && callback();
        },

        cancel: function () {
            this.cancelRow($('#' + this.formId()).closest('tr'));
        },

        sendValues: function (values, url) {
            if (this.ws)
                for (var key in values) {
                    var column = this.columnFromMember(key);
                    if (column && column.type == 'Date') {
                        var date = $t.datetime.parse(values[key], $t.cultureInfo.shortDate).toDate();
                        values[key] = '\\/Date(' + date.getTime() + ')\\/';
                    }
                }

            $.ajax(this.ajaxOptions({
                data: this.ws ? { value: values} : values,
                url: this.url(url)
            }));
        },

        formId: function () {
            return $(this.element).attr('id') + 'form';
        },

        validation: function () {
            if (window.mvcClientValidationMetadata) {

                var formId = this.formId();
                var metadata = $.grep(window.mvcClientValidationMetadata, function (item) {
                    return item.FormId == formId;
                })[0];

                if (metadata) {
                    // filter required fields for boolean columns
                    metadata.Fields = $.grep(metadata.Fields, $.proxy(function (rule) {
                        var column = this.columnFromMember(rule.FieldName);

                        return !column || column.type != 'Boolean';
                    }, this));

                    __MVC_EnableClientValidation(metadata);
                }
            }
        }
    }
})(jQuery);