(function ($) {

    var $t = $.telerik;
    var expandModes = {
        'single': 0,
        'multi': 1
    };

    $.extend($t, {
        panelbar: function (element, options) {
            this.element = element;

            var $element = $(element);

            $.extend(this, options);

            var clickableItems = '.t-item:not(.t-state-disabled) > .t-link';

            $element
                .delegate(clickableItems, 'click', $t.delegate(this, this._click))
				.delegate(clickableItems, 'mouseenter', $t.hover)
				.delegate(clickableItems, 'mouseleave', $t.leave)
                .delegate('.t-item.t-state-disabled > .t-link', 'click', $t.preventDefault);

            $t.bind(this, {
                expand: this.onExpand,
                collapse: this.onCollapse,
                select: $.proxy(function (e) {
                    if (e.target == this.element && this.onSelect) this.onSelect(e);
                }, this),
                error: this.onError,
                load: this.onLoad
            });

            var $content = $element.find('li.t-state-active > .t-content');
            if ($content.length > 0 && $content.eq(0).children().length == 0)
                this.expand($content.parent());
        }
    });

    $t.panelbar.prototype = {

        expand: function (li) {
            $(li).each($.proxy(function (index, item) {
                var $item = $(item);
                if (!$item.hasClass('.t-state-disabled') && $item.find('> .t-group, > .t-content').length > 0) {

                    if (this.expandMode == expandModes.single && this._collapseAllExpanded($item))
                        return;

                    this._toggleItem($item, false, null);
                }
            }, this));
        },

        collapse: function (li) {
            $(li).each($.proxy(function (index, item) {
                var $item = $(item);

                if (!$item.hasClass('.t-state-disabled') && $item.find('> .t-group, > .t-content').is(':visible'))
                    this._toggleItem($item, true, null);

            }, this));
        },

        toggle: function (li, enable) {
            $(li).each(function () {
                $(this)
                    .toggleClass('t-state-default', enable)
				    .toggleClass('t-state-disabled', !enable);
            });
        },

        enable: function (li) {
            this.toggle(li, true);
        },

        disable: function (li) {
            this.toggle(li, false);
        },

        _click: function (e, element) {
            var $target = $(e.target);

            if ($target.closest('.t-link')[0] != element || $target.closest('.t-widget')[0] != this.element)
                return;

            var $element = $(element);
            var $item = $element.closest('.t-item');

            $element
                .find('.t-link').removeClass('t-state-selected').end()
                .addClass('t-state-selected');

            if ($t.trigger(this.element, 'select', { item: $item[0] })) {
                e.preventDefault();
            }

            var contents = $item.find('> .t-content, > .t-group');
            var href = $element.attr('href');
            var isAnchor = (href && (href.charAt(href.length - 1) == '#' || href.indexOf('#' + this.element.id + '-') != -1));

            if (isAnchor || contents.length > 0)
                e.preventDefault();
            else
                return;

            if (this.expandMode == expandModes.single)
                if (this._collapseAllExpanded($item))
                    return;

            if (contents.length != 0) {
                var visibility = contents.is(':visible');

                if (!$t.trigger(this.element, !visibility ? 'expand' : 'collapse', { item: $item[0] }))
                    this._toggleItem($item, visibility, e);
            }
        },

        _toggleItem: function ($element, isVisible, e) {
            var childGroup = $element.find('> .t-group');

            if (childGroup.length != 0) {

                this._toggleGroup(childGroup, isVisible);
                if (e != null)
                    e.preventDefault();
            } else {

                var itemIndex = $element.parent().children().index($element);
                var contentElement = $element.find('> .t-content');

                if (contentElement.length > 0) {
                    if (e != null)
                        e.preventDefault();
                    if ($.trim(contentElement.html()).length > 0) {
                        this._toggleGroup(contentElement, isVisible);
                    } else {
                        this._ajaxRequest($element, contentElement, isVisible);
                    }
                }
            }
        },

        _toggleGroup: function ($element, visibility) {
            if ($element.data('animating'))
                return;

            $element
                .data('animating', true)
			    .parent()
	            .toggleClass('t-state-default', visibility)
				.toggleClass('t-state-active', !visibility)
				.find('> .t-link > .t-icon')
					.toggleClass('t-arrow-up', !visibility)
					.toggleClass('t-panelbar-collapse', !visibility)
					.toggleClass('t-arrow-down', visibility)
					.toggleClass('t-panelbar-expand', visibility);

            $t.fx[!visibility ? 'play' : 'rewind'](this.effects, $element, null, function () {
                $element.data('animating', false);
            });
        },

        _collapseAllExpanded: function ($item) {
            if ($item.find('> .t-link').hasClass('t-header')) {
                if ($item.find('> .t-content, > .t-group').is(':visible') || $item.find('> .t-content, > .t-group').length == 0) {
                    return true;
                } else {
                    $(this.element).children().find('> .t-content, > .t-group')
                            .filter(function () { return $(this).is(':visible') })
                            .each($.proxy(function (index, content) {
                                this._toggleGroup($(content), true);
                            }, this));
                }
            }
        },

        _ajaxRequest: function ($element, contentElement, isVisible) {

            var statusIcon = $element.find('.t-panelbar-collapse, .t-panelbar-expand');
            var loadingIconTimeout = setTimeout(function () {
                statusIcon.addClass('t-loading');
            }, 100);

            var data = {};

            $.ajax({
                type: 'GET',
                cache: false,
                url: $element.find('.t-link').attr('href'),
                dataType: 'html',
                data: data,

                error: $.proxy(function (xhr, status) {
                    if ($t.ajaxError(this.element, 'error', xhr, status))
                        return;
                }, this),

                complete: function () {
                    clearTimeout(loadingIconTimeout);
                    statusIcon.removeClass('t-loading');
                },

                success: $.proxy(function (data, textStatus) {
                    contentElement.html(data);
                    this._toggleGroup(contentElement, isVisible);
                    var $link = contentElement.prev('.t-link');
                    $link.data('ContentUrl', $link.attr('href'))
                         .attr('href', '#');
                }, this)
            });
        }
    }

    $.fn.tPanelBar = function (options) {
        return $t.create(this, {
            name: 'tPanelBar',
            init: function(element, options) { 
                return new $t.panelbar(element, options);
            },
            options: options
        });
    };

    $.fn.tPanelBar.defaults = {
        effects: $t.fx.property.defaults('height')
    };
})(jQuery);