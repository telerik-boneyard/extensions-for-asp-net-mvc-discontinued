(function ($) {

    var $t = $.telerik;

    /*
    options = {
    offset: $component.offset(),
    outerHeight: $component.outerHeight(),
    outerWidth: $component.outerWidth()
    zIndex : $component's zindex,
    attr: component.dropDownAttr,
    effects: component.effects,
    //callbacks
    onOpen: function,
    onClose: function,
    onClick: function,
    onItemCreate: function
    }
    */

    var version = parseInt($.browser.version.substring(0,5).replace('.', ''));
    var geckoFlicker = $.browser.mozilla && version >= 180 && version <= 191;

    $t.dropDown = function (options) {

        $.extend(this, options);

        this.$element = $(new $t.stringBuilder().cat('<div ')
                             .catIf(options.attr, options.attr)
                             .cat(' class="t-popup t-group"><ul class="t-reset">')
                             .cat('</ul></div>')
                             .string()).hide();

        var element = this.$element[0];
        if (!element.style.width) element.style.width = (options.outerWidth ? options.outerWidth - 2 : 0) + 'px';
        if (!element.style.overflowY) element.style.overflowY = 'auto';

        function html(data) {
            var html = new $t.stringBuilder();
            if (data) {
                for (var i = 0, length = data.length; i < length; i++) {

                    var dataItem = data[i];

                    var e = {
                        html: dataItem.Text || dataItem,
                        dataItem: dataItem
                    };

                    if (this.onItemCreate) this.onItemCreate(e);

                    html.cat('<li class="t-item">').cat(e.html).cat('</li>');
                }
            }
            return html.string();
        }

        this.position = function (x, y) {
            this.offset = { top: x, left: y };
        }

        this.open = function () {
            if (this.isOpened() || (this.onOpen && !this.onOpen())) return;

            var $element = this.$element;
            var selector = '.t-reset > .t-item';

            $element.delegate(selector, 'mouseenter', $t.hover)
                    .delegate(selector, 'mouseleave', $t.leave)
                    .delegate(selector, 'click',
                        $.proxy(function (e) {
                            if (this.onClick) this.onClick($.extend(e, { item: $(e.target).closest('.t-item')[0] }));
                        }, this))
                     .appendTo(document.body);

            var elementPosition = this.offset;
            elementPosition.top += this.outerHeight;

            var zIndex = this.zIndex || 'auto';

            if ($.browser.msie && zIndex == 'auto')
                zIndex = '';

            $t.fx._wrap($element).css($.extend({
                position: 'absolute',
                zIndex: zIndex
            }, this.offset));
            
            if (geckoFlicker)
                $element.css('overflow', 'hidden');

            $t.fx.play(this.effects, $element, { direction: 'bottom' }, $.proxy(function () {
                if (geckoFlicker)
                    $element.css('overflow', 'auto');

                var $selectedItems = this.$items.filter('.t-state-selected')
                if ($selectedItems.length) this.scrollTo($selectedItems[0]);
            }, this));
        }

        this.close = function () {
            if (this.onClose && !this.onClose()) return;

            var $element = this.$element;
            
            if (geckoFlicker)
                $element.css('overflow', 'hidden');

            $t.fx.rewind(this.effects, $element, { direction: 'bottom' }, function () {
                if (geckoFlicker)
                    $element.css('overflow', 'auto')
                    
                $element.parent().remove();
            });
        }

        this.dataBind = function (data) {
            data = data || [];

            var $element = this.$element;
            var elementHeight = $element[0].style.height;
            var height = elementHeight && elementHeight != 'auto' ? $element[0].style.height : '200px';

            var $items = $(html.call(this, data));
            $element.find('> ul').html($items);
            $element.css('height', $items.length > 10 ? height : 'auto');

            this.$items = $items;
        }

        this.highlight = function (li) {
            return $(li).addClass('t-state-selected')
                        .siblings()
                        .removeClass('t-state-selected')
                        .end()
                        .index();
        }

        this.isOpened = function () {
            return this.$element.is(':visible');
        }

        this.scrollTo = function (item) {

            if (!item) return;

            var itemOffsetTop = item.offsetTop;
            var itemOffsetHeight = item.offsetHeight;

            var dropDown = this.$element[0];
            var dropDownScrollTop = dropDown.scrollTop;
            var dropDownOffsetHeight = dropDown.clientHeight;
            var bottomDistance = itemOffsetTop + itemOffsetHeight;

            dropDown.scrollTop = dropDownScrollTop > itemOffsetTop
                                 ? itemOffsetTop
                                 : bottomDistance > (dropDownScrollTop + dropDownOffsetHeight)
                                 ? bottomDistance - dropDownOffsetHeight
                                 : dropDownScrollTop;
        }
    }

    $t.list = {
        initialize: function () {
            this.$input = this.$element.find('input:last');

            this.previousValue = this.value();

            $t.bind(this, {
                dataBinding: this.onDataBinding,
                dataBound: this.onDataBound,
                error: this.onError,
                open: this.onOpen,
                close: this.onClose,
                valueChange: this.onChange,
                load: this.onLoad
            });

            $(document).bind('mousedown', $.proxy(function (e) {
                var $dropDown = this.dropDown.$element;
                var isDropDown = $dropDown && $dropDown.parent().length > 0;

                if (isDropDown && !$.contains(this.element, e.target) && !$.contains($dropDown.parent()[0], e.target)) {
                    this.trigger.change();
                    this.trigger.close();
                }

            }, this));
        },

        common: function () {
            this.open = function () {
                if (this.data.length == 0) return;

                var dropDown = this.dropDown;

                if (dropDown.$items) dropDown.open();
                else this.fill(function () { dropDown.open(); });
            }

            this.close = function () {
                this.dropDown.close();
            }

            this.dataBind = function (data) {
                this.data = data || [];
                this.dropDown.dataBind(this.data);
            }

            this.highlight = function (argument) {

                var index = -1;

                var rebind = function (component) {
                    var previousValue = component.previousValue;
                    component.close();
                    component.dataBind(component.data);
                    component.previousValue = previousValue;
                    component.dropDown
                             .$items
                             .removeClass('t-state-selected')
                             .eq(index)
                             .addClass('t-state-selected');
                }

                if (!isNaN(argument - 0)) { // index
                    if (argument > -1 && argument < this.data.length) {

                        index = argument;

                        rebind(this);
                    }

                } else if ($.isFunction(argument)) { // predicate

                    for (var i = 0, len = this.data.length; i < len; i++) {
                        if (argument(this.data[i])) {
                            index = i;
                            break;
                        }
                    }

                    if (index != -1)
                        rebind(this);

                } else { // dom node
                    index = this.dropDown.highlight(argument);
                }

                return index;
            }
        },

        filtering: function () {
            this.filter = function (component) {

                component.isFiltered = true;

                var performAjax = true;
                var data = component.data;
                var input = component.$text[0];
                var text = input.value;
                var trigger = component.trigger;
                var dropDown = component.dropDown;

                text = this.multiple(text);

                if (text.length < component.minChars) return;

                var filterIndex = component.filter;
                if (component.loader.isAjax()) {

                    if (component.cache && data && data.length > 0) {

                        component.filters[filterIndex](component, data, text);

                        var filteredDataIndexes = component.filteredDataIndexes;

                        if ((filteredDataIndexes && filteredDataIndexes.length > 0)
                        || (filterIndex == 0 && component.selectedIndex != -1))
                            performAjax = false;
                    }

                    if (performAjax) {

                        var postData = {};
                        postData[component.queryString.text] = text;

                        component.loader.ajaxRequest(function (data) {
                            var trigger = component.trigger;
                            var dropDown = component.dropDown;

                            if (data && data.length == 0) {
                                component.close();
                                component.dataBind();
                                return;
                            }

                            component.data = data;

                            $t.trigger(component.element, 'dataBound');

                            component.filters[filterIndex](component, data, text);

                            var $items = dropDown.$items;
                            if ($items.length > 0) {
                                if (!dropDown.isOpened()) trigger.open();
                                component.filtering.autoFill(component, $items.first().text());
                            }
                            else trigger.close();

                        }, { data: postData });
                    }
                } else {
                    performAjax = false;
                    component.filters[filterIndex](component, component.data, text);
                }

                if (!performAjax) {
                    var $items = dropDown.$items;
                    var itemsLength = $items.length;
                    var selectedIndex = component.selectedIndex;

                    var itemText = filterIndex == 0
                    ? selectedIndex != -1
                    ? $items[selectedIndex].innerText || $items[selectedIndex].textContent
                    : ''
                    : $items.length > 0
                    ? $items.first().text()
                    : '';

                    this.autoFill(component, itemText);

                    if (itemsLength == 0)
                        trigger.close();
                    else {
                        if (!dropDown.isOpened())
                            trigger.open();
                    }
                }
            }

            this.multiple = function (text) { return text; } // overriden by autocomplete
        },

        filters: function () { //mixin
            this.filters = [
                function firstMatch(component, data, inputText) {
                    if (!data || data.length == 0) return;
                    var dropDown = component.dropDown;
                    var $items = dropDown.$items;

                    if ($items.length == 0 || component.loader.isAjax()) {
                        dropDown.dataBind(data);
                        $items = dropDown.$items;
                    }

                    for (var i = 0, length = data.length; i < length; i++) {
                        if (data[i].Text.slice(0, inputText.length).toLowerCase() == inputText.toLowerCase()) {
                            var item = $items[i];

                            component.selectedIndex = i;
                            dropDown.highlight(item);
                            dropDown.scrollTo(item);
                            return;
                        }
                    }

                    $items.removeClass('t-state-selected');
                    component.selectedIndex = -1;

                    $t.list.highlightFirstOnFilter(component, $items);
                },

                createItemsFilter(false, function (inputText, itemText) {
                    return itemText.slice(0, inputText.length).toLowerCase() == inputText.toLowerCase();
                }),

                createItemsFilter(true, function (inputText, itemText) {
                    return itemText && itemText.toLowerCase().indexOf(inputText.toLowerCase()) != -1
                })
            ]
        },

        loader: function (component) {
            this.ajaxError = false;
            this.component = component;

            this.isAjax = function () {
                return component.ajax || component.ws || component.onDataBinding;
            }

            function ajaxOptions(complete, options) {
                var result = {
                    url: (component.ajax || component.ws)['selectUrl'],
                    type: 'POST',
                    data: {},
                    dataType: 'text', // using 'text' instead of 'json' because of DateTime serialization
                    error: function (xhr, status) {
                        component.loader.ajaxError = true;
                        if ($t.ajaxError(component.element, 'error', xhr, status))
                            return;
                    },
                    complete: $.proxy(function () { this.hideBusy(); }, component.loader),

                    success: function (data, status, xhr) {
                        try {
                            data = eval('(' + data + ')');
                        } catch (e) {
                            // in case the result is not JSON raise the 'error' event
                            if (!$t.ajaxError(component.element, 'error', xhr, 'parseeror'))
                                alert('Error! The requested URL did not return JSON.');
                            component.loader.ajaxError = true;
                            return;
                        }
                        data = data.d || data; // Support the `d` returned by MS Web Services 

                        if (complete)
                            complete.call(component, data);

                    }
                }

                $.extend(result, options);

                if (component.ws) {
                    result.data = $t.toJson(result.data);
                    result.contentType = 'application/json; charset=utf-8';
                }

                return result;
            }

            this.ajaxRequest = function (complete, options) {
                var e = {};

                if ($t.trigger(component.element, 'dataBinding', e))
                    return;

                if (component.ajax || component.ws) {
                    this.showBusy();
                    $.ajax(ajaxOptions(complete, { data: $.extend({}, options ? options.data : {}, e.data) }));
                }
                else
                    if (complete) complete.call(component, component.data);
            },

            this.showBusy = function () {
                this.busyTimeout = setTimeout($.proxy(function () {
                    this.component.$element.find('> .t-dropdown-wrap .t-icon').addClass('t-loading');
                }, this), 100);
            },

            this.hideBusy = function () {
                clearTimeout(this.busyTimeout);
                this.component.$element.find('> .t-dropdown-wrap .t-icon').removeClass('t-loading');
            }
        },

        trigger: function (component) {
            this.component = component;
            this.change = function () {
                var data = component.data;
                var text = component.text();
                var lowerText = text.toLowerCase();
                var previousValue = component.previousValue;

                //find if text has exact match with one of data items.
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    if ((item.Text ? item.Text : item).toLowerCase() == lowerText) {
                        component.text(item.Text);
                        component.$input.val(data[i].Value);
                        break;
                    }
                }

                var value = component.value();
                if (previousValue == undefined || value != previousValue)
                    $t.trigger(component.element, 'valueChange', { value: value });

                component.previousValue = value;
            }

            this.open = function () {
                var dropDown = component.dropDown;
                if ((dropDown.$items && dropDown.$items.length > 0) && !dropDown.isOpened() && !$t.trigger(component.element, 'open'))
                    component.open();
            }

            this.close = function () {
                if (!component.dropDown.$element.is(':animated') && component.dropDown.isOpened() && !$t.trigger(component.element, 'close'))
                    component.close();
            }
        },

        highlightFirstOnFilter: function (component, $items) {
            if (component.highlightFirst) {
                $items.first().addClass('t-state-selected');
                component.dropDown.scrollTo($items[0]);
            }
        },

        moveToEnd: function (element) {
            if (element.createTextRange) {
                var range = element.createTextRange();
                range.moveStart('textedit', 1);
                range.select();
            }
        },

        selection: function (input, start, end) {
            if (input.createTextRange) {
                var selRange = input.createTextRange();
                selRange.collapse(true);
                selRange.moveStart('character', start);
                selRange.moveEnd('character', end - start);
                selRange.select();
            } else if (input.selectionStart) {
                input.selectionStart = start;
                input.selectionEnd = end;
            }
        },

        updateTextAndValue: function (component, text, value) {
            component.text(text);

            if (value || value == 0)
                component.$input.val(value);
            else
                component.$input.val(text);
        },

        getZIndex: function (element) {
            var zIndex = 'auto';
            $(element).parents().andSelf().each(function () { //get element 
                zIndex = $(this).css('zIndex');
                if (Number(zIndex)) {
                    zIndex = Number(zIndex) + 1;
                    return false;
                }
            });
            return zIndex;
        },

        keycodes: [8, // backspace
                   9, // tab
                  13, // enter
                  27, // escape
                  37, // left arrow
                  38, // up arrow
                  39, // right arrow
                  40, // down arrow
                  35, // end
                  36, // home
                  46] // delete
    }

    function createItemsFilter(global, condition) {
        return function (component, data, inputText) {

            if (!data || data.length == 0) return;

            var filteredDataIndexes = $.map(data, function (item, index) {
                if (condition(inputText, item.Text || item)) return index;
            });

            var filteredDataIndexesLength = filteredDataIndexes.length;
            var formatRegExp = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + inputText.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", global ? 'ig' : 'i');

            component.filteredDataIndexes = filteredDataIndexes;
            component.selectedIndex = -1;

            component.dropDown.onItemCreate = function (e) { e.html = e.html.replace(formatRegExp, "<strong>$1</strong>"); }
            component.dropDown.dataBind($.map(filteredDataIndexes, function (item, index) {
                return data[item];
            }));

            var $items = component.dropDown.$items;
            $items.removeClass('t-state-selected');
            $t.list.highlightFirstOnFilter(component, $items);
        };
    }

    function firstMatch(data, $items, text) {
        if (!data || !$items) return null;

        var valueLength = text.length;
        text = text.toLowerCase();

        for (var i = 0, length = data.length; i < length; i++) {
            if (data[i].Text.slice(0, valueLength).toLowerCase() == text)
                return $items[i];
        }
    }

    $t.dropDownList = function (element, options) {
        $.extend(this, options);

        var cachedInput = '';
        var $element = $(element);

        //allow element to be focused
        if (!$element.attr('tabIndex')) $element.attr('tabIndex', 0);

        this.element = element;
        this.$element = $element;
        this.loader = new $t.list.loader(this);
        this.trigger = new $t.list.trigger(this);
        this.$text = $element.find('> .t-dropdown-wrap > .t-input');

        this.dropDown = new $t.dropDown({
            outerHeight: $element.outerHeight(),
            outerWidth: $element.outerWidth(),
            zIndex: $t.list.getZIndex($element),
            attr: this.dropDownAttr,
            effects: this.effects,
            onOpen: $.proxy(function () {
                var dropDown = this.dropDown;
                var offset = $element.offset();

                dropDown.position(offset.top, offset.left);
                if (!dropDown.outerHeight) dropDown.outerHeight = $element.outerHeight();
                if (!dropDown.outerWidth) {
                    dropDown.outerWidth = $element.outerWidth();
                    dropDown.$element.css('width', dropDown.outerWidth - 2);
                }
                return true;
            }, this),
            onClick: $.proxy(function (e) {
                this.select(e.item);
                this.trigger.change();
                this.trigger.close();
            }, this)
        });

        this.fill = function (callback) {
            function updateSelectedItem(component) {
                var $items = component.dropDown.$items;
                var selectedIndex = component.index;
                var $selectedItems = $items.filter('.t-state-selected')
                var selectedItemsLength = $selectedItems.length;

                var item = selectedIndex != -1 && selectedIndex < $items.length
                        ? $items[selectedIndex]
                        : selectedItemsLength > 0
                        ? $selectedItems[selectedItemsLength - 1]
                        : $items[0];

                component.select(item);
            }

            var dropDown = this.dropDown;
            var loader = this.loader;

            if (!dropDown.$items && !loader.ajaxError) {
                if (loader.isAjax()) {
                    loader.ajaxRequest(function (data) {
                        this.data = data;

                        dropDown.dataBind(data);
                        updateSelectedItem(this);

                        $t.trigger(this.element, 'dataBound');
                        this.trigger.change();

                        if (callback) callback();
                    });
                }
                else {
                    dropDown.dataBind(this.data);
                    updateSelectedItem(this);

                    if (callback) callback();
                }
            }
        }

        this.reload = function () {
            this.dropDown.$items = null;
            this.fill();
        }

        this.select = function (item) {
            var index = this.highlight(item);

            if (index == -1) return index;

            this.selectedIndex = index;

            $t.list.updateTextAndValue(this, $(this.dropDown.$items[index]).text(), this.data[index].Value);
        },

        this.text = function (text) {
            return this.$text.html(text);
        }

        this.value = function (value) {
            if (arguments.length) {

                var value = arguments[0];
                var index = this.select(function (dataItem) {
                    return value == dataItem.Value;
                });

                if (index != -1)
                    this.previousValue = value; //prevent change event

            } else {
                return this.$input.val();
            }
        }

        $t.list.common.call(this);
        $t.list.initialize.call(this);

        $element
            .bind({
                keydown: $.proxy(keydown, this),
                keypress: $.proxy(keypress, this),
                click: $.proxy(function (e) {
                    var trigger = this.trigger;
                    var dropDown = this.dropDown;

                    $element.focus();

                    if (dropDown.isOpened())
                        trigger.close();
                    else if (!dropDown.$items)
                        this.fill(trigger.open);
                    else
                        trigger.open();
                }, this)
            });

        // PRIVATE methods
        function resetTimer() {
            clearTimeout(this.timeout);
            this.timeout = setTimeout($.proxy(function () { cachedInput = '' }, this), 1000);
        }

        function keydown(e) {

            var trigger = this.trigger;
            var dropDown = this.dropDown;
            var key = e.keyCode || e.which;

            // close dropdown
            if (e.altKey && key == 38) {
                trigger.close();
                return;
            }

            // open dropdown
            if (e.altKey && key == 40) {
                trigger.open();
                return;
            }

            if (key > 34 && key < 41) {

                e.preventDefault();

                if (!dropDown.$items) {
                    this.fill();
                    return;
                }

                var $items = dropDown.$items;
                var $selectedItem = $($items[this.selectedIndex]);

                var $item = (key == 35) ? $items.last() // end
                         : (key == 36) ? $items.first() // home
                         : (key == 37 || key == 38) ? $selectedItem.prev() // up
                         : (key == 39 || key == 40) ? $selectedItem.next() // down
                         : [];

                if ($item.length) {
                    var item = $item[0];

                    this.select(item);
                    dropDown.scrollTo(item);

                    if (!dropDown.isOpened())
                        trigger.change();
                }
            }

            if (key == 8) {
                resetTimer();
                e.preventDefault();
                cachedInput = cachedInput.slice(0, -1);
            }

            if (key == 9 || key == 13 || key == 27) {
                trigger.change();
                trigger.close();
            }
        }

        function keypress(e) {
            var dropDown = this.dropDown;
            var key = e.keyCode || e.charCode;

            if (key == 0 || $.inArray(key, $t.list.keycodes) != -1 || e.ctrlKey || e.altKey || e.shiftKey) return;

            if (!dropDown.$items) {
                this.fill();
                return;
            }

            var tempInputValue = cachedInput;

            tempInputValue += String.fromCharCode(key);

            if (tempInputValue) {

                var item = firstMatch(this.data, dropDown.$items, tempInputValue);

                if (item) {
                    this.select(item);
                    dropDown.scrollTo(item);
                }

                cachedInput = tempInputValue;
            }

            resetTimer();
        }
    }

    $.fn.tDropDownList = function (options) {
        return $t.create(this, {
            name: 'tDropDownList',
            init: function (element, options) {
                return new $t.dropDownList(element, options)
            },
            options: options
        });
    };

    // default options
    $.fn.tDropDownList.defaults = {
        effects: $t.fx.slide.defaults(),
        index: 0
    };

})(jQuery);