/* select box */

$t.selectbox = function (element, options) {
    var selectedValue;
    var $element = $(element);
    var $text = $element.find('.t-input');

    var dropdown = new $t.dropDown({
        outerHeight: $element.outerHeight(),
        outerWidth: $element.outerWidth(),
        zIndex: $t.list.getZIndex($element),
        effects: $t.fx.slide.defaults(),
        onOpen: function () {
            var offset = $element.offset();
            dropdown.position(offset.top, offset.left);
            return true;
        },
        onItemCreate: options.onItemCreate,
        onClick: function (e) {
            select(options.data[$(e.item).index()].Value);
            options.onChange({ value: selectedValue })
        }
    });

    function fill() {
        if (!dropdown.$items)
            dropdown.dataBind(options.data);
    }

    function text(value) {
        $text.html(value);
    }

    function select(item) {
        fill();
        var index = -1;

        for (var i = 0, len = options.data.length; i < len; i++) {
            if (options.data[i].Value == item) {
                index = i;
                break;
            }
        }

        if (index != -1) {

            dropdown.$items
                    .removeClass('t-state-selected')
                    .eq(index).addClass('t-state-selected');

            text($(dropdown.$items[index]).text());
            selectedValue = options.data[index].Value;
        }
    }

    this.value = function (value) {
        select(value);

        if (selectedValue != value)
            text(options.title);
    }

    this.close = function () {
        dropdown.close();
    }

    text(options.title);

    $element
        .bind({
            click: function (e) {
                fill();
                if (dropdown.isOpened())
                    dropdown.close();
                else
                    dropdown.open();
            }
        });

    $(document).bind('mousedown', $.proxy(function (e) {
        var $dropDown = dropdown.$element;
        var isDropDown = $dropDown && $dropDown.parent().length > 0;

        if (isDropDown && !$.contains(element, e.target) && !$.contains($dropDown.parent()[0], e.target)) {
            dropdown.close();
        }

    }, this));
}

$.fn.tSelectBox = function (options) {
    return $t.create(this, {
        name: 'tSelectBox',
        init: function (element, options) {
            return new $t.selectbox(element, options)
        },
        options: options
    });
};

$.fn.tSelectBox.defaults = {
    effects: $.fn.tDropDownList.defaults.effects
};

/* color picker */

$t.colorpicker = function (element, options) {
    this.element = element;
    var $element = $(element);

    $.extend(this, options);

    $element.bind('click', $.proxy(this.click, this))
    
    if (this.selectedColor)
        $element.find('.t-selected-color').css('background-color', this.selectedColor);

    $(element.ownerDocument).bind('mousedown', $.proxy(function (e) {
        if (!$(e.target).closest('.t-colorpicker-popup').length)
            this.close();
    }, this));

    $t.bind(this, {
        change: this.onChange,
        load: this.onLoad
    });
}

$t.colorpicker.prototype = {
    select: function(color) {
        if (color) {
            color = dom.toHex(color);
            if (!$t.trigger(this.element, 'change', { value: color })) {
                this.value(color);
                this.close();
            }
        } else
            $t.trigger(this.element, 'change', { value: this.selectedColor })
    },

    open: function() {
        var $popup = this.popup();
        var $element = $(this.element);

        var elementPosition = $element.offset();
        elementPosition.top += $element.outerHeight();

        var zIndex = 'auto';

        $element.parents().andSelf().each(function () {
            zIndex = $(this).css('zIndex');
            if (Number(zIndex)) {
                zIndex = Number(zIndex) + 1;
                return false;
            }
        });

        $t.fx._wrap($popup).css($.extend({
            position: 'absolute',
            zIndex: zIndex
        }, elementPosition));
        
        $popup
            .find('.t-item').bind('click', $.proxy(function(e) {
                var color = $(e.target, e.target.ownerDocument).css('background-color');
                this.select(color);
            }, this));

        // animate
        $t.fx.play(this.effects, $popup, { direction: 'bottom' });
    },

    close: function() {
        if (!this.$popup) return;

        $t.fx.rewind(this.effects, this.$popup, { direction: 'bottom' }, $.proxy(function() {
            dom.remove(this.$popup[0].parentNode);
            this.$popup = null;
        }, this));
    },

    toggle: function() {
        if (!this.$popup || !this.$popup.is(':visible'))
            this.open();
        else
            this.close();
    },

    click: function(e) {
        if ($(e.target).closest('.t-tool-icon').length > 0)
            this.select();
        else
            this.toggle();
    },

    value: function(color) {
        if (!color)
            return this.selectedColor;

        color = dom.toHex(color);

        this.selectedColor = color;

        $('.t-selected-color', this.element)
            .css('background-color', color);
    },

    popup: function() {
        if (!this.$popup)
            this.$popup =
                $($t.colorpicker.buildPopup(this))
                    .hide()
                    .appendTo(document.body);

        return this.$popup;
    }
}

$.extend($t.colorpicker, {
    buildPopup: function(component) {
        var html = new $t.stringBuilder();

        html.cat('<div class="t-popup t-group t-colorpicker-popup">')
            .cat('<ul class="t-reset">');

        var data = component.data;
        var currentColor = (component.value() || '').substring(1);

        for (var i = 0, len = data.length; i < len; i++) {
            html.cat('<li class="t-item')
                .catIf(' t-selected', data[i] == currentColor)
                .cat('" style="background-color:#')
                .cat(data[i])
                .cat('"></li>');
        }

        html.cat('</ul></div>');

        return html.string();
    }
});

$.fn.tColorPicker = function (options) {
    return $t.create(this, {
        name: 'tColorPicker',
        init: function (element, options) {
            return new $t.colorpicker(element, options)
        },
        options: options
    });
};

$.fn.tColorPicker.defaults = {
    data: '000000,7f7f7f,880015,ed1c24,ff7f27,fff200,22b14c,00a2e8,3f48cc,a349a4,ffffff,c3c3c3,b97a57,ffaec9,ffc90e,efe4b0,b5e61d,99d9ea,7092be,c8bfe7'.split(','),
    selectedColor: null,
    effects: $.fn.tDropDownList.defaults.effects
};