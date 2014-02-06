(function ($) {

    var $t = $.telerik;

    function isLocalUrl(url) {
        var loweredUrl = url ? url.toLowerCase() : '';
        return loweredUrl && loweredUrl.indexOf('http') !== 0 && loweredUrl.indexOf('https') !== 0;
    }

    function fixIE6Sizing($element) {
        if ($.browser.msie && $.browser.version < 7) {
            $element
                .find('.t-resize-e,.t-resize-w').css('height', $element.height()).end()
                .find('.t-resize-n,.t-resize-s').css('width', $element.width()).end()
                .find('.t-overlay').css({ width: $element.width(), height: $element.height() });
        }
    }

    // zoom animation

    $t.fx.zoom = function (element) {
        this.element = element;
    };

    $t.fx.zoom.prototype = {
        play: function (options, end) {
            var $element = this.element.show();

            var resizeElement = $element.find('> .t-window-content');

            var endValues = {
                width: resizeElement.width(),
                height: resizeElement.height(),
                left: parseInt($element.css('left')),
                top: parseInt($element.css('top'))
            };

            $element
                .css({
                    left: endValues.left + 20,
                    top: endValues.top + 20
                })
                .animate({
                    left: endValues.left,
                    top: endValues.top
                }, options.openDuration);

            resizeElement
                .css({
                    width: endValues.width - 40,
                    height: endValues.height - 40
                })
                .animate({
                    width: endValues.width,
                    height: endValues.height
                }, options.openDuration);
        },

        rewind: function (options, end) {
            var $element = this.element;

            var resizeElement = $element.find('> .t-window-content');
            var endValues = {
                width: resizeElement.width(),
                height: resizeElement.height(),
                left: parseInt($element.css('left')),
                top: parseInt($element.css('top'))
            };

            resizeElement.animate({
                width: endValues.width - 40,
                height: endValues.height - 40
            }, options.closeDuration);

            $element.animate({
                left: endValues.left + 20,
                top: endValues.top + 20
            }, options.closeDuration, function () {
                $element.css({
                    left: endValues.left,
                    top: endValues.top
                }).hide();

                resizeElement.css({
                    width: endValues.width,
                    height: endValues.height
                });

                if (end) end();
            });
        }
    }

    $t.fx.zoom.defaults = function () {
        return { list: [{ name: 'zoom'}], openDuration: 'fast', closeDuration: 'fast' };
    };

    $t.window = function (element, options) {
        this.element = element;
        var $element = $(element);

        if (!$element.is('.t-window')) {
            $element.addClass('t-widget t-window');
            $t.window.create(element, options);
        }

        $.extend(this, options);

        var windowActions = '.t-window-titlebar .t-window-action';

        $element
            .delegate('.t-window-titlebar', 'dblclick', $.proxy(this.toggleMaximization, this))
            .delegate(windowActions, 'mouseenter', $t.hover)
            .delegate(windowActions, 'mouseleave', $t.leave)
            .delegate(windowActions, 'click', $.proxy(this.windowActionHandler, this));

        if (this.resizable) {
            $element.append($t.window.getResizeHandlesHtml());

            fixIE6Sizing($element);

            $t.draganddrop(this.element.id + 'Resize', $.extend({
                draggables: $element.find('.t-resize-handle'),
                hitTestOffset: 0
            }, $t.draganddrop.applyContext($t.draganddrop.windowResize, this)));
        }

        if (this.draggable) {
            $t.draganddrop(this.element.id + 'Move', $.extend({
                draggables: $element.find('.t-window-titlebar')
            }, $t.draganddrop.applyContext($t.draganddrop.windowMove, this)));
        }

        $t.bind(this, {
            open: this.onOpen,
            close: this.onClose,
            refresh: this.onRefresh,
            resize: this.onResize,
            error: this.onError,
            load: this.onLoad,
            move: this.onMove
        });

        if (!$element.parent().is('body'))
            $element
                .css($element.offset())
                .appendTo(document.body);

        if (this.modal && $('body > .t-overlay').length == 0)
            this.overlay($element.is(':visible'));

        $(window).resize($.proxy(this.onDocumentResize, this));

        if (isLocalUrl(this.contentUrl)) this.ajaxRequest();
    };

    $t.window.prototype = {
        overlay: function(visible) {
            var overlay = $('body > .t-overlay');
            if (overlay.length == 0)
                overlay = $('<div class="t-overlay" />')
                                .toggle(visible)
                                .appendTo(this.element.ownerDocument.body);
            var $doc = $(document);
            if ($.browser.msie && $.browser.version < 7)
                overlay.css({
                    width: $doc.width() - 21,
                    height: $doc.height(),
                    position: 'absolute'
                });

            return overlay;
        },

        windowActionHandler: function (e) {
            var $target = $(e.target).closest('.t-window-action').find('.t-icon');
            var contextWindow = this;

            $.each({
                't-close': this.close,
                't-maximize': this.maximize,
                't-restore': this.restore,
                't-refresh': this.refresh
            }, function (commandName, handler) {
                if ($target.hasClass(commandName)) {
                    e.preventDefault();
                    handler.call(contextWindow);
                    return false;
                }
            });
        },

        center: function () {
            var $element = $(this.element);
            var $window = $(window);

            $element.css({
                left: ($window.width() - $element.width()) / 2,
                top: ($window.height() - $element.height()) / 2
            });

            return this;
        },

        title: function (text) {
            var $title = $('.t-window-titlebar > .t-window-title', this.element);

            if (!text)
                return $title.text();

            $title.text(text);
            return this;
        },

        content: function (html) {
            var $content = $('> .t-window-content', this.element);

            if (!html)
                return $content.html();

            $content.html(html);
            return this;
        },

        open: function (e) {
            var $element = $(this.element);

            if (!$element.is(':visible')) {
                if (!$t.trigger(this.element, 'open')) {
                    if (this.modal) {

                        var overlay = this.overlay(false);

                        if (this.effects.list.length > 0 && this.effects.list[0].name != 'toggle')
                            overlay.css('opacity', 0).show().animate({ opacity: 0.5 }, this.effects.openDuration);
                        else
                            overlay.css('opacity', 0.5).show();
                    }

                    $t.fx.play(this.effects, $element);
                }
            }

            return this;
        },

        close: function (e) {
            var $element = $(this.element);
            if ($element.is(':visible')) {
                if (!$t.trigger(this.element, 'close')) {
                    var overlay = this.modal ? this.overlay(true) : $(undefined);

                    overlay.animate({ opacity: 0 }, this.effects.closeDuration);

                    $t.fx.rewind(this.effects, $element, null, function () {
                        overlay.add($element[0]).hide();
                    });
                }
            }

            if (this.isMaximized)
                $('html, body').css('overflow', '');

            return this;
        },

        toggleMaximization: function (e) {
            if (e && $(e.target).closest('.t-window-action').length > 0) return;
            this[this.isMaximized ? 'restore' : 'maximize']();
        },

        restore: function () {
            if (!this.isMaximized)
                return;

            $(this.element)
                .css({
                    position: 'absolute',
                    left: this.restorationSettings.left,
                    top: this.restorationSettings.top
                })
                .find('> .t-window-content')
                    .css({
                        width: this.restorationSettings.width,
                        height: this.restorationSettings.height
                    }).end()
                .find('.t-resize-handle').show().end()
                .find('.t-window-titlebar .t-restore').addClass('t-maximize').removeClass('t-restore');

            $('html, body').css('overflow', '');

            this.isMaximized = false;

            $t.trigger(this.element, 'resize');

            return this;
        },

        maximize: function (e) {
            if (this.isMaximized)
                return;

            var $element = $(this.element);
            var resizeElement = $element.find('> .t-window-content');

            this.restorationSettings = {
                left: $element.position().left,
                top: $element.position().top,
                width: resizeElement.width(),
                height: resizeElement.height()
            };

            $element
                .css({ left: 0, top: 0, position: 'fixed' })
                .find('.t-resize-handle').hide().end()
                .find('.t-window-titlebar .t-maximize').addClass('t-restore').removeClass('t-maximize');

            $('html, body').css('overflow', 'hidden');

            this.isMaximized = true;

            this.onDocumentResize();

            return this;
        },

        onDocumentResize: function () {
            if (!this.isMaximized)
                return;

            var $element = $(this.element);
            var resizeElement = $element.find('> .t-window-content');

            resizeElement
                .css({
                    width: $(window).width()
                        - (resizeElement.outerWidth() - resizeElement.width()
                        + $element.outerWidth() - $element.width()),
                    height: $(window).height()
                        - (resizeElement.outerHeight() - resizeElement.height()
                        + $element.outerHeight() - $element.height()
                        + $element.find('> .t-window-titlebar').outerHeight())
                });

            fixIE6Sizing($element);

            $t.trigger($element, 'resize');
        },

        refresh: function () {
            if (isLocalUrl(this.contentUrl)) this.ajaxRequest();

            return this;
        },

        ajaxRequest: function (url) {
            var loadingIconTimeout = setTimeout(function () {
                $('.t-refresh', this.element).addClass('t-loading');
            }, 100);

            var data = {};

            $.ajax({
                type: 'GET',
                url: url || this.contentUrl,
                dataType: 'html',
                data: data,

                error: $.proxy(function (xhr, status) {
                    if ($t.ajaxError(this.element, 'error', xhr, status))
                        return;
                }, this),

                complete: function () {
                    clearTimeout(loadingIconTimeout);
                    $('.t-refresh', this.element).removeClass('t-loading');
                },

                success: $.proxy(function (data, textStatus) {
                    $('.t-window-content', this.element).html(data);

                    $t.trigger(this.element, 'refresh');
                }, this)
            });
        },
        
        destroy: function () {
            $(this.element).remove();
            if (this.modal) this.overlay(false).remove();
        }
    };

    $.extend($t.draganddrop, {
        windowMove: {
            shouldDrag: function ($element) {
                return !this.isMaximized && $element.closest('.t-window-action').length == 0;
            },

            onDragStart: function (e, $draggedElement) {

                this.initialWindowPosition = $(this.element).position();

                this.startPosition = {
                    left: e.pageX - this.initialWindowPosition.left,
                    top: e.pageY - this.initialWindowPosition.top
                };

                $('.t-resize-handle', this.element).hide();

                $('<div class="t-overlay" />').appendTo(this.element);

                $(document.body).css('cursor', $draggedElement.css('cursor'));
            },

            onDragMove: function (e) {
                var coordinates = {
                    left: e.pageX - this.startPosition.left,
                    top: Math.max(e.pageY - this.startPosition.top, 0)
                };

                //if ($t.trigger(this.element, 'move', coordinates)) return;

                $(this.element).css(coordinates);
            },

            onDragCancelled: function (e, $draggedElement) {
                $(this.element)
                    .find('.t-resize-handle').show().end()
                    .find('.t-overlay').remove();

                $(document.body).css('cursor', '');

                $draggedElement.closest('.t-window').css(this.initialWindowPosition);
            },

            onDrop: function (e, $draggedElement, $dragClue) {
                $(this.element)
                    .find('.t-resize-handle').show().end()
                    .find('.t-overlay').remove();

                $(document.body).css('cursor', '');

                return true;
            }
        },

        windowResize: {
            shouldDrag: function ($element) { return true; },

            onDragStart: function (e, $draggedElement) {

                var $element = $(this.element);

                this.initialCursorPosition = $element.offset();

                this.resizeDirection = $draggedElement[0].className.replace('t-resize-handle t-resize-', '').split('');

                this.resizeElement = $element.find('> .t-window-content');

                this.initialSize = {
                    width: this.resizeElement.width(),
                    height: this.resizeElement.height()
                };

                this.outlineSize = {
                    left: this.resizeElement.outerWidth() - this.resizeElement.width()
                        + $element.outerWidth() - $element.width(),
                    top: this.resizeElement.outerHeight() - this.resizeElement.height()
                        + $element.outerHeight() - $element.height()
                        + $element.find('> .t-window-titlebar').outerHeight()
                }

                $('<div class="t-overlay" />').appendTo(this.element);

                $element.find('.t-resize-handle').not($draggedElement).hide();

                $(document.body).css('cursor', $draggedElement.css('cursor'));
            },

            onDragMove: function (e, $draggedElement) {
                var $element = $(this.element);

                var resizeHandlers = {
                    'e': function () {
                        var width = e.pageX - this.initialCursorPosition.left - this.outlineSize.left;
                        this.resizeElement.width((width < this.minWidth
                                                  ? this.minWidth
                                                  : (this.maxWidth && width > this.maxWidth)
                                                  ? this.maxWidth
                                                  : width));
                    },
                    's': function () {
                        var height = e.pageY - this.initialCursorPosition.top - this.outlineSize.top;
                        this.resizeElement
                                .height((height < this.minHeight ? this.minHeight
                                      : (this.maxHeight && height > this.maxHeight) ? this.maxHeight
                                      : height));
                    },
                    'w': function () {
                        var windowRight = this.initialCursorPosition.left + this.initialSize.width;

                        $element.css('left', e.pageX > (windowRight - this.minWidth) ? windowRight - this.minWidth
                                           : e.pageX < (windowRight - this.maxWidth) ? windowRight - this.maxWidth
                                           : e.pageX);

                        var width = windowRight - e.pageX;
                        this.resizeElement.width((width < this.minWidth ? this.minWidth
                                               : (this.maxWidth && width > this.maxWidth) ? this.maxWidth
                                               : width));

                    },
                    'n': function () {
                        var windowBottom = this.initialCursorPosition.top + this.initialSize.height;

                        $element.css('top', e.pageY > (windowBottom - this.minHeight) ? windowBottom - this.minHeight
                                          : e.pageY < (windowBottom - this.maxHeight) ? windowBottom - this.maxHeight
                                          : e.pageY);

                        var height = windowBottom - e.pageY;
                        this.resizeElement
                                .height((height < this.minHeight ? this.minHeight
                                      : (this.maxHeight && height > this.maxHeight) ? this.maxHeight
                                      : height));
                    }
                };

                $.each(this.resizeDirection, $.proxy(function (i, direction) {
                    resizeHandlers[direction].call(this);
                }, this));
                
                fixIE6Sizing($element);

                $t.trigger(this.element, 'resize');
            },

            onDragCancelled: function (e, $draggedElement) {
                var $element = $(this.element);

                $element
                    .find('.t-overlay').remove().end()
                    .find('.t-resize-handle').not($draggedElement).show();
                    
                fixIE6Sizing($element);

                $(document.body).css('cursor', '');

                this.resizeElement.css(this.initialSize);
            },

            onDrop: function (e, $draggedElement, $dragClue) {
                $(this.element)
                    .find('.t-overlay').remove().end()
                    .find('.t-resize-handle').not($draggedElement).show();

                $(document.body).css('cursor', '');
                
                return true;
            }
        }
    });

    // client-side rendering
    $.extend($t.window, {
        create: function (element, options) {
            if (!element.nodeType) {
                options = element;
                element = null;
            } else {
                options.html = element.innerHTML;
            }

            options = $.extend({
                title: "",
                html: "",
                actions: ['Close']
            }, options);

            var windowHtml = new $t.stringBuilder()
                .catIf('<div class="t-widget t-window">', !element)
                    .cat('<div class="t-window-titlebar t-header">')
                        .cat('&nbsp;<span class="t-window-title">').cat(options.title).cat('</span>')
                        .cat('<div class="t-window-actions t-header">');

            $.map(options.actions, function (command) {
                windowHtml.cat('<a href="#" class="t-window-action t-link">')
                        .cat('<span class="t-icon t-').cat(command.toLowerCase()).cat('">')
                            .cat(command)
                        .cat('</span></a>');
            });

            windowHtml.cat('</div></div>')
                .cat('<div class="t-window-content t-content" style="');

            if (options.width) windowHtml.cat('width:').cat(options.width).cat('px;');
            if (options.height) windowHtml.cat('height:').cat(options.height).cat('px;');

            windowHtml.cat('">').cat(options.html).cat('</div>')
                .catIf('</div>', !element);

            if (element)
                $(element).html(windowHtml.string());
            else
                return $(windowHtml.string()).tWindow(options);
        },

        getResizeHandlesHtml: function () {
            var html = new $t.stringBuilder();

            $.each('n e s w se sw ne nw'.split(' '), function (i, item) {
                html.cat('<div class="t-resize-handle t-resize-').cat(item).cat('"></div>');
            });

            return html.string();
        }
    });

    // jQuery extender
    $.fn.tWindow = function (options) {
        return $t.create(this, {
            name: 'tWindow',
            init: function (element, options) {
                return new $t.window(element, options);
            },
            options: options
        });
    };

    // default options
    $.fn.tWindow.defaults = {
        effects: { list: [{ name: 'zoom' }, { name: 'property', properties: ['opacity']}], openDuration: 'fast', closeDuration: 'fast' },
        modal: false,
        resizable: true,
        draggable: true,
        minWidth: 50,
        minHeight: 50
    };
})(jQuery);