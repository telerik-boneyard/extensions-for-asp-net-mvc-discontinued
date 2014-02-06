(function ($) {

    var $t = $.telerik;

    var decimals = { '190': '.', '110': '.', '188': ',' };
    var keycodes = [8, // backspace
                    9, // tab
                    37, // left arrow
                    38, // up arrow
                    39, // right arrow
                    40, // down arrow
                    46, // delete
                    35, // end
                    36, // home
                    44]; //","

    $t.textbox = function (element, options) {
        this.element = element;

        $.extend(this, options);
        
        var builder = new $t.stringBuilder();
        builder.cat('[ |')
               .cat(this.groupSeparator)
               .catIf('|' + this.symbol, this.symbol)
               .cat(']');
        this.replaceRegExp = new RegExp(builder.string(), 'g');

        var pasteMethod = $.browser.msie ? 'paste' : 'input';

        var input = $('.t-input', element);
        var inputValue = input.attr('value');

        $('<input>', {
            id: input.attr('id') + "-text",
            name: input.attr('name') + "-text",
            'class': input.attr('class'),
            value: (inputValue || this.text),
            style: input.attr('style')
        })
        .bind({
            blur: $t.delegate(this, this.blur),
            focus: $t.delegate(this, this.focus),
            keydown: $t.delegate(this, this.keydown),
            keypress: $t.delegate(this, this.keypress),
            change: function (e) { e.stopPropagation(); return false; }
        })
        .bind(pasteMethod, $t.delegate(this, this[pasteMethod]))
        .insertBefore(input);

        input.hide().appendTo(element);

        var buttons = $('.t-arrow-up, .t-arrow-down', element)
                        .bind({
                            mouseup: $t.delegate(this, this.clearTimer),
                            mouseout: $t.delegate(this, this.clearTimer),
                            click: $t.preventDefault,
                            dragstart: $t.preventDefault,
                            dblclick: $t.delegate(this, this.clearTimer)
                        });

        $(buttons[0]).mousedown($.proxy(function (e) {
            this.updateState();
            this.stepper(e, 1);
        }, this));

        $(buttons[1]).mousedown($.proxy(function (e) {
            this.updateState();
            this.stepper(e, -1);
        }, this));

        this.numFormat = this.numFormat === undefined ? this.type.charAt(0) : this.numFormat;
        var separator = this.separator;
        this.step = this.parse(this.step, separator);
        this.val = this.parse(this.val, separator);
        this.minValue = this.parse(this.minValue, separator);
        this.maxValue = this.parse(this.maxValue, separator);

        if (inputValue != '') //format the input value if it exists.
            this.value(inputValue);

        $t.bind(this, {
            change: this.onChange,
            load: this.onLoad
        });
    }

    $t.textbox.prototype = {
        enable: function () {
            $('.t-input:first', this.element).first().attr('disabled', false);

            var buttons = $('.t-icon', this.element)

            $(buttons[0]).mousedown($.proxy(function (e) {
                this.updateState();
                this.stepper(e, 1);
            }, this));

            $(buttons[1]).mousedown($.proxy(function (e) {
                this.updateState();
                this.stepper(e, -1);
            }, this));
        },

        disable: function () {
            $('.t-input:first', this.element).first().attr('disabled', true);
            $('.t-icon', this.element).unbind('mousedown');
        },

        updateState: function () {
            var value = $('> .t-input:first', this.element).val();
            if (this.val != value.replace(this.replaceRegExp, ''))
                this.parseTrigger(value)
        },
        input: function (e, element) {

            var val = $(element).val();

            if (val == '-') return true;

            var parsedValue = this.parse(val, this.separator);

            if (parsedValue || parsedValue == 0)
                this.trigger(this.round(parsedValue, this.digits));
        },

        paste: function (e, element) {

            var $input = $(element);
            var val = $input.val();

            var selectedText = element.document.selection.createRange().text;
            var text = window.clipboardData.getData("Text");

            if (selectedText > 0) val = val.replace(selectedText, text);
            else val += text;


            var parsedValue = this.parse(val, this.separator);
            if (parsedValue || parsedValue == 0)
                this.trigger(this.round(parsedValue, this.digits));
        },

        focus: function (e, element) {
            this.focused = true;
            this.updateState();

            var value = this.formatEdit(this.val);
            $(element).val(value || (value == 0 ? 0 : ''));

            if (!$.browser.safari) element.select();
        },

        blur: function (e) {
            var $input = $(e.target);

            this.focused = false;
            var inputValue = $input.val();
            if (!inputValue && inputValue != '0' || !this.val && this.val != 0) {
                this.value(null);
                $input.removeClass('t-state-error')
                      .val(this.text || '');
                return true;
            } else {
                if (this.inRange(this.val, this.minValue, this.maxValue)) {
                    $input.removeClass('t-state-error')
                          .val(this.format(this.val));
                }
                else {
                    $input.addClass('t-state-error');
                }
            }
        },

        keydown: function (e, element) {
            var key = e.keyCode;
            var $input = $(element);
            var separator = this.separator;

            // Allow decimal
            var decimalSeparator = decimals[key];
            if (decimalSeparator) {
                if (decimalSeparator == separator && this.digits > 0
                    && $t.caretPos($input[0]) != 0 && $input.val().indexOf(separator) == -1) {
                    return true;
                } else {
                    e.preventDefault();
                }
            }

            if (key == 8 || key == 46) { //backspace and delete
                setTimeout($t.delegate(this, function () {
                    this.parseTrigger($input.val())
                }));
                return true;
            }

            if (key == 38 || key == 40) {
                this.modifyInput($input, this.step * (key == 38 ? 1 : -1));
                return true;
            }

            if (key == 222) e.preventDefault();
        },

        keypress: function (e) {
            var $input = $(e.target);
            var key = e.keyCode || e.which;

            if (key == 0 || $.inArray(key, keycodes) != -1 || e.ctrlKey || (e.shiftKey && key == 45)) return true;

            if (((this.minValue !== null ? this.minValue < 0 : true) && String.fromCharCode(key) == "-"
                && $t.caretPos($input[0]) == 0 && $input.val().indexOf("-") == -1)
                || this.inRange(key, 48, 57)) {
                setTimeout($t.delegate(this, function () {
                    this.parseTrigger($input.val());
                }));
                return true;
            }

            e.preventDefault();
        },

        clearTimer: function (e) {
            clearTimeout(this.timeout);
            clearInterval(this.timer);
            clearInterval(this.acceleration);
        },

        stepper: function (e, stepMod) {
            if (e.which == 1) {
                var input = $('.t-input:first', this.element);
                var step = this.step;

                this.modifyInput(input, stepMod * step);

                this.timeout = setTimeout($t.delegate(this, function () {
                    this.timer = setInterval($t.delegate(this, function () {
                        this.modifyInput(input, stepMod * step);
                    }), 80);

                    this.acceleration = setInterval(function () { step += 1; }, 1000);
                }), 200);
            }
        },

        value: function (value) {
            if (arguments.length == 0) return this.val;

            var parsedValue = (typeof value === typeof 1) ? value : this.parse(value, this.separator);
            var isNull = parsedValue === null;

            this.val = parsedValue;
            $('.t-input:last', this.element).val(isNull ? '' : this.formatEdit(parsedValue));
            $('.t-input:first', this.element)
                    .toggleClass('t-state-error', !this.inRange(this.val, this.minValue, this.maxValue))
                    .val(isNull ? this.text : this.format(parsedValue));
            return this;
        },

        modifyInput: function ($input, step) {

            var value = this.val;
            var min = this.minValue;
            var max = this.maxValue;

            value = value ? value + step : step;
            value = (min !== null && value < min) ? min : (max !== null && value > max) ? max : value;

            var fixedValue = this.round(value, this.digits);

            this.trigger(fixedValue);

            var formatedValue = this.focused ? this.formatEdit(fixedValue) : this.format(fixedValue);

            $input.removeClass('t-state-error').val(formatedValue);
        },

        formatEdit: function (value) {
            var separator = this.separator;
            if (value && separator != '.')
                value = value.toString().replace('.', separator);
            return value;
        },

        format: function (value) {
            return $t.textbox.formatNumber(value,
                                           this.numFormat,
                                           this.digits,
                                           this.separator,
                                           this.groupSeparator,
                                           this.groupSize,
                                           this.positive,
                                           this.negative,
                                           this.symbol,
                                           true);
        },

        trigger: function (newValue) {
            if (this.val != newValue) {
                if ($t.trigger(this.element, 'change', { oldValue: this.val, newValue: newValue })) return;
                $('.t-input:last', this.element).val(this.formatEdit(newValue));
                this.val = newValue;
            }
        },

        parseTrigger: function (value) {
            this.trigger(this.round(this.parse(value, this.separator), this.digits));
        },

        inRange: function (key, min, max) {

            return (min !== null ? key >= min : true) && (max !== null ? key <= max : true);
        },

        parse: function (value, separator) {
            var result = null;
            if (value || value == "0") {
                if (typeof value == typeof 1) return value;

                value = value.replace(this.replaceRegExp, '');
                if (separator && separator != '.')
                    value = value.replace(separator, '.');

                result = parseFloat(value);
            }
            return isNaN(result) ? null : result;
        },

        round: function (value, digits) {
            if (value || value == 0)
                return parseFloat(value.toFixed(digits || 2));
            return null;
        }
    }

    $.fn.tTextBox = function (options) {

        var type = options.type;
        var defaults = $.fn.tTextBox.defaults[type];

        defaults.digits = $t.cultureInfo[type + 'decimaldigits'];
        defaults.separator = $t.cultureInfo[type + 'decimalseparator'];
        defaults.groupSeparator = $t.cultureInfo[type + 'groupseparator'];
        defaults.groupSize = $t.cultureInfo[type + 'groupsize'];
        defaults.positive = $t.cultureInfo[type + 'positive'];
        defaults.negative = $t.cultureInfo[type + 'negative'];
        defaults.symbol = $t.cultureInfo[type + 'symbol'];

        options = $.extend({}, defaults, options);

        return this.each(function () {
            var $$ = $(this);
            options = $.meta ? $.extend({}, options, $$.data()) : options;

            if (!$$.data('tTextBox')) {
                $$.data('tTextBox', new $t.textbox(this, options));
                $t.trigger(this, 'load');
            }
        });
    };

    $.fn.tTextBox.defaults = {
        numeric: {
            val: null,
            minValue: -100,
            maxValue: 100,
            text: '',
            step: 1
        },
        currency: {
            val: null,
            minValue: 0,
            maxValue: 1000,
            text: '',
            step: 1
        },
        percent: {
            val: null,
            minValue: 0,
            maxValue: 100,
            text: '',
            step: 1
        }
    };

    // * - placeholder for the symbol
    // n - placeholder for the number
    $.fn.tTextBox.patterns = {
        numeric: {
            negative: ['(n)', '-n', '- n', 'n-', 'n -']
        },
        currency: {
            positive: ['*n', 'n*', '* n', 'n *'],
            negative: ['(*n)', '-*n', '*-n', '*n-', '(n*)', '-n*', 'n-*', 'n*-', '-n *', '-* n', 'n *-', '* n-', '* -n', 'n- *', '(* n)', '(n *)']
        },
        percent: {
            positive: ['n *', 'n*', '*n'],
            negative: ['-n *', '-n*', '-*n']
        }
    };

    if (!$t.cultureInfo.numericnegative)
        $.extend($t.cultureInfo, { //default en-US settings
            "currencydecimaldigits": 2,
            "currencydecimalseparator": '.',
            "currencygroupseparator": ',',
            "currencygroupsize": 3,
            "currencynegative": 0,
            "currencypositive": 0,
            "currencysymbol": '$',
            "numericdecimaldigits": 2,
            "numericdecimalseparator": '.',
            "numericgroupseparator": ',',
            "numericgroupsize": 3,
            "numericnegative": 1,
            "percentdecimaldigits": 2,
            "percentdecimalseparator": '.',
            "percentgroupseparator": ',',
            "percentgroupsize": 3,
            "percentnegative": 0,
            "percentpositive": 0,
            "percentsymbol": '%'
        });

    var customFormatRegEx = /[0#?]/;

    function reverse(str) {
        return str.split('').reverse().join('');
    }

    function injectInFormat(val, format, appendExtras) {
        var i = 0, j = 0;
        var fLength = format.length;
        var vLength = val.length;
        var builder = new $t.stringBuilder();

        while (i < fLength && j < vLength && format.substring(i).search(customFormatRegEx) >= 0) {

            if (format.charAt(i).match(customFormatRegEx)) {
                builder.cat(val.charAt(j));
                j++;
            }
            else {
                builder.cat(format.charAt(i));
            }
            i++;
        }

        builder.catIf(val.substring(j), j < vLength && appendExtras)
               .catIf(format.substring(i), i < fLength);

        var result = reverse(builder.string());

        var zeroIndex = result.indexOf('0');
        var sharpIndex = result.indexOf('#');

        if (sharpIndex != -1)
            if (zeroIndex != -1) {
                var first = result.slice(0, zeroIndex);
                var second = result.slice(zeroIndex, result.length);
                result = first.replace('#', '') + second.replace('#', '0');
            } else {
                result = result.replace('#', '')
            }

        return appendExtras ? result : reverse(result);
    }

    $t.textbox.formatNumber = function (number,
                                        format,
                                        digits,
                                        separator,
                                        groupSeparator,
                                        groupSize,
                                        positive,
                                        negative,
                                        symbol,
                                        isTextBox) {

        if (!format) return number;

        var type, customFormat, negativeFormat, zeroFormat;
        var sign = number < 0;

        format = format.split(':');
        format = format.length > 1 ? format[1].replace('}', '') : format[0];

        var isCustomFormat = format.search(customFormatRegEx) != -1;

        if (isCustomFormat) {
            format = format.split(';');
            customFormat = format[0];
            negativeFormat = format[1];
            zeroFormat = format[2];
            format = (sign && negativeFormat ? negativeFormat : customFormat).indexOf('%') != -1 ? 'p' : 'n';
        }

        switch (format) {
            case 'd':
            case 'D':
                return Math.round(number).toString();
            case "c":
            case "C":
                type = 'currency'; break;
            case "n":
            case "N":
                type = 'numeric'; break;
            case "p":
            case "P":
                type = 'percent';
                if (!isTextBox) number = Math.abs(number) * 100;
                break;
            default: return number.toString();
        }

        var zeroPad = function (str, count, left) {
            for (var l = str.length; l < count; l++) {
                str = left ? ('0' + str) : (str + '0');
            }
            return str;
        }

        var addGroupSeparator = function (number, groupSeperator, groupSize) {
            if(groupSeparator){
                var regExp = new RegExp('(-?[0-9]+)([0-9]{' + groupSize + '})');
                while (regExp.test(number)) {
                    number = number.replace(regExp, '$1' + groupSeperator + '$2');
                } 
            }
            return number;
        }

        var cultureInfo = cultureInfo || $t.cultureInfo;
        var patterns = $.fn.tTextBox.patterns;

        var undefined;

        //define Number Formating info.
        digits = digits || digits === 0 ? digits : cultureInfo[type + 'decimaldigits'];
        separator = separator !== undefined ? separator : cultureInfo[type + 'decimalseparator'];
        groupSeparator = groupSeparator !== undefined ? groupSeparator : cultureInfo[type + 'groupseparator'];
        groupSize = groupSize || groupSize == 0 ? groupSize : cultureInfo[type + 'groupsize'];
        negative = negative || negative === 0 ? negative : cultureInfo[type + 'negative'];
        positive = positive || positive === 0 ? positive : cultureInfo[type + 'positive'];
        symbol = symbol || cultureInfo[type + 'symbol'];

        var exponent, left, right;

        if (isCustomFormat) {
            var splits = (sign && negativeFormat ? negativeFormat : customFormat).split('.');
            var leftF = splits[0];
            var rightF = splits.length > 1 ? splits[1] : '';
            var lastIndexZero = $t.lastIndexOf(rightF, '0');
            var lastIndexSharp = $t.lastIndexOf(rightF, '#');
            var digits = (lastIndexSharp > lastIndexZero ? lastIndexSharp : lastIndexZero) + 1;
        }

        var factor = Math.pow(10, digits);
        var rounded = (Math.round(number * factor) / factor);
        number = isFinite(rounded) ? rounded : number;

        var split = number.toString().split(/e/i);
        exponent = split.length > 1 ? parseInt(split[1]) : 0;
        split = split[0].split('.');

        left = split[0];
        left = sign ? left.replace('-', '') : left;

        right = split.length > 1 ? split[1] : '';

        if (exponent) {
            if (!sign) {
                right = zeroPad(right, exponent, false);
                left += right.slice(0, exponent);
                right = right.substr(exponent);
            } else {
                left = zeroPad(left, exponent + 1, true);
                right = left.slice(exponent, left.length) + right;
                left = left.slice(0, exponent);
            }
        }

        var rightLength = right.length;
        if (digits < 1 || (isCustomFormat && lastIndexZero == -1 && rightLength === 0))
            right = ''
        else
            right = rightLength > digits ? right.slice(0, digits) : zeroPad(right, digits, false);

        var result;
        if (isCustomFormat) {

            left = injectInFormat(reverse(left), reverse(leftF), true);
            left = leftF.indexOf(',') != -1 ? addGroupSeparator(left, groupSeparator, groupSize) : left;

            right = right && rightF ? injectInFormat(right, rightF) : '';

            result = number === 0 && zeroFormat ? zeroFormat
                : (sign && !negativeFormat ? '-' : '') + left + (right.length > 0 ? separator + right : '');

        } else {

            left = addGroupSeparator(left, groupSeparator, groupSize)
            patterns = patterns[type];
            var pattern = sign ? patterns['negative'][negative]
                            : symbol ? patterns['positive'][positive]
                            : null;

            var numberString = left + (right.length > 0 ? separator + right : '');

            result = pattern ? pattern.replace('n', numberString).replace('*', symbol) : numberString;
        }
        return result;
    }

    $.extend($t.formatters, {
        number: $t.textbox.formatNumber
    });
})(jQuery);
