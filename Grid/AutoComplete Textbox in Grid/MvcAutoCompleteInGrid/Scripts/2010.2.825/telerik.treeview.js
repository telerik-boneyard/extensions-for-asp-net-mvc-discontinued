(function ($) {

    var $t = $.telerik;

    $t.treeview = function (element, options) {
        this.element = element;
        var $element = $(element);

        $.extend(this, options);

        var clickableItems = '.t-in:not(.t-state-selected,.t-state-disabled)';

        $('.t-in.t-state-selected', element)
            .live('mouseenter', $t.preventDefault);

        $element
            .delegate(clickableItems, 'mouseenter', $t.hover)
            .delegate(clickableItems, 'mouseleave', $t.leave)
            .delegate(clickableItems, 'click', $t.delegate(this, this.nodeSelect))
            .delegate('div:not(.t-state-disabled) .t-in', 'dblclick', $t.delegate(this, this.nodeClick))
            .delegate(':checkbox', 'click', $t.delegate(this, this.checkboxClick))
            .delegate('.t-plus, .t-minus', 'click', $t.delegate(this, this.nodeClick));

        if (this.isAjax())
            $element.find('.t-plus')
                .each(function () {
                    var item = $(this.parentNode);
                    item.parent().data('loaded', item.next('.t-group').length > 0);
                });

        if (this.dragAndDrop) {
            $t.bind(this, {
                nodeDragStart: this.onNodeDragStart,
                nodeDragging: this.onNodeDragging,
                nodeDragCancelled: this.onNodeDragCancelled,
                nodeDrop: this.onNodeDrop,
                nodeDropped: this.onNodeDropped
            });

            $t.draganddrop(this.element.id, $.extend({
                useDragClue: true,
                draggables: $('div:not(.t-state-disabled) .t-in', element)
            }, $t.draganddrop.applyContext($t.draganddrop.treeview, this)));
        }

        var $content = $element.find('.t-item > .t-content');
        if ($content.length > 0 && $($content[0]).children().length == 0)
            $element.find('.t-icon').hide();

        $t.bind(this, {
            expand: this.onExpand,
            collapse: this.onCollapse,
            select: $.proxy(function (e) {
                if (e.target == this.element && this.onSelect) this.onSelect(e);
            }, this),
            checked: this.onChecked,
            error: this.onError,
            load: this.onLoad,
            dataBinding: this.onDataBinding,
            dataBound: this.onDataBound
        });
    };

    $t.treeview.prototype = {

        expand: function (li) {
            $(li, this.element).each($.proxy(function (index, item) {
                var $item = $(item);
                var contents = $item.find('> .t-group, > .t-content');
                if ((contents.length > 0 && !contents.is(':visible')) || this.isAjax()) {
                    this.nodeToggle(null, $item);
                }
            }, this));
        },

        collapse: function (li) {
            $(li, this.element).each($.proxy(function (index, item) {
                var $item = $(item);
                var contents = $item.find('> .t-group, > .t-content');
                if (contents.length > 0 && contents.is(':visible')) {
                    this.nodeToggle(null, $item);
                }
            }, this));
        },

        enable: function (li) {
            this.toggle(li, true);
        },

        disable: function (li) {
            this.toggle(li, false);
        },

        toggle: function (li, enable) {
            $(li, this.element).each($.proxy(function (index, item) {
                var $item = $(item);
                this.collapse($item);

                $item.find('> div > .t-icon')
                        .toggleClass('t-state-default', enable)
                        .toggleClass('t-state-disabled', !enable);

                $item.find('> div > .t-in')
                        .toggleClass('t-state-default', enable)
                        .toggleClass('t-state-disabled', !enable);
            }, this));
        },

        reload: function (li) {
            var treeView = this;
            $(li).each(function () {
                var $item = $(this);
                $item.find('.t-group').remove();
                treeView.ajaxRequest($item);
            });
        },

        shouldNavigate: function (element) {
            var contents = $(element).closest('.t-item').find('> .t-content, > .t-group');
            var href = $(element).attr('href');

            return !((href && (href.charAt(href.length - 1) == '#' || href.indexOf('#' + this.element.id + '-') != -1)) ||
                    (contents.length > 0 && contents.children().length == 0));
        },

        nodeSelect: function (e, element) {

            if (!this.shouldNavigate(element))
                e.preventDefault();

            var $element = $(element);

            if (!$element.hasClass('.t-state-selected') &&
                !$t.trigger(this.element, 'select', { item: $element.closest('.t-item')[0] })) {
                $('.t-in', this.element).removeClass('t-state-hover t-state-selected');

                $element.addClass('t-state-selected');
            }
        },

        nodeToggle: function (e, $item, suppressAnimation) {

            if (e != null)
                e.preventDefault();

            if ($item.data('animating')
             || !$item.find("> div > .t-icon").is(":visible")
             || $item.find('> div > .t-in').hasClass('t-state-disabled'))
                return;

            $item.data('animating', !suppressAnimation);

            var contents = $item.find('> .t-group, > .t-content');

            var isExpanding = !contents.is(':visible');

            if (contents.children().length > 0
             && $item.data('loaded') !== false
             && !$t.trigger(this.element, isExpanding ? 'expand' : 'collapse', { item: $item[0] })) {
                $item.find('> div > .t-icon')
                        .toggleClass('t-minus', isExpanding)
                        .toggleClass('t-plus', !isExpanding);

                if (!suppressAnimation)
                    $t.fx[isExpanding ? 'play' : 'rewind'](this.effects, contents, { direction: 'bottom' }, function () {
                        $item.data('animating', false);
                    });
                else
                    contents[isExpanding ? 'show' : 'hide']();
            } else if (isExpanding && this.isAjax() && (contents.length == 0 || $item.data('loaded') === false))
                this.ajaxRequest($item);
        },

        nodeClick: function (e, element) {

            var $element = $(element);
            var $item = $element.closest('.t-item');

            if ($element.hasClass('t-plus-disabled') || $element.hasClass('t-minus-disabled'))
                return;

            this.nodeToggle(e, $item);
        },

        isAjax: function () {
            return this.ajax || this.ws || this.onDataBinding;
        },

        url: function (which) {
            return (this.ajax || this.ws)[which];
        },

        ajaxOptions: function ($item, options) {
            var result = {
                type: 'POST',
                dataType: 'text',
                error: $.proxy(function (xhr, status) {
                    if ($t.ajaxError(this.element, 'error', xhr, status))
                        return;

                    if (status == 'parsererror')
                        alert('Error! The requested URL did not return JSON.');
                }, this),

                success: $.proxy(function (data) {
                    data = eval("(" + data + ")");
                    data = data.d || data; // Support the `d` returned by MS Web Services
                    this.dataBind($item, data);
                }, this)
            };

            result = $.extend(result, options);

            var node = this.ws ? result.data.node = {} : result.data;

            if ($item.hasClass('t-item')) {
                node[this.queryString.value] = this.getItemValue($item);
                node[this.queryString.text] = this.getItemText($item);
            }

            if (this.ws) {
                result.data = $t.toJson(result.data);
                result.contentType = 'application/json; charset=utf-8';
            }

            return result;
        },

        ajaxRequest: function ($item) {

            $item = $item || $(this.element);

            if ($t.trigger(this.element, 'dataBinding', { item: $item[0] }) || (!this.ajax && !this.ws))
                return;

            $item.data('loadingIconTimeout', setTimeout(function () {
                $item.find('> div > .t-icon').addClass('t-loading');
            }, 100));

            $.ajax(this.ajaxOptions($item, {
                data: {},
                url: this.url('selectUrl')
            }));
        },

        bindTo: function (data) {

            var $element = $(this.element);
            this.dataBind($element, data);
        },

        dataBind: function ($item, data) {
            $item = $($item); // can be called from user code with dom objects

            if (data.length == 0) {
                $('.t-icon', $item).hide();
                return;
            }

            var group = $item.find('> .t-group');

            var isGroup = group.length == 0;
            var groupHtml = new $t.stringBuilder();
            $t.treeview.getGroupHtml(data, groupHtml, this.isAjax(), $item.hasClass('t-treeview'), this.showCheckBox, isGroup ? data[0].Expanded : false, isGroup);

            $item.data('animating', true);

            if (group.length > 0 && $item.data('loaded') === false)
                $(groupHtml.string()).prependTo(group);
            else if (group.length > 0 && $item.data('loaded') !== false)
                group.html(groupHtml.string());
            else if (group.length == 0)
                group = $(groupHtml.string()).appendTo($item);

            $t.fx.play(this.effects, group, { direction: 'bottom' }, function () {
                $item.data('animating', false);
            });

            clearTimeout($item.data('loadingIconTimeout'));

            if ($item.hasClass('t-item'))
                $item.data('loaded', true)
                    .find('.t-icon:first')
                        .removeClass('t-loading')
                        .removeClass('t-plus')
                        .addClass('t-minus');

            $t.trigger(this.element, 'dataBound');
        },

        checkboxClick: function (e, element) {
            var isChecked = $(element).is(':checked');

            var isEventPrevented =
                $t.trigger(this.element, 'checked', {
                    item: $(element).closest('.t-item')[0],
                    checked: isChecked
                });

            if (!isEventPrevented)
                this.nodeCheck(element, isChecked);
            else
                e.preventDefault();

            return isEventPrevented;
        },

        nodeCheck: function (li, isChecked) {
            $(li, this.element).each($.proxy(function (index, item) {
                var $element = $(item);
                var $item = $element.closest('.t-item');
                var $checkboxHolder = $("> div > .t-checkbox", $item);
                var arrayName = this.element.id + '_checkedNodes';
                var $index = $checkboxHolder.find(':input[name="' + arrayName + '.Index"]');

                var value = $index.val();

                $checkboxHolder.find(':input[name="' + arrayName + '[' + value + '].Text"]').remove();
                $checkboxHolder.find(':input[name="' + arrayName + '[' + value + '].Value"]').remove();

                $checkboxHolder.find(':checkbox').attr('checked', isChecked ? 'checked' : '');

                if (isChecked) {
                    var html = new $t.stringBuilder();

                    html.cat('<input type="hidden" value="')
                        .cat(this.getItemValue($item))
                        .cat('" name="' + arrayName + '[').cat(value).cat('].Value" class="t-input">')

                        .cat('<input type="hidden" value="')
                        .cat(this.getItemText($item))
                        .cat('" name="' + arrayName + '[').cat(value).cat('].Text" class="t-input">');

                    $(html.string()).appendTo($checkboxHolder);
                }
            }, this));
        },

        getItemText: function (item) {
            return $(item).find('> div > .t-in').text();
        },

        getItemValue: function (item) {
            return $(item).find('>div>:input[name="itemValue"]').val() || this.getItemText(item);
        }
    };

    $.extend($t.draganddrop, {
        treeview: {
            shouldDrag: function ($element) { return true; },

            createDragClue: function ($draggedElement) {
                return $draggedElement.closest('.t-top,.t-mid,.t-bot').text();
            },

            onDragStart: function (e, $draggedElement) {
                var isEventPrevented =
                        $t.trigger(this.element, 'nodeDragStart', { item: $draggedElement.closest('.t-item')[0] });

                if (!isEventPrevented)
                    this.$dropClue = $('<div class="t-drop-clue" />').appendTo(this.element);

                return isEventPrevented;
            },

            onDragMove: function (e, $draggedElement) {
                // change status & show drop clue

                var status;

                $t.trigger(this.element, 'nodeDragging', {
                    pageY: e.pageY,
                    dropTarget: e.target,
                    setStatusClass: function (newStatus) { status = newStatus; },
                    item: $draggedElement.closest('.t-item')[0]
                });

                if (status) {
                    this.$dropClue.css('visibility', 'hidden');
                    return status;
                }

                if (this.dragAndDrop.dropTargets && $(e.target).closest(this.dragAndDrop.dropTargets).length > 0)
                    return 't-add';

                if (!$.contains(this.element, e.target)) {
                    this.$dropClue.css('visibility', 'hidden');
                    return;
                } else if ($.contains($draggedElement.closest('.t-item')[0], e.target)) {
                    // dragging item within itself
                    this.$dropClue.css('visibility', 'hidden');
                    return 't-denied';
                }

                this.$dropClue.css('visibility', 'visible');

                var clueStatus = 't-insert-middle';
                var dropTarget = $(e.target);

                var hoveredItem = dropTarget.closest('.t-top,.t-mid,.t-bot');

                if (hoveredItem.length > 0) {

                    var itemHeight = hoveredItem.outerHeight();
                    var itemTop = hoveredItem.offset().top;
                    var itemContent = dropTarget.closest('.t-in');
                    var delta = itemHeight / (itemContent.length > 0 ? 4 : 2);

                    var insertOnTop = e.pageY < (itemTop + delta);
                    var insertOnBottom = (itemTop + itemHeight - delta) < e.pageY;
                    var addChild = itemContent.length > 0 && !insertOnTop && !insertOnBottom;

                    itemContent.toggleClass('t-state-hover', addChild);
                    this.$dropClue.css('visibility', addChild ? 'hidden' : 'visible');

                    if (addChild) {
                        clueStatus = 't-add';

                        this.$dropTarget = dropTarget;
                    } else {

                        var hoveredItemPos = hoveredItem.position();
                        hoveredItemPos.top += insertOnTop ? 0 : itemHeight;

                        this.$dropClue
                            .css(hoveredItemPos)
                            [insertOnTop ? 'prependTo' : 'appendTo']
                                (dropTarget.closest('.t-item').find('> div:first'));

                        clueStatus = 't-insert-middle';

                        if (insertOnTop && hoveredItem.hasClass('t-top')) clueStatus = 't-insert-top';
                        if (insertOnBottom && hoveredItem.hasClass('t-bot')) clueStatus = 't-insert-bottom';
                    }
                }

                return clueStatus;
            },

            onDragCancelled: function (e, $draggedElement) {
                $t.trigger(this.element, 'nodeDragCancelled', { item: $draggedElement.closest('.t-item')[0] });

                this.$dropClue.remove();
            },

            onDrop: function (e, $draggedElement, $dragClue) {
                var isDropPrevented =
                        $t.trigger(this.element, 'nodeDrop', {
                            isValid: !$dragClue.find('.t-drag-status').hasClass('t-denied'),
                            dropTarget: e.target,
                            item: $draggedElement.closest('.t-item')[0]
                        });

                if (isDropPrevented || !$.contains(this.element, e.target)) {
                    this.$dropClue.remove();
                    return isDropPrevented;
                }

                return isDropPrevented ? true : $.proxy(function (removeClueCallback) {

                    var sourceItem = $draggedElement.closest('.t-top,.t-mid,.t-bot');
                    var movedItem = sourceItem.parent(); // .t-item
                    var sourceGroup = sourceItem.closest('.t-group');

                    // dragging item within itself
                    if ($.contains(movedItem[0], e.target)) {
                        removeClueCallback();
                        this.$dropClue.remove();
                        return;
                    }

                    // normalize source group
                    if (movedItem.hasClass('t-last'))
                        movedItem.removeClass('t-last')
                            .prev().addClass('t-last')
                            .find('> div').removeClass('t-top t-mid').addClass('t-bot');

                    var dropPosition = 'over';
                    var destinationItem;

                    // perform reorder / move
                    if (this.$dropClue.css('visibility') == 'visible') {
                        var insertItem = this.$dropClue.closest('.t-item');
                        dropPosition = this.$dropClue.prevAll('.t-in').length > 0 ? 'after' : 'before';
                        destinationItem = insertItem.find('> div');
                        insertItem[dropPosition](movedItem);
                    } else {
                        destinationItem = this.$dropTarget.closest('.t-top,.t-mid,.t-bot');
                        var targetGroup = destinationItem.next('.t-group');

                        if (targetGroup.length === 0) {
                            targetGroup = $('<ul class="t-group" />').appendTo(destinationItem.parent());
                            destinationItem.prepend('<span class="t-icon t-minus" />');
                        }

                        targetGroup.append(movedItem);

                        if (destinationItem.find('> .t-icon').hasClass('t-plus'))
                            this.nodeToggle(null, destinationItem.parent(), true);
                    }

                    $t.trigger(this.element, 'nodeDropped', {
                        destinationItem: destinationItem.closest('.t-item')[0],
                        dropPosition: dropPosition,
                        item: sourceItem.parent('.t-item')[0]
                    });

                    var level = movedItem.parents('.t-group').length;

                    var normalizeClasses = function (item) {
                        var isFirstItem = item.prev().length === 0;
                        var isLastItem = item.next().length === 0;

                        item.toggleClass('t-first', isFirstItem && level === 1)
                            .toggleClass('t-last', isLastItem)
                            .find('> div')
                                .toggleClass('t-top', isFirstItem && !isLastItem)
                                .toggleClass('t-mid', !isFirstItem && !isLastItem)
                                .toggleClass('t-bot', isLastItem);
                    };

                    normalizeClasses(movedItem);
                    normalizeClasses(movedItem.prev());
                    normalizeClasses(movedItem.next());

                    // remove source group if it is empty
                    if (sourceGroup.children().length === 0) {
                        sourceGroup.prev('div').find('.t-plus,.t-minus').remove();
                        sourceGroup.remove();
                    }

                    removeClueCallback();
                    this.$dropClue.remove();
                }, this);
            }
        }
    });

    // client-side rendering
    $.extend($t.treeview, {
        getItemHtml: function (item, html, isAjax, isFirstLevel, showCheckBoxes, itemIndex, itemsCount) {
            html.cat('<li class="t-item')
                    .catIf(' t-first', isFirstLevel && itemIndex == 0)
                    .catIf(' t-last', itemIndex == itemsCount - 1)
                .cat('">')
                .cat('<div class="')
                    .catIf('t-top ', isFirstLevel && itemIndex == 0)
                    .catIf('t-top', itemIndex != itemsCount - 1 && itemIndex == 0)
                    .catIf('t-mid', itemIndex != itemsCount - 1 && itemIndex != 0)
                    .catIf('t-bot', itemIndex == itemsCount - 1)
                .cat('">');

            if ((isAjax && item.LoadOnDemand) || (item.Items && item.Items.length > 0))
                html.cat('<span class="t-icon')
                        .catIf(' t-plus', !item.Expanded)
                        .catIf(' t-minus', item.Expanded)
                        .catIf('-disabled', item.Enabled === false) // t-(plus|minus)-disabled
                    .cat('"></span>');

            if (showCheckBoxes && item.Checkable !== false)
                html.cat('<input type="checkbox" value="')
                    .cat(item.Value)
                    .cat('" class="t-input')
                    .catIf(' t-state-disabled', item.Enabled === false)
                    .cat('"')
                    .catIf(' checked="checked"', item.Checked)
                    .cat('/>');

            html.cat(item.NavigateUrl ? '<a href="' + item.NavigateUrl + '" class="t-link ' : '<span class="')
                    .cat('t-in').catIf(' t-state-disabled', item.Enabled === false)
                .cat('">');

            if (item.ImageUrl != null)
                html.cat('<img class="t-image" alt="" src="')
                    .cat(item.ImageUrl)
                    .cat('" />');

            html.catIf(item.Text, item.Encoded === false)
                .catIf(item.Text.replace(/</g, '&lt;').replace(/>/g, '&gt;'), item.Encoded !== false)
                .cat(item.NavigateUrl ? '</a>' : '</span>');

            if (item.Value)
                html.cat('<input type="hidden" class="t-input" name="itemValue" value="')
                    .cat(item.Value)
                    .cat('" />');

            html.cat('</div>');

            if (item.Items && item.Items.length > 0)
                $t.treeview.getGroupHtml(item.Items, html, isAjax, false, showCheckBoxes, item.Expanded);

            html.cat('</li>');
        },

        getGroupHtml: function (data, html, isAjax, isFirstLevel, showCheckBoxes, isExpanded, renderGroup) {

            if (renderGroup !== false)
                html.cat('<ul class="t-group')
                    .catIf(' t-treeview-lines', isFirstLevel)
                    .cat('"')
                    .catIf(' style="display:none"', isExpanded === false)
                    .cat('>');

            if (data && data.length > 0) {
                var getItemHtml = $t.treeview.getItemHtml;

                for (var i = 0, len = data.length; i < len; i++)
                    getItemHtml(data[i], html, isAjax, isFirstLevel, showCheckBoxes, i, len);
            }

            if (renderGroup !== false)
                html.cat('</ul>');
        }
    });

    // jQuery extender
    $.fn.tTreeView = function (options) {
        return $t.create(this, {
            name: 'tTreeView',
            init: function (element, options) {
                return new $t.treeview(element, options);
            },
            options: options,
            success: function (treeView) {
                if (treeView.isAjax() && $(treeView.element).find('.t-item').length == 0)
                    treeView.ajaxRequest();
            }
        });
    };

    // default options
    $.fn.tTreeView.defaults = {
        effects: $t.fx.property.defaults('height'),
        queryString: {
            text: 'Text',
            value: 'Value'
        }
    };
})(jQuery);
