function InlineFormatFinder(format) {
    function numberOfSiblings(referenceNode) {
        var count = 0;

        for (var node = referenceNode.parentNode.firstChild; node; node = node.nextSibling)
            if (node != referenceNode && node.className != 't-marker' && node.nodeType == 1)
                count++;

        return count;
    }

    this.findSuitable = function (sourceNode, skip) {
        if (!skip && numberOfSiblings(sourceNode) > 0)
            return null;

        return dom.parentOfType(sourceNode, format[0].tags);
    }

    this.findFormat = function (sourceNode) {
        for (var i = 0; i < format.length; i++) {
            var node = sourceNode;
            var tags = format[i].tags;
            var attributes = format[i].attr;

            if (node && dom.ofType(node, tags) && attrEquals(node, attributes))
                return node;

            while (node) {
                node = dom.parentOfType(node, tags);
                if (node && attrEquals(node, attributes))
                    return node;
            }
        }

        return null;
    }

    this.isFormatted = function (nodes) {
        for (var i = 0; i < nodes.length; i++)
            if (this.findFormat(nodes[i]))
                return true;

        return false;
    }
}

function InlineFormatter(format, values) {
    this.finder = new InlineFormatFinder(format);

    var attributes = $.extend({}, format[0].attr, values);

    var tag = format[0].tags[0];

    function wrap(node) {
        return dom.wrap(node, dom.create(node.ownerDocument, tag, attributes));
    }

    this.activate = function(range, nodes) {
        if (this.finder.isFormatted(nodes)) {
            this.split(range);
            this.remove(nodes);
        } else
            this.apply(nodes);
    }

    this.toggle = function (range) {
        var nodes = textNodes(range);
        var isPending = nodes.length == 0;
        var caretMarker;

        if (isPending) {
            var markers = getMarkers(range);
            caretMarker = markers[1];
            var invisibleNode = this.editor.document.createTextNode('\ufeff');
            dom.insertBefore(invisibleNode, caretMarker);
            nodes.push(invisibleNode);
            invisibleNode = invisibleNode.cloneNode(true);
            dom.insertAfter(invisibleNode, caretMarker);
            nodes.push(invisibleNode);
            range.setEndAfter(markers[2]);
        }

        this.activate(range, nodes);

        if (isPending)
            this.editor.pendingFormats.push(caretMarker.parentNode);
    }

    this.apply = function (nodes) {
        var formatNodes = [];
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];

            var formatNode = this.finder.findSuitable(node);
            if (formatNode)
                dom.attr(formatNode, attributes);
            else
                formatNode = wrap(node);

            formatNodes.push(formatNode);
        }

        this.consolidate(formatNodes);
    }

    this.remove = function (nodes) {
        for (var i = 0, l = nodes.length; i < l; i++) {
            var formatNode = this.finder.findFormat(nodes[i]);
            if (formatNode)
                dom.unwrap(formatNode);
        }
    }

    this.split = function (range) {
        var nodes = textNodes(range);

        var isPending = nodes.length == 0;
        var caretMarker;

        if (isPending) {
            caretMarker = getMarkers(range)[1];
            nodes.push(caretMarker);
        }

        for (var i = 0, l = nodes.length; i < l; i++) {
            var formatNode = this.finder.findFormat(nodes[i]);
            if (formatNode)
                split(range, formatNode, true);
        }
    }

    this.consolidate = function (nodes) {
        while (nodes.length > 1) {
            var node = nodes.pop();
            var last = nodes[nodes.length - 1];

            if (node.previousSibling && node.previousSibling.className == 't-marker') {
                last.appendChild(node.previousSibling);
            }

            if (node.previousSibling == last && node.style.cssText == last.style.cssText) {
                while (node.firstChild)
                    last.appendChild(node.firstChild);
                dom.remove(node);
            }
        }
    }
}

