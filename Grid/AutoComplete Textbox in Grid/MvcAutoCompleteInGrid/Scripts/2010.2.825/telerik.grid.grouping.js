(function ($) {
    var $t = $.telerik;

    var dropClueOffsetTop = 3;
    var dropClueOffsetLeft = 0;

    $t.grouping = {};

    $t.grouping.initialize = function (grid) {
        $.extend(grid, $t.grouping.implementation);

        grid.$groupDropClue = $('<div class="t-grouping-dropclue"/>');
        grid.$groupHeader = $('> .t-grouping-header', grid.element);
        
        $t.draganddrop(grid.element.id, $.extend({
            useDragClue: true,
            draggables: [$('.t-link', grid.$groupHeader[0]), $('.t-header:not(.t-group-cell,.t-hierarchy-cell)', grid.$header[0])]
        }, $t.draganddrop.applyContext($t.draganddrop.grouping, grid)));

        if (grid.isAjax()) {
            grid.$groupHeader
                .delegate('.t-button', 'click', function (e) {
                    e.preventDefault();
                    grid.unGroup($(this).parent().text());
                })
                .delegate('.t-link', 'click', function (e) {
                    e.preventDefault();
                    var group = grid.groupFromTitle($(this).parent().text());
                    group.order = group.order == 'asc' ? 'desc' : 'asc';
                    grid.group(group.title);
                });
        }

        grid.$groupHeader.delegate('.t-group-indicator', 'mouseenter', function () {
                grid.$currentGroupItem = $(this);
            })
            .delegate('.t-group-indicator', 'mouseleave', function () {
                grid.$currentGroupItem = null;
            });

        grid.$tbody.delegate('.t-grouping-row .t-collapse, .t-grouping-row .t-expand', 'click', $t.stop(function (e) {
            e.preventDefault();
            var $tr = $(this).closest('tr');
            if ($(this).hasClass('t-collapse'))
                grid.collapseGroup($tr);
            else
                grid.expandGroup($tr);
        }));
    }

    $t.grouping.implementation = {

        columnFromTitle: function (title) {
            return $.grep(this.columns, function (c) { return c.title == title; })[0];
        },

        groupFromTitle: function (title) {
            return $.grep(this.groups, function (g) { return g.title == title; })[0];
        },

        expandGroup: function (group) {
            var $group = $(group);
            var depth = $group.find('.t-group-cell').length;
            
            $group.find('~ tr').each($.proxy(function (i, tr) {
                var $tr = $(tr);
                var offset = $tr.find('.t-group-cell').length;
                if (offset <= depth)
                    return false;

                if (offset == depth + 1 && !$tr.hasClass('t-detail-row')) {
                    $tr.show();

                    if ($tr.hasClass('t-grouping-row') && $tr.find('.t-icon').hasClass('t-collapse'))
                        this.expandGroup($tr);
                    if ($tr.hasClass('t-master-row') && $tr.find('.t-icon').hasClass('t-minus'))
                        $tr.next().show();
                }
            }, this));

            $group.find('.t-icon').addClass('t-collapse').removeClass('t-expand');
        },

        collapseGroup: function (group) {
            var $group = $(group);
            var depth = $group.find('.t-group-cell').length;
            $group.find('~ tr').each(function () {
                var $tr = $(this);
                var offset = $tr.find('.t-group-cell').length;
                if (offset <= depth)
                    return false;

                $tr.hide();
            });
            $group.find('.t-icon').addClass('t-expand').removeClass('t-collapse');
        },

        group: function (title, position) {
            if (this.groups.length == 0 && this.isAjax())
                this.$groupHeader.empty();

            var group = $.grep(this.groups, function (group) {
                return group.title == title;
            })[0];

            if (!group) {
                var column = this.columnFromTitle(title);
                group = { order: 'asc', member: column.member, title: title };
                this.groups.push(group);
            }

            if (position >= 0) {
                this.groups.splice($.inArray(group, this.groups), 1);
                this.groups.splice(position, 0, group);
            }

            this.groupBy = $.map(this.groups, function (g) { return g.member + '-' + g.order; }).join('~')

            if (this.isAjax()) {
                var $groupItem = this.$groupHeader.find('div:contains("' + title + '")');
                if ($groupItem.length == 0) {
                    var html = new $.telerik.stringBuilder()
                        .cat('<div class="t-group-indicator">')
                            .cat('<a href="#" class="t-link"><span class="t-icon" />').cat(title).cat('</a>')
                            .cat('<a class="t-button t-state-default"><span class="t-icon t-group-delete" /></a>')
                        .cat('</div>')
                    .string();
                    $groupItem = $(html).appendTo(this.$groupHeader);
                }

                if (this.$groupDropClue.is(':visible'))
                    $groupItem.insertBefore(this.$groupDropClue);

                $groupItem.find('.t-link .t-icon')
                          .toggleClass('t-arrow-up-small', group.order == 'asc')
                          .toggleClass('t-arrow-down-small', group.order == 'desc');

                this.ajaxRequest();
            } else {
                this.serverRequest();
            }
        },

        unGroup: function (title) {
            var group = this.groupFromTitle(title);
            this.groups.splice($.inArray(group, this.groups), 1);

            if (this.groups.length == 0)
                this.$groupHeader.html(this.localization.groupHint);

            this.groupBy = $.map(this.groups, function (g) { return g.member + '-' + g.order; }).join('~');

            if (this.isAjax()) {
                this.$groupHeader.find('div:contains("' + group.title + '")').remove();
                this.ajaxRequest();
            } else {
                this.serverRequest();
            }
        },

        normalizeColumns: function(colspan) {
            var groups = this.groups.length;
            var diff = colspan - this.$tbody.parent().find('col').length;
            if (diff == 0) return;

            var $tables = this.$tbody.parent().add(this.$headerWrap.find('table'));
            if ($.browser.msie) {
                // ie8 goes into compatibility mode if the columns get removed
                if (diff > 0) {
                    $(new $t.stringBuilder().rep('<col class="t-group-col" />', diff).string())
                            .prependTo($tables.find('colgroup'))
                    $(new $t.stringBuilder().rep('<th class="t-group-cell t-header">&nbsp;</th>', diff).string())
                        .insertBefore($tables.find('th.t-header:first'));

                } else {
                    $tables.find('th:lt(' + Math.abs(diff) + ')')
                           .remove()
                           .end()
                           .find('col:lt(' + Math.abs(diff) + ')')
                           .remove();
                }

                // ie8 does not resize columns in scrollable grids correctly
                if (document.documentMode == 8) {
                    if (this.scrollable)
                        $tables.css('table-layout', 'auto');

                    var me = this;
                    var groupWidth = 30;

                    $tables.find('col').css('width', function () {
                        return $(this).is('.t-group-col,.t-hierarchy-col') ? groupWidth :
                                          ($(me.element).width() - groups * groupWidth - 16) / me.columns.length;
                    });
                }
            } else {
                $tables.find('col.t-group-col').remove();

                $(new $t.stringBuilder().rep('<col class="t-group-col" />', groups).string())
                        .prependTo($tables.find('colgroup'));

                $tables.find('th.t-group-cell').remove();
                $(new $t.stringBuilder().rep('<th class="t-group-cell t-header">&nbsp;</th>', groups).string())
                        .insertBefore($tables.find('th.t-header:first'));
            }

            this.$footer.attr('colspan', colspan);
        },

        bindGroup: function (dataItem, colspan, html, level) {
            var group = this.groups[level];
            var key = dataItem.Key;
            var column = $.grep(this.columns, function (column) { return group.member == column.member })[0];

            if (column && (column.format || column.type == 'Date'))
                key = $t.formatString(column.format || '{0:G}', key);

            html.cat('<tr class="t-grouping-row">')
                .rep('<td class="t-group-cell"></td>', level)
                .cat('<td colspan="')
                .cat(colspan - level)
                .cat('"><p class="t-reset"><a class="t-icon t-collapse" href="#"></a>')
                .cat(group.title)
                .cat(': ')
                .cat(key)
                .cat('</p></td></tr>');

            if (dataItem.HasSubgroups) {
                for (var i = 0, l = dataItem.Items.length; i < l; i++)
                    this.bindGroup(dataItem.Items[i], colspan, html, level + 1);
            } else {
                this.bindData(dataItem.Items, html, level + 1);
            }
        }
    }

    $.extend($t.draganddrop, {
        grouping: {
            shouldDrag: function ($element) {
                if ($element.closest('.t-grid-filter, .t-filter').length)
                    return false;
                
                if ($element.closest('.t-grid')[0] != this.element)
                    return false;
                
                var column = this.columnFromTitle($element.text());
                if (column && column.groupable === false)
                    return false;

                return true;
            },

            createDragClue: function ($draggedElement) {
                return $draggedElement.text();
            },

            onDragStart: function () { return false; },

            onDragMove: function (e, $source) {
                e.stopPropagation();

                // change status & show drop clue
                if (!$.contains(this.element, e.target) ||
                !$(e.target).closest('.t-grouping-header').length
                || (this.groupFromTitle($source.text()) && $source.closest('.t-header').length)) {
                    this.$groupDropClue.remove();
                    return 't-denied';
                }

                var groupIndicators = $.map(this.$groupHeader.find('.t-group-indicator'), function (group) {
                    var $group = $(group);
                    var left = $group.offset().left;
                    return { left: left, right: left + $group.outerWidth(), $group: $group };
                });

                var top = $('> .t-grid-toolbar', this.element).outerHeight() + dropClueOffsetTop;

                if (!groupIndicators.length) {
                    this.$groupDropClue.css({ top: top, left: dropClueOffsetLeft }).appendTo(this.$groupHeader);
                    return 't-add';
                }

                var firstGroupIndicator = groupIndicators[0];
                var lastGroupIndicator = groupIndicators[groupIndicators.length - 1];
                var leftMargin = parseInt(firstGroupIndicator.$group.css('marginLeft'));
                var rightMargin = parseInt(firstGroupIndicator.$group.css('marginRight'));

                var currentGroupIndicator = $.grep(groupIndicators, function (g) {
                    return e.pageX >= g.left - leftMargin - rightMargin && e.pageX <= g.right;
                })[0];

                if (!currentGroupIndicator && firstGroupIndicator && e.pageX < firstGroupIndicator.left) {
                    currentGroupIndicator = firstGroupIndicator;
                }

                if (currentGroupIndicator)
                    this.$groupDropClue.css({ top: top, left: currentGroupIndicator.$group.position().left - leftMargin + dropClueOffsetLeft })
                        .insertBefore(currentGroupIndicator.$group);
                else
                    this.$groupDropClue.css({ top: top, left: lastGroupIndicator.$group.position().left + lastGroupIndicator.$group.outerWidth() + rightMargin + dropClueOffsetLeft })
                                   .appendTo(this.$groupHeader);


                return 't-add';
            },

            onDragCancelled: function () {
                this.$groupDropClue.remove();
            },

            onDrop: function (e, $draggedElement) {
                var groupingHeader = $(e.target).closest('.t-grouping-header');
                var title = $draggedElement.text();
                var group = this.groupFromTitle(title);

                var groupIndex = $.inArray(group, this.groups);

                if (groupingHeader.length > 0) {
                    var position = this.$groupHeader.find('div').index(this.$groupDropClue);
                    var delta = groupIndex - position;
                    if (!group || (this.$groupDropClue.is(':visible') && delta != 0 && delta != -1))
                        this.group(title, position);
                } else if ($draggedElement.parent().is('.t-group-indicator')) {
                    this.unGroup(title);
                } else {
                    this.$groupDropClue.remove();
                    return false;
                }

                this.$groupDropClue.remove();

                return true;
            }
        }
    });
})(jQuery);
