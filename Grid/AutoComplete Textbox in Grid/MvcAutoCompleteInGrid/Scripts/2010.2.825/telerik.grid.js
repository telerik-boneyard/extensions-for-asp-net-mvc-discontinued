(function ($) {
    var $t = $.telerik;
    var rdate = /"\\\/Date\((.*?)\)\\\/"/g;

    function template(value) {
        return new Function('data', ("var p=[];" +
            "with(data){p.push('" + unescape(value).replace(/[\r\t\n]/g, " ")
                .replace(/'(?=[^#]*#>)/g, "\t")
                .split("'").join("\\'")
                .split("\t").join("'")
                .replace(/<#=(.+?)#>/g, "',$1,'")
                .split("<#").join("');")
                .split("#>").join("p.push('")
                + "');}return p.join('');"));
    }

    $t.grid = function (element, options) {
        this.element = element;
        this.groups = [];
        this.editing = {};
        this.filterBy = '';
        this.groupBy = '';
        this.orderBy = '';

        $.extend(this, options);

        this.sorted = $.grep(this.columns, function (column) { return column.order; });

        this.$tbody = $('> .t-grid-content > table tbody', element);
        this.scrollable = this.$tbody.length > 0;

        if (!this.scrollable) {
            this.$tbody = $('> table > tbody', element);
            this.$header = $('> table > thead tr', element);
            this.$footer = $('> table > tfoot .t-pager-wrapper', element);
        } else {
            this.$header = $('> .t-grid-header tr', element);
            this.$footer = $('> .t-grid-footer', element);
        }
        var headerWrap = this.$headerWrap = $('> .t-grid-header > .t-grid-header-wrap', element);

        $('> .t-grid-content', element).bind('scroll', function () {
            headerWrap.scrollLeft(this.scrollLeft);
        });


        this.$tbody.delegate('.t-hierarchy-cell .t-plus, .t-hierarchy-cell .t-minus', 'click', $t.stopAll(function (e) {
            var $icon = $(e.target);
            var expanding = $icon.hasClass('t-plus');

            $icon.toggleClass('t-minus', expanding)
                .toggleClass('t-plus', !expanding);
            var $tr = $icon.closest('tr.t-master-row');
            if (this.detail && !$tr.next().hasClass('t-detail-row'))
                $(new $t.stringBuilder()
                        .cat('<tr class="t-detail-row">')
                        .rep('<td class="t-group-cell"></td>', $tr.find('.t-group-cell').length)
                        .cat('<td class="t-hierarchy-cell"></td>')
                        .cat('<td class="t-detail-cell" colspan="')
                        .cat(this.columns.length)
                        .cat('">')
                        .cat(this.displayDetails(this.dataItem($tr)))
                        .cat('</td></tr>').string()).insertAfter($tr);
            
            $t.trigger(this.element, expanding ? 'detailViewExpand' : 'detailViewCollapse', {masterRow:$tr[0], detailRow:$tr.next('.t-detail-row')[0]});
            $tr.next().toggle(expanding);
        }, this));

        this.$pager = $('> .t-pager-wrapper .t-pager', element).add(this.$footer.find('.t-pager'));

        this.$pager.delegate('.t-state-disabled', 'click', $t.preventDefault)
                   .delegate('.t-link:not(.t-state-disabled)', 'hover', function () {
                       $(this).toggleClass('t-state-hover');
                   })
                   .delegate('input[type=text]', 'keydown', $.proxy(this.pagerKeyDown, this));

        this.$footer.add($('> .t-pager-wrapper', element)).delegate('.t-refresh', 'click', $.proxy(this.refreshClick, this));

        $(element).delegate('.t-button', 'hover', $t.stop(function () {
            $(this).toggleClass('t-button-hover');
        }));

        if (this.sort)
            this.$header.delegate('.t-link', 'hover', function () {
                $(this).toggleClass('t-state-hover');
            });

        var nonGroupingRowsSelector = 'tr:not(.t-grouping-row,.t-detail-row)';
        
        if (this.selectable) {
            var tbody = this.$tbody[0];
            var grid = this;
            this.$tbody.delegate(nonGroupingRowsSelector, 'click', function(e) {
                            if (this.parentNode == tbody)
                                grid.rowClick(e);
                        })
                       .delegate(nonGroupingRowsSelector, 'hover', function() {
                            if (this.parentNode == tbody)
                                $(this).toggleClass('t-state-hover');
                       });
        }
        if (this.isAjax()) {
            this.$pager.delegate('.t-link:not(.t-state-disabled)', 'click', $t.stop(this.pagerClick, this));
            if (this.sort)
                this.$header.delegate('.t-link', 'click', $t.stop(this.headerClick, this));
        }

        for (var i = 0; i < this.plugins.length; i++)
            $t[this.plugins[i]].initialize(this);

        $t.bind(this, {
            columnResize: this.onColumnResize,
            'delete': this.onDelete,
            detailViewExpand: this.onDetailViewExpand,
            detailViewCollapse: this.onDetailViewCollapse,
            dataBinding: this.onDataBinding,
            dataBound: this.onDataBound,
            edit: this.onEdit,
            error: this.onError,
            load: this.onLoad,
            rowSelect: this.onRowSelect,
            rowDataBound: this.onRowDataBound,
            save: this.onSave
        });

        this.createColumnMappings();
    }

    $t.grid.prototype = {
        rowClick: function (e) {
            var $target = $(e.target);
            if (!$target.is(':button,a,:input')) {
                e.stopPropagation();
                var $row = $target.closest('tr')
                                  .addClass('t-state-selected')
                                  .siblings()
                                  .removeClass('t-state-selected')
                                  .end();
                $t.trigger(this.element, 'rowSelect', { row: $row[0] });
            }
        },

        $rows: function () {
            return this.$tbody.find('> tr:not(.t-grouping-row,.t-detail-row)');
        },

        expandRow: function (tr) {
            $(tr).find('> td .t-plus, > td .t-expand').click();
        },

        collapseRow: function (tr) {
            $(tr).find('> td .t-minus, > td .t-collapse').click();
        },

        headerClick: function (e) {
            e.preventDefault();
            this.toggleOrder(this.$columns().index($(e.target).closest('th')));
            this.sort(this.sortExpr());
        },

        refreshClick: function (e, element) {
            if ($(element).is('.t-loading'))
                return;

            if (this.isAjax()) {
                e.preventDefault();
                this.ajaxRequest(true);
            }
        },

        sort: function (orderBy) {
            this.orderBy = orderBy;
            this.ajaxRequest();
        },

        columnFromMember: function (member) {
            var column = $.grep(this.columns, function (c) { return c.member == member })[0];

            if (!column)
                column = $.grep(this.columns, function (c) {
                    var suffix = "." + c.member;
                    return member.substr(member.length - suffix.length) == suffix
                })[0];

            return column;
        },

        toggleOrder: function (column) {
            column = typeof column == 'number' ? this.columns[column] : column;

            var order = 'asc';

            if (column.order == 'asc')
                order = 'desc';
            else if (column.order == 'desc')
                order = null;

            column.order = order;

            var sortedIndex = $.inArray(column, this.sorted);

            if (this.sortMode == 'single' && sortedIndex < 0) {
                $.each(this.sorted, function () {
                    this.order = null;
                });
                this.sorted = [];
            }
            if (sortedIndex < 0 && order)
                this.sorted.push(column);

            if (!order)
                this.sorted.splice(sortedIndex, 1);
        },

        sortExpr: function () {
            return $.map(this.sorted, function (s) { return s.member + '-' + s.order; }).join('~');
        },

        pagerKeyDown: function (e) {
            if (e.keyCode == 13) {
                var page = this.sanitizePage($(e.target).val());
                if (page != this.currentPage)
                    this.pageTo(page);
                else
                    $(element).val(page);
            }
        },

        isAjax: function () {
            return this.ajax || this.ws || this.onDataBinding;
        },

        url: function (which) {
            return (this.ajax || this.ws)[which];
        },

        pagerClick: function (e) {
            e.preventDefault();

            var $element = $(e.target).closest('.t-link');

            var page = this.currentPage;
            var pagerButton = $element.find('.t-icon');

            if (pagerButton.hasClass('t-arrow-next'))
                page++;
            else if (pagerButton.hasClass('t-arrow-last'))
                page = this.totalPages();
            else if (pagerButton.hasClass('t-arrow-prev'))
                page--;
            else if (pagerButton.hasClass('t-arrow-first'))
                page = 1;
            else {
                var linkText = $element.text();

                if (linkText == '...') {
                    var elementIndex = $element.parent().children().index($element);

                    if (elementIndex == 0)
                        page = parseInt($element.next().text()) - 1;
                    else
                        page = parseInt($element.prev().text()) + 1;
                } else {
                    page = parseInt(linkText);
                }
            }

            this.pageTo(page);
        },

        pageTo: function (page) {
            this.currentPage = page;
            if (this.isAjax())
                this.ajaxRequest();
            else
                this.serverRequest();
        },

        ajaxOptions: function (options) {
            var result = {
                type: 'POST',
                dataType: 'text', // using 'text' instead of 'json' because of DateTime serialization
                dataFilter: function (data, dataType) {
                    // convert "\/Date(...)\/" to "new Date(...)"
                    return data.replace(rdate, 'new Date($1)');
                },
                error: $.proxy(function (xhr, status) {
                    if ($t.ajaxError(this.element, 'error', xhr, status))
                        return;
                }, this),

                complete: $.proxy(this.hideBusy, this),

                success: $.proxy(function (data, status, xhr) {
                    try {
                        data = eval('(' + data + ')');
                    } catch (e) {
                        // in case the result is not JSON raise the 'error' event
                        if (!$t.ajaxError(this.element, 'error', xhr, 'parseeror'))
                            alert('Error! The requested URL did not return JSON.');
                        return;
                    }

                    data = data.d || data; // Support the `d` returned by MS Web Services 
                    this.total = data.total || data.Total || 0;
                    this.dataBind(data.data || data.Data);
                }, this)
            };
            $.extend(result, options);

            var state = this.ws ? result.data.state = {} : result.data;

            state[this.queryString.page] = this.currentPage;
            state[this.queryString.size] = this.pageSize;
            state[this.queryString.orderBy] = this.orderBy || '';
            state[this.queryString.groupBy] = this.groupBy;
            state[this.queryString.filter] = (this.filterBy || '').replace(/\"/g, '\\"');

            if (this.ws) {
                result.data = $t.toJson(result.data);
                result.contentType = 'application/json; charset=utf-8';
            }
            return result;
        },

        showBusy: function () {
            this.busyTimeout = setTimeout($.proxy(function () {
                this.$footer.find('.t-status .t-icon').addClass('t-loading');
            }, this), 100);
        },

        hideBusy: function () {
            clearTimeout(this.busyTimeout);
            this.$footer.find('.t-status .t-icon').removeClass('t-loading');
        },

        serverRequest: function () {
            location.href = $t.formatString(unescape(this.urlFormat),
                    this.currentPage, this.orderBy || '~', this.groupBy || '~', encodeURIComponent(this.filterBy) || '~');
        },

        ajaxRequest: function () {
            var e = {
                page: this.currentPage,
                sortedColumns: this.sorted,
                filteredColumns: $.grep(this.columns, function (column) {
                    return column.filters;
                })
            };

            if ($t.trigger(this.element, 'dataBinding', e))
                return;

            if (!this.ajax && !this.ws)
                return;

            this.showBusy();

            $.ajax(this.ajaxOptions({
                data: $.extend({}, e.data),
                url: this.url('selectUrl')
            }));
        },

        valueFor: function (column) {
            if (column.type == 'Date')
                return new Function('data', 'var value = data.' + column.member +
                    '; if (!value) return null; return value instanceof Date? value : new Date(parseInt(value.replace(/\\/Date\\((.*?)\\)\\//, "$1")));');

            return new Function('data', 'return data.' + column.member + ';');
        },

        displayFor: function (column) {
            if (!column.template) {
                if (column.format || column.type == 'Date')
                    return function (data) {
                        var value = column.value(data);
                        return value == null ? '' : $t.formatString(column.format || '{0:G}', value);
                    }

                return column.value;
            }

            return template(column.template);
        },

        createColumnMappings: function () {
            $.each(this.columns, $.proxy(function (_, column) {
                if (column.member) {
                    column.value = this.valueFor(column);
                    column.display = this.displayFor(column);
                    column.edit = column.type != 'Date' ? column.value : column.display;
                } else if (column.template) {
                    column.display = this.displayFor(column);
                    column.readonly = true;
                }
            }, this));

            if (this.detail)
                this.displayDetails = template(this.detail.template);
        },

        bindData: function (data, html, groups) {
            Array.prototype.push.apply(this.data, data);

            var dataLength = Math.min(this.pageSize, data.length);

            dataLength = this.pageSize ? dataLength : data.length;
            
            /* fix for ie8 hidden columns in ajax binding becoming ghosts */
            if ($.browser.msie)
                $(this.element).find('.t-grid-content colgroup:first col').css('display', '');

            for (var rowIndex = 0; rowIndex < dataLength; rowIndex++) {
                var className = $.trim((this.detail ? 't-master-row' : '') + (rowIndex % 2 == 1 ? ' t-alt' : ''));

                if (className)
                    html.cat('<tr class="')
                        .cat(className)
                        .cat('">')
                else
                    html.cat('<tr>');

                html.rep('<td class="t-group-cell"></td>', groups)
                    .catIf('<td class="t-hierarchy-cell"><a class="t-icon t-plus" href="#" /></td>', this.detail);

                for (var i = 0, len = this.columns.length; i < len; i++) {
                    var column = this.columns[i];

                    html.cat('<td')
                        .cat(column.attr)
                        .catIf(' class="t-last"', i == len - 1)
                        .cat('>');

                    var evaluate = column.display;
                    if (evaluate)
                        html.cat(evaluate(data[rowIndex]));

                    this.appendCommandHtml(column.commands, html);

                    html.cat('</td>');
                }

                html.cat('</tr>');
            }
        },

        appendCommandHtml: function (commands, html) {
            if (commands) {
                var localization = this.localization;

                var getSpriteHtml = function (command, builder) {
                    builder.cat('<span class="t-icon t-')
                           .cat(command.name)
                           .cat('" ')
                           .cat(command.imageAttr)
                           .cat('></span>');
                }

                $.each(commands, function () {
                    var builder = html.cat('<a href="#" class="t-grid-action t-button t-state-default t-grid-')
                                      .cat(this.name)
                                      .cat('" ')
                                      .cat(this.attr)
                                      .cat('>');

                    var buttonType = this.buttonType;

                    if (buttonType == 'Image') {
                        getSpriteHtml(this, builder);
                    }
                    else if (buttonType == 'ImageAndText') {
                        getSpriteHtml(this, builder);
                        builder.cat(localization[this.name]);
                    } else {
                        builder.cat(localization[this.name]);
                    }

                    builder.cat('</a>')
                });
            }
        },

        normalizeColumns: function () {
            // empty - overridden in telerik.grid.grouping.js
        },

        dataItem: function (tr) {
            return this.data[this.$tbody.find('> tr:not(.t-grouping-row,.t-detail-row)').index($(tr))];
        },

        bindTo: function (data) {
            var html = new $t.stringBuilder();

            if (data && data.length) {
                var colspan = this.groups.length + this.columns.length + (this.detail ? 1 : 0);
                this.normalizeColumns(colspan);

                if ('HasSubgroups' in data[0])
                    for (var i = 0, l = data.length; i < l; i++)
                        this.bindGroup(data[i], colspan, html, 0);
                else
                    this.bindData(data, html);
            }

            this.$tbody.html(html.string());

            if (this.onRowDataBound) {

                var rows = jQuery.grep(this.$tbody[0].rows, function (row) {
                    return !$(row).hasClass('t-grouping-row')
                });

                for (var i = 0, l = this.data.length; i < l; i++)
                    $t.trigger(this.element, 'rowDataBound', { row: rows[i], dataItem: this.data[i] });
            }
        },

        updatePager: function () {
            var totalPages = this.totalPages(this.total);
            var currentPage = this.currentPage;

            // nextPrevious
            // work-around for weird issue in IE, when using comma-based selector
            this.$pager.find('.t-arrow-next').parent().add(this.$pager.find('.t-arrow-last').parent())
	            .toggleClass('t-state-disabled', currentPage >= totalPages)
	            .removeClass('t-state-hover');

            this.$pager.find('.t-arrow-prev').parent().add(this.$pager.find('.t-arrow-first').parent())
	            .toggleClass('t-state-disabled', currentPage == 1)
	            .removeClass('t-state-hover');

            var localization = this.localization;
            // pageInput
            this.$pager.find('.t-page-i-of-n').each(function () {
                this.innerHTML = new $t.stringBuilder()
                                       .cat(localization.page)
                                       .cat('<input type="text" value="')
                                       .cat(currentPage)
                                       .cat('" /> ')
                                       .cat($t.formatString(localization.pageOf, totalPages))
                                       .string();
            });

            // numeric
            this.$pager.find('.t-numeric').each($.proxy(function (index, element) {
                this.numericPager(element, currentPage, totalPages);
            }, this));

            // status
            this.$pager.parent()
                       .find('.t-status-text')
                       .text($t.formatString(localization.displayingItems,
                            this.firstItemInPage(),
	                        this.lastItemInPage(),
	                        this.total));
        },

        numericPager: function (pagerElement, currentPage, totalPages) {
            var numericLinkSize = 10;
            var numericStart = 1;

            if (currentPage > numericLinkSize) {
                var reminder = (currentPage % numericLinkSize);

                numericStart = (reminder == 0) ? (currentPage - numericLinkSize) + 1 : (currentPage - reminder) + 1;
            }

            var numericEnd = (numericStart + numericLinkSize) - 1;

            numericEnd = Math.min(numericEnd, totalPages);

            var pagerHtml = new $t.stringBuilder();
            if (numericStart > 1)
                pagerHtml.cat('<a class="t-link">...</a>');

            for (var page = numericStart; page <= numericEnd; page++) {
                if (page == currentPage) {
                    pagerHtml.cat('<span class="t-state-active">')
                        .cat(page)
                        .cat('</span>');
                } else {
                    pagerHtml.cat('<a class="t-link">')
	                .cat(page)
	                .cat('</a>');
                }
            }

            if (numericEnd < totalPages)
                pagerHtml.cat('<a class="t-link">...</a>');

            pagerElement.innerHTML = pagerHtml.string();
        },

        $columns: function () {
            return this.$header.find('th:not(.t-hierarchy-cell,.t-group-cell)');
        },

        updateSorting: function () {
            this.sorted = [];
            $.each(this.orderBy.split('~'), $.proxy(function (_, expr) {
                var memberAndOrder = expr.split('-');
                var column = this.columnFromMember(memberAndOrder[0]);
                if (column) {
                    column.order = memberAndOrder[1];
                    this.sorted.push(column);
                }
            }, this));

            this.$columns().each($.proxy(function (i, header) {
                var direction = this.columns[i].order;
                var $link = $(header).children('.t-link');
                var $icon = $link.children('.t-icon');

                if (!direction) {
                    $icon.hide();
                } else {
                    if ($icon.length == 0)
                        $icon = $('<span class="t-icon"/>').appendTo($link);

                    $icon.toggleClass('t-arrow-up', direction == 'asc')
                        .toggleClass('t-arrow-down', direction == 'desc')
                        .show();
                }
            }, this));
        },

        sanitizePage: function (value) {
            var result = parseInt(value, 10);
            if (isNaN(result) || result < 1)
                return 1
            return Math.min(result, this.totalPages());
        },

        totalPages: function () {
            return Math.ceil(this.total / this.pageSize);
        },

        firstItemInPage: function () {
            return this.total > 0 ? (this.currentPage - 1) * this.pageSize + 1 : 0;
        },

        lastItemInPage: function () {
            return Math.min(this.currentPage * this.pageSize, this.total);
        },

        dataBind: function (data) {
            this.data = [];
            this.bindTo(data);
            this.updatePager();
            this.updateSorting();
            $t.trigger(this.element, 'dataBound');
        },

        rebind: function (args) {
            this.sorted = [];
            this.filterBy = '';
            this.currentPage = 1;

            $.each(this.columns, function () {
                this.order = null;
                this.filters = [];
            });

            $('.t-filter-options', this.element)
                .find('input[type="text"], select')
                .val('')
                .removeClass('t-state-error');

            for (var key in args) {
                var regExp = new RegExp($t.formatString('({0})=([^&]*)', key), 'g');
                if (regExp.test(this.ajax.selectUrl))
                    this.ajax.selectUrl = this.ajax.selectUrl.replace(regExp, '$1=' + args[key]);
                else {
                    var url = new $t.stringBuilder();
                    url.cat(this.ajax.selectUrl);
                    if (this.ajax.selectUrl.indexOf('?') < 0)
                        url.cat('?');
                    else
                        url.cat('&');
                    this.ajax.selectUrl = url.cat(key).cat('=').cat(args[key]).string();
                }
            }

            this.ajaxRequest();
        }
    }

    $.fn.tGrid = function (options) {
        return $t.create(this, {
            name: 'tGrid',
            init: function (element, options) {
                return new $t.grid(element, options);
            },
            options: options,
            success: function (grid) {
                if (grid.$tbody.find('tr.t-no-data').length)
                    grid.ajaxRequest();
            }
        });
    }

    // default options

    $.fn.tGrid.defaults = {
        columns: [],
        plugins: [],
        currentPage: 1,
        pageSize: 10,
        localization: {
            addNew: 'Add new record',
            'delete': 'Delete',
            cancel: 'Cancel',
            insert: 'Insert',
            update: 'Update',
            select: 'Select',
            pageOf: 'of {0}',
            displayingItems: 'Displaying items {0} - {1} of {2}',
            edit: 'Edit',
            page: 'Page ',
            filter: 'Filter',
            filterClear: 'Clear Filter',
            filterShowRows: 'Show rows with value that',
            filterAnd: 'And',
            filterStringEq: 'Is equal to',
            filterStringNe: 'Is not equal to',
            filterStringStartsWith: 'Starts with',
            filterStringSubstringOf: 'Contains',
            filterStringEndsWith: 'Ends with',
            filterNumberEq: 'Is equal to',
            filterNumberNe: 'Is not equal to',
            filterNumberLt: 'Is less than',
            filterNumberLe: 'Is less than or equal to',
            filterNumberGt: 'Is greater than',
            filterNumberGe: 'Is greater than or equal to',
            filterDateEq: 'Is equal to',
            filterDateNe: 'Is not equal to',
            filterDateLt: 'Is before',
            filterDateLe: 'Is before or equal to',
            filterDateGt: 'Is after',
            filterDateGe: 'Is after or equal to',
            filterEnumEq: 'Is equal to',
            filterEnumNe: 'Is not equal to',
            filterBoolIsTrue: 'is true',
            filterBoolIsFalse: 'is false',
            filterSelectValue: '-Select value-',
            filterOpenPopupHint: 'Open the calendar popup',
            groupHint: 'Drag a column header and drop it here to group by that column',
            deleteConfirmation: 'Are you sure you want to delete this record?'
        },
        queryString: {
            page: 'page',
            size: 'size',
            orderBy: 'orderBy',
            groupBy: 'groupBy',
            filter: 'filter'
        }
    };
})(jQuery);