function GreedyInlineFormatFinder(format, greedyProperty) {
    InlineFormatFinder.call(this, format);

    function getInlineCssValue(node) {
        var attributes = node.attributes,
            trim = $.trim;

        for (var i = 0, l = attributes.length; i < l; i++) {
            var attribute = attributes[i];
            var name = attribute.nodeName;
            var attributeValue = attribute.nodeValue;

            if (attribute.specified && name == 'style') {
                
                var css = trim(attributeValue || node.style.cssText).split(';');

                for (var cssIndex = 0, len = css.length; cssIndex < len; cssIndex++) {
                    var pair = css[cssIndex];
                    if (pair.length) {
                        var propertyAndValue = pair.split(':');
                        var property = trim(propertyAndValue[0].toLowerCase()),
                            value = trim(propertyAndValue[1]);

                        if (property != greedyProperty)
                            continue;

                        return property.indexOf('color') >= 0 ? dom.toHex(value) : value;
                    }
                }
            }
        }

        return;
    }

    function getFormat (node) {
        var $node = $(isDataNode(node) ? node.parentNode : node);
        var parents = $node.parents().andSelf();

        for (var i = 0, len = parents.length; i < len; i++) {
            var value = greedyProperty == 'className' ? parents[i].className : getInlineCssValue(parents[i]);
            if (value)
                return value;
        }

        return 'inherit';
    }

    this.getFormat = function (nodes) {
        var result = getFormat(nodes[0]);

        for (var i = 1, len = nodes.length; i < len; i++)
            if (result != getFormat(nodes[i]))
                return '';

        return result;
    }

    this.isFormatted = function (nodes) {
        return this.getFormat(nodes) !== '';
    }
}

function GreedyInlineFormatter(format, values, greedyProperty) {
    InlineFormatter.call(this, format, values);

    this.finder = new GreedyInlineFormatFinder(format, greedyProperty)

    this.activate = function(range, nodes) {
        this.split(range);
        if (greedyProperty) {
            var camelCase = greedyProperty.replace(/-([a-z])/, function(all, letter){return letter.toUpperCase()});
            this[values.style[camelCase] == 'inherit' ? 'remove' : 'apply'](nodes);
        } else {
            this.apply(nodes);
        }
    }
}

function InlineFormatTool(options) {
    FormatTool.call(this, $.extend(options, {
        finder: new InlineFormatFinder(options.format),
        formatter: function () { return new InlineFormatter(options.format) }
    }));
}

function FontTool(options){
    Tool.call(this, options);

    var finder = new GreedyInlineFormatFinder([{ tags: ['span'] }], options.cssAttr);

    this.command = function (commandArguments) {
        return new FormatCommand($.extend(commandArguments, {
            formatter: function () { 
                var style = {};
                style[options.domAttr] = commandArguments.value;

                return new GreedyInlineFormatter([{ tags: ['span'] }], { style: style }, options.cssAttr); 
            }
        }))        
    }

    this.update = function ($ui, nodes) {
        var list = $ui.data('tComboBox');
        list.close();
        list.value(finder.getFormat(nodes));
    } 
    
    this.init = function($ui, initOptions) {
        var editor = initOptions.editor;
        
        $ui.tComboBox({
            data: editor[options.name],
            onChange: function (e) {
                Tool.exec(editor, options.name, e.value);
            },
            highlightFirst: false
        });

        $ui.data('tComboBox').dropDown.onItemCreate =
            function (e) {
                e.html = '<span unselectable="on" style="' + options.cssAttr +  ': ' + e.dataItem.Value + '">' + e.dataItem.Text + '</span>';
            };
    }
};

function ColorTool (options) {
    Tool.call(this, options);

    var finder = new GreedyInlineFormatFinder([{ tags: ['span'] }], options.cssAttr);
    
    this.update = function($ui) {
        $ui.data('tColorPicker').close();
    }
    
    this.command = function (commandArguments) {

        return new FormatCommand($.extend(commandArguments, {
            formatter: function () { 
                var style = {};
                style[options.domAttr] = commandArguments.value;

                return new GreedyInlineFormatter([{ tags: ['span'] }], { style: style }, options.cssAttr); 
            }
        }))        
    }

    this.init = function($ui, initOptions) {
        var editor = initOptions.editor;
        
        $ui.tColorPicker({
            selectedColor: '#000000',
            onChange: function (e) {
                Tool.exec(editor, options.name, e.value);
            }
        });
    }
}

function StyleTool() {
    Tool.call(this);
    var finder = new GreedyInlineFormatFinder([{ tags: ['span'] }], 'className');
    
    this.command = function (commandArguments) {
        return new FormatCommand($.extend(commandArguments, {
            formatter: function () { 
                return new GreedyInlineFormatter([{ tags: ['span'] }], { className: commandArguments.value }); 
            }
        }));
    }
    
    this.update = function($ui, nodes) {
        var list = $ui.data('tSelectBox');
        list.close();
        list.value(finder.getFormat(nodes));
    }

    this.init = function($ui, initOptions) {
        var editor = initOptions.editor;
        
        $ui.tSelectBox({
            data: editor['style'],
            title: editor.localization.style,
            onItemCreate: function (e) {
                var style = dom.inlineStyle(editor.document, 'span', {className : e.dataItem.Value});
                
                e.html = '<span unselectable="on" style="display:block;' + style +'">' + e.html + '</span>';
            },
            onChange: function (e) {
                Tool.exec(editor, 'style', e.value);
            }
        });
    } 
};