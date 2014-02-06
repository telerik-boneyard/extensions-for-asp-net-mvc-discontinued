(function ($) {
    var $t = $.telerik;
    var escapeQuoteRegExp = /'/ig;
    var fx = $t.fx.slide.defaults();

    function getFormat(column) {
        if (!column.format)
            return $t.cultureInfo.shortDate;

        return /\{0(:([^\}]+))?\}/.exec(column.format)[2];
    }

    function value(column, value) {
        if (column.type == 'Date')
            return $t.formatString(column.format || '{0:G}', new Date(parseInt(value.replace(/\/Date\((.*?)\)\//, '$1'))));

        return value;
    }

    $t.filtering = {};

    $t.filtering.initialize = function (grid) {
        $.extend(grid, $t.filtering.implementation);

        grid.filterBy = grid.filterExpr();

        $('> .t-grid-content', grid.element).bind('scroll', function() {
            grid.hideFilter();
        });

        $(document).click(function (e) {
            if (e.which != 3) grid.hideFilter();
        });

        grid.$header.find('.t-grid-filter').click($.proxy(grid.showFilter, grid))
            .hover(function() {
                $(this).toggleClass('t-state-hover');
            });
    }

    /* Here `this` is the Grid instance*/

    $t.filtering.implementation = {
        createFilterCommands: function (html, column) {
            var filters = {};

            $.each(this.localization, function (key, value) {
                var prefix = 'filter' + column.type;
                var index = key.indexOf(prefix);
                if (index > -1)
                    filters[key.substring(index + prefix.length).toLowerCase()] = value;
            });

            html.cat('<select class="t-filter-operator">');
            $.each(filters, function (key, value) {
                html.cat('<option value="')
					.cat(key)
					.cat('">')
					.cat(value)
					.cat('</option>');
            });

            html.cat('</select>');
        },

        createTypeSpecificInput: function (html, column, fieldId, value) {
            if (column.type == 'Date') {
                html.cat('<div class="t-widget t-datepicker">')
	                .cat('<input class="t-input" id="').cat(fieldId).cat('" type="text" value="" />')
	                .cat('<label class="t-icon t-icon-calendar" for="')
	                .cat(fieldId)
	                .cat('" title="').cat(this.localization.filterOpenPopupHint).cat('" /></div>');
            } else if (column.type == 'Boolean') {
                html.cat('<div><input type="radio" style="width:auto;display:inline" id="').cat(fieldId + value)
				    .cat('" name="').cat(fieldId)
				    .cat('" value="').cat(value).cat('" />')
				    .cat('<label style="display:inline" for="').cat(fieldId + value).cat('">')
                    .cat(this.localization[value ? 'filterBoolIsTrue' : 'filterBoolIsFalse'])
				    .cat('</label></div>');
            } else if (column.type == 'Enum') {
                html.cat('<div><select><option>')
                    .cat(this.localization.filterSelectValue)
                    .cat('</option>');
                $.each(column.values, function (key, value) {
                    html.cat('<option value="')
                        .cat(value)
                        .cat('">')
                        .cat(key)
                        .cat('</option>');
                });
                html.cat('</select></div>');
            } else if (column.type == 'Number') {
                html.cat('<div class="t-widget t-numerictextbox">')
	                .cat('<input class="t-input" name="')
	                .cat(fieldId)
	                .cat('" id="')
	                .cat(fieldId + '-input')
	                .cat('" type="text" value=""/>')
	                .cat('</div>');
            } else {
                html.cat('<input type="text" />');
            }
        },

        createFilterMenu: function (column) {
            var filterMenuHtml = new $t.stringBuilder();

            filterMenuHtml.cat('<div class="t-animation-container"><div class="t-filter-options t-group" style="display:none">')
					.cat('<button class="t-button t-state-default t-clear-button"><span class="t-icon t-clear-filter"></span>')
					.cat(this.localization.filterClear)
					.cat('</button><div class="t-filter-help-text">')
					.cat(this.localization.filterShowRows)
					.cat('</div>');

            var fieldIdPrefix = $(this.element).attr('id') + column.member;

            if (column.type == 'Boolean') {
                this.createTypeSpecificInput(filterMenuHtml, column, fieldIdPrefix, true);
                this.createTypeSpecificInput(filterMenuHtml, column, fieldIdPrefix, false);
            } else {
                this.createFilterCommands(filterMenuHtml, column);
                this.createTypeSpecificInput(filterMenuHtml, column, fieldIdPrefix + 'first');
                filterMenuHtml.cat('<div class="t-filter-help-text">')
                              .cat(this.localization.filterAnd)
                              .cat('</div>');
                this.createFilterCommands(filterMenuHtml, column);
                this.createTypeSpecificInput(filterMenuHtml, column, fieldIdPrefix + 'second');
            }

            filterMenuHtml.cat('<button class="t-button t-state-default t-filter-button"><span class="t-icon t-filter"></span>')
                          .cat(this.localization.filter)
				          .cat('</button></div></div>');

            var $filterMenu = $(filterMenuHtml.string());

            $.each(column.filters || [], function (i) {
                $filterMenu.find('.t-filter-operator:eq(' + i + ')')
                           .val(this.operator)
                           .end()
                           .find(':text:eq(' + i + '),select:not(.t-filter-operator):eq(' + i + ')')
                           .val(value(column, this.value));

                if (column.type == 'Boolean')
                    $filterMenu.find(':radio[id$=' + this.value + ']')
                               .attr('checked', true);
            });

            return $filterMenu
                        .find('.t-datepicker')
                        .each(function () {
                            $(this).tDatePicker({ format: getFormat(column) });
                        })
                        .end()
                        .find('.t-numerictextbox')
                        .each(function() {
                            $(this).tTextBox({ type: 'numeric', minValue: null, maxValue: null, numFormat: '', groupSeparator: '' });
                        })
                        .end()
                        .appendTo(this.element);
        },

        showFilter: function(e) {
            e.stopPropagation();

            var $element = $(e.target).closest('.t-grid-filter');
            
            this.hideFilter(function() {
                return this.parentNode != $element[0];
            });

            var $filterMenu = $element.data('filter');

            if (!$filterMenu) {
                // filtering menu should be created
                var column = this.columns[this.$columns().index($element.parent())];

                $filterMenu = this.createFilterMenu(column)
                        .data('column', column)
                        .click(function (e) {
                            e.stopPropagation();

                            if ($(e.target).parents('.t-datepicker').length == 0) {
                                $('.t-datepicker', this)
                                    .each(function () {
                                        $(this).data('tDatePicker').hidePopup();
                                    });
                            }
                        })
                        .find('.t-filter-button').click($.proxy(this.filterClick, this)).end()
                        .find('.t-clear-button').click($.proxy(this.clearClick, this)).end()
                        .find('input[type=text]').keyup($.proxy(function(e) {
                            if (e.keyCode == 13) this.filterClick(e);
                        }, this)).end();

                $element.data('filter', $filterMenu);
            }

            // position filtering menu
            var top = 0;
            
            $(this.element).find('> .t-grouping-header, > .t-grid-toolbar').add(this.$header).each(function() {
                top += this.offsetHeight;
            });
            
            var position = { top: top };
            
            var width = -this.$headerWrap.scrollLeft() - 1;

            $element.parent().add($element.parent().prevAll('th')).each(function() {
                if ($(this).css('display') != 'none')
                    width += this.offsetWidth;
            });

            var left = width - $element.outerWidth();

            // constrain filtering menu within grid
            var outerWidth = $filterMenu.outerWidth() || $filterMenu.find('.t-group').outerWidth();

            if (left + outerWidth > this.$header.outerWidth())
                left = width - outerWidth + 1;

            if ($(this.element).hasClass('t-grid-rtl'))
                position['right'] = left + ($.browser.mozilla || $.browser.safari ? 18 : 0);
            else
                position['left'] = left;

            $filterMenu.css(position);

            $t.fx[$filterMenu.find('.t-filter-options').is(':visible') ? 'rewind' : 'play'](fx, $filterMenu.find('.t-filter-options'), { direction: 'bottom' });
        },

        hideFilter: function (filterCallback) {
            filterCallback = filterCallback || function () { return true; };

            $('.t-grid .t-animation-container')
                .find('.t-datepicker')
                .each(function() { $(this).data('tDatePicker').hidePopup(); })
                .end()
                .find('.t-filter-options')
                .filter(filterCallback)
                .each(function () {
                    $t.fx.rewind(fx, $(this), { direction: 'bottom' });
                });
        },

        clearClick: function(e) {
            e.preventDefault();
            var $element = $(e.target);
            var column = $element.closest('.t-animation-container').data('column');
            column.filters = null;

            $element.parent()
                    .find('input, select')
                    .removeAttr('checked')
                    .removeClass('t-state-error')
                    .not(':radio')
                    .val('');

            this.filter(this.filterExpr());
        },

        filterClick: function(e) {
            e.preventDefault();
            var $element = $(e.target);
            var column = $element.closest('.t-animation-container').data('column');
            column.filters = [];
            var hasErrors = false;

            $element.parent().find('input[type=text]:visible,select:not(.t-filter-operator)').each($.proxy(function (index, input) {
                var $input = $(input);
                var value = $.trim($input.val());

                if (!value) {
                    $input.removeClass('t-state-error');
                    return true;
                }

                var valid = this.isValidFilterValue(column, value);

                $input.toggleClass('t-state-error', !valid);

                if (!valid) {
                    hasErrors = true;
                    return true;
                }

                var operator = $input.prev('select').val() || $input.parent().prev('select').val();
                if (value != this.localization.filterSelectValue)
                    column.filters.push({ operator: operator, value: value });
            }, this));

            $element.parent().find('input:checked').each($.proxy(function (index, input) {
                var $input = $(input);
                var value = $(input).attr('value');
                column.filters.push({ operator: 'eq', value: value });
            }, this));

            if (!hasErrors) {
                if (column.filters.length > 0)
                    this.filter(this.filterExpr());

                this.hideFilter();
            }
        },

        isValidFilterValue: function (column, value) {
            if (column.type == 'Number')
                return !isNaN(value);

            return true;
        },

        encodeFilterValue: function (column, value) {
            switch (column.type) {
                case 'String':
                    return "'" + value.replace(escapeQuoteRegExp, "''") + "'";
                case 'Date':
                    var date;
                    if (value.indexOf('Date(') > -1)
                        date = new Date(parseInt(value.replace(/^\/Date\((.*?)\)\/$/, '$1')));
                    else
                        date = $t.datetime.parse(value, getFormat(column)).toDate();

                    return "datetime'" + $t.formatString('{0:yyyy-MM-ddTHH-mm-ss}', date) + "'";
            }

            return value;
        },

        filterExpr: function () {
            var result = [];
            $.each(this.columns, $.proxy(function (_, column) {
                if (column.filters)
                    $.each(column.filters, $.proxy(function (_, filter) {
                        var expr = new $t.stringBuilder();
                        var value = this.encodeFilterValue(column, filter.value);
                        if (/startswith|substringof|endswith/.test(filter.operator)) {
                            expr.cat(filter.operator)
                                .cat('(')
                                .cat(column.member)
                                .cat(',')
                                .cat(value)
                                .cat(')');
                        } else {
                            expr.cat(column.member)
                            .cat('~')
                            .cat(filter.operator)
                            .cat('~')
                            .cat(value);
                        }
                        result.push(expr.string());
                    }, this));
            }, this));

            return result.join('~and~');
        },

        filter: function (filterBy) {
            this.currentPage = 1;
            this.filterBy = filterBy;

            if (this.isAjax()) {
                this.$columns().each($.proxy(function(index, element) {
                    $('.t-grid-filter', element).toggleClass('t-active-filter', !!this.columns[index].filters);
                }, this));

                this.ajaxRequest();
            } else {
                this.serverRequest();
            }
        }
    };
})(jQuery);
