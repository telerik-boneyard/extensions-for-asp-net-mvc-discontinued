(function ($) {

    var $t = $.telerik;

    $t.autocomplete = function (element, options) {
        $.extend(this, options);

        var $element = $(element);

        this.$text = $element;
        this.element = element;
        this.$element = $element;
        this.trigger = new $t.list.trigger(this);
        this.trigger.change = function () {
            var text = this.component.text();
            var previousValue = this.component.previousValue;

            if (previousValue == undefined || text != previousValue)
                $t.trigger(this.component.element, 'valueChange', { value: text });

            this.component.previousValue = text;
        }

        this.loader = new $t.list.loader(this);
        this.loader.showBusy = function () {
            this.busyTimeout = setTimeout($.proxy(function () {
                this.component.$element.addClass('t-loading');
            }, this), 100);
        }
        this.loader.hideBusy = function () {
            clearTimeout(this.busyTimeout);
            this.component.$element.removeClass('t-loading');
        }

        this.filtering = new $t.list.filtering(this);
        this.filtering.autoFill = function (component, itemText) {
            if (component.autoFill && (component.lastKeyCode != 8 && component.lastKeyCode != 46)) {

                var input = component.$text[0];
                var textBoxValue = input.value;
                var separator = component.separator;

                var endIndex = $t.caretPos(input);

                var lastSeparatorIndex = separator ? $t.lastIndexOf(textBoxValue.substring(0, endIndex), separator) : -1;

                var startIndex = lastSeparatorIndex != -1 ? lastSeparatorIndex + separator.length : 0;

                var filterString = textBoxValue.substring(startIndex, endIndex);

                var matchIndex = itemText.toLowerCase().indexOf(filterString.toLowerCase());

                if (matchIndex != -1) {

                    var stringToAppend = itemText.substring(matchIndex + filterString.length);
                    var wordIndex = valueArrayIndex(input, separator);
                    var split = textBoxValue.split(separator);
                    split[wordIndex] = filterString + stringToAppend;
                    input.value = split.join(separator) + (component.multiple && wordIndex != 0 && wordIndex == split.length - 1 ? separator : '');

                    $t.list.selection(input, endIndex, endIndex + stringToAppend.length);
                }
            }
        }
        this.filtering.multiple = $.proxy(function (text) {
            if (this.multiple) {
                text = text.split(this.separator);
                text = text[valueArrayIndex(this.$text[0], this.separator)];
            }
            return text;
        }, this);

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
            function highlightItem(component) {
                var $item = component.highlightFirst ? dropDown.$items.first() : null;
                if ($item) $item.addClass('t-state-selected');
            }

            var loader = this.loader;
            var dropDown = this.dropDown;
            var minChars = this.minChars;
            var textValue = this.text();
            var textValueLength = textValue.length;

            if (!dropDown.$items && !loader.ajaxError) {
                if (loader.isAjax() && textValueLength >= minChars) {

                    var postData = {};
                    postData[this.queryString.text] = textValue;

                    loader.ajaxRequest(function (data) {
                        this.data = data;
                        dropDown.dataBind(data);
                        highlightItem(this);
                        $t.trigger(this.element, 'dataBound');
                        if (callback) callback();
                    },
                    { data: postData });
                }
                else {
                    dropDown.dataBind(this.data);
                    highlightItem(this);
                    if (callback) callback();
                }
            }
        }

        this.text = function (text) {
            return this.$text.val(text);
        }

        this.value = function () {
            return this.text.apply(this, arguments);
        }

        this.select = function (item) {

            var index = this.highlight(item);

            if (index == -1) return index;

            var filteredDataIndexes = this.filteredDataIndexes;
            var itemIndex = (filteredDataIndexes && filteredDataIndexes.length) > 0 ? filteredDataIndexes[index] : index;

            var item = this.data[itemIndex];
            var dataText = item.Text ? item.Text : item;
            var value = dataText;

            if (this.multiple) {

                var $element = this.$element
                var separator = this.separator;
                var wordIndex = valueArrayIndex($element[0], separator);

                value = $element.val().split(separator);
                value[wordIndex] = dataText;
                value = value.join(separator) + (wordIndex == value.length - 1 ? separator : '');
            }

            this.text(value);
        }

        this.previousValue = this.value();

        $t.list.common.call(this);
        $t.list.filters.call(this);

        $t.bind(this, {
            dataBinding: this.onDataBinding,
            dataBound: this.onDataBound,
            error: this.onError,
            open: this.onOpen,
            close: this.onClose,
            valueChange: this.onChange,
            load: this.onLoad
        });

        $element
            .bind({
                focus: $.proxy(function (e) { e.stopPropagation(); }, this),
                keydown: $.proxy(keydown, this),
                keypress: $.proxy(function (e) {
                    var key = e.keyCode || e.charCode;

                    if (key == 0 || $.inArray(key, $t.list.keycodes) != -1) return true;

                    resetTimer(this); //reset and start filtering after delay

                }, this)
            });

        $(document).bind('mousedown', $.proxy(function (e) {
            var $parent = this.dropDown.$element.parent();

            if (($parent.length > 0) && !$.contains(element, e.target) && !$.contains($parent[0], e.target)) {
                this.trigger.change();
                this.trigger.close();
            }
        }, this));

        //PRIVATE
        function valueArrayIndex(input, separator) {
            return input.value.substring(0, $t.caretPos(input)).split(separator).length - 1;
        }

        function resetTimer(component) {
            clearTimeout(component.timeout);
            component.timeout = setTimeout(function () { component.filtering.filter(component) }, component.delay);
        }

        function keydown(e) {
            var trigger = this.trigger;
            var dropDown = this.dropDown;
            var key = e.keyCode || e.which;
            this.lastKeyCode = key;

            if (!e.shiftKey && key > 36 && key < 41 && key != 37 && key != 39) {

                e.preventDefault();

                if (dropDown.isOpened()) {

                    if (!dropDown.$items) this.fill();

                    var $items = dropDown.$items;

                    var $selectedItem = $items.filter('.t-state-selected:first');

                    var $item = [];

                    if (key == 38) {
                        var prevItem = $selectedItem.prev();
                        $item = prevItem.length ? prevItem : $items.last();
                    } else if (key == 40) {
                        var nextItem = $selectedItem.next();
                        $item = nextItem.length ? nextItem : $items.first();
                    }

                    if ($item.length) {
                        var item = $item[0];

                        this.highlight(item);
                        dropDown.scrollTo(item);

                        this.filtering.autoFill(this, $item.text());
                    }
                }
            }

            if (key == 8 || key == 46) {
                var $element = this.$element;

                if ($element.val() != '') resetTimer(this); //reset and start filtering after delay

                setTimeout($.proxy(function () {
                    if ($element.val() == '') {
                        trigger.close();
                    }
                }, this), 0);
            }

            if (key == 13) { //move caret to the end of the input
                if (dropDown.$items.length) {
                    var $selectedItems = dropDown.$items.filter('.t-state-selected:first');

                    if (dropDown.isOpened()) e.preventDefault();

                    if ($selectedItems.length > 0) {
                        this.select($selectedItems[0]);
                        trigger.change();
                        trigger.close();
                        $t.list.moveToEnd(this.element);
                    }
                }
            }

            if (key == 27 || key == 9) {
                trigger.change();
                trigger.close();
            }
        }
    }

    // jQuery extender
    $.fn.tAutoComplete = function (options) {
        return $t.create(this, {
            name: 'tAutoComplete',
            init: function (element, options) {
                return new $t.autocomplete(element, options)
            },
            options: options
        });
    };

    // default options
    $.fn.tAutoComplete.defaults = {
        effects: $t.fx.slide.defaults(),
        filter: 1,
        delay: 200,
        minChars: 1,
        cache: true,
        autoFill: false,
        highlightFirst: false,
        queryString: {
            text: 'text'
        },
        multiple: false,
        separator: ', '
    };
})(jQuery);