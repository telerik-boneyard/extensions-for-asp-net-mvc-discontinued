function createContentElement($textarea, stylesheets) {
    $textarea.hide();
    var iframe = $('<iframe />', { src: 'javascript:"<html></html>"', frameBorder: '0', className: 't-content' })
                    .css('display', '')
                    .insertBefore($textarea)[0];

    var window = iframe.contentWindow || iframe;
    var document = window.document || iframe.contentDocument;
        
    // <img>\s+\w+ creates invalid nodes after cut in IE
    var html = $textarea.val().replace(/(<\/?img[^>]*>)[\r\n\v\f\t ]+/ig, '$1');

    document.designMode = 'On';
    document.open();
    document.write(
        new $t.stringBuilder()
            .cat('<!DOCTYPE><html><head xmlns="http://www.w3.org/1999/xhtml">')
            .cat('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />')
            .cat('<style type="text/css">')
                .cat('html,body{padding:0;margin:0;font-family:Verdana,Geneva,sans-serif;background:#fff;}')
                .cat('html{font-size:100%}body{font-size:.75em;line-height:1.5em;padding-top:1px;margin-top:-1px;}')
                .cat('h1{font-size:2em;margin:.67em 0}h2{font-size:1.5em}h3{font-size:1.16em}h4{font-size:1em}h5{font-size:.83em}h6{font-size:.7em}')
                .cat('p{margin:1em 0;padding:0 .2em}.t-marker{display:none;}')
                .cat('ul,ol{padding-left:2.5em}')
                .cat('a{color:#00a}')
                .cat('code{font-size:1.23em}')
            .cat('</style>')
            .cat($.map(stylesheets, function(href){ return ['<link type="text/css" href="', href, '" rel="stylesheet"/>'].join(''); }).join(''))
            .cat('</head><body spellcheck="false">')
            .cat(html)
            .cat('</body></html>')
        .string());
        
    document.close();

    return window;
};

function selectionChanged(editor) {
    $t.trigger(editor.element, 'selectionChange');
}

function removePendingFormats(editor) {
    if (editor.pendingFormats.length == 0) return;

    editor.pendingFormats.reverse();

    $.each(editor.pendingFormats, function() {
        for (var node = this.firstChild; node; node = node.nextSibling)
            while (node.nodeType == 3 && (charIndex = node.nodeValue.indexOf('\ufeff')) >= 0)
                node.deleteData(charIndex, 1);
    });

    $.each(editor.pendingFormats, function() {
        if (this.innerHTML == '' && this.parentNode)
            dom.remove(this);
    });

    editor.pendingFormats = [];
}

$t.editor = function (element, options) {
    /* suppress initialization in mobile webkit devices (w/o proper contenteditable support) */
    if (/Mobile.*Safari/.test(navigator.userAgent))
        return;

    var self = this;

    this.element = element;

    var $element = $(element);

    $element.closest('form').bind('submit', function () {
        self.update();
    });

    $.extend(this, options);

    $t.bind(this, {
        load: this.onLoad,
        selectionChange: this.onSelectionChange,
        change: this.onChange,
        execute: this.onExecute
    });
        
    this.textarea = $element.find('textarea').attr('autocomplete', 'off')[0];
    this.window = createContentElement($(this.textarea), this.stylesheets);
    this.document = this.window.contentDocument || this.window.document;
    this.body = this.document.body;
    this.keyboard = new Keyboard([new TypingHandler(this), new SystemHandler(this)]);
        
    this.clipboard = new Clipboard(this);

    this.pendingFormats = [];
        
    this.undoRedoStack = new UndoRedoStack();

    function toolFromClassName(element) {
        var tool = $.grep(element.className.split(' '), function (x) {
            return !/^t-(widget|tool-icon|state-hover|header|combobox|dropdown|selectbox|colorpicker)$/i.test(x);
        });
        return tool[0] ? tool[0].substring(2) : 'custom';
    }

    function appendShortcutSequence(localizedText, tool) {
        if (!tool.key)
            return localizedText;

        return new $t.stringBuilder()
            .cat(localizedText)
            .cat(' (')
                .catIf('Ctrl + ', tool.ctrl)
                .catIf('Shift + ', tool.shift)
                .catIf('Alt + ', tool.alt)
                .cat(tool.key)
            .cat(')')
            .string();
    }

    $(this.window).bind('blur', function () {
        var old = self.textarea.value;
        var value = self.encodedValue();
        self.update(value);
        if (value != old)
            $t.trigger(self.element, 'change')
    });

    var toolbarItems = '.t-editor-toolbar > li > *';
    
    var buttons = '.t-editor-button .t-tool-icon:not(.t-state-disabled)';
    $element
        .delegate(buttons, 'mouseenter', $t.hover)
        .delegate(buttons, 'mouseleave', $t.leave)
        .delegate(buttons, 'mousedown', $t.preventDefault)
        .delegate(buttons, 'click', $t.stopAll(function (e) {
            self.focus();
            self.exec(toolFromClassName(this));
        }))
        .find(toolbarItems)
            .each(function () {
                var toolName = toolFromClassName(this);
                var tool = self.tools[toolName];

                if (!tool)
                    return;

                var description = appendShortcutSequence(self.localization[toolName], tool);

                tool.init($(this), {title:description, editor:self});

            }).end()
        .bind('selectionChange', function() {
            var range = self.getRange();
            self.selectionRestorePoint = new RestorePoint(range);
            var nodes = textNodes(range);
            if (!nodes.length)
                nodes = [range.startContainer];

            $element.find(toolbarItems).each(function () {
                    var tool = self.tools[toolFromClassName(this)];
                    if (tool)
                        tool.update($(this), nodes);
                });
        });

    $(this.document)
        .bind('keyup', function (e) {
            var selectionCodes = [8, 9, 13, 33, 34, 35, 36, 37, 38, 39, 40, 40, 45, 46];

            if ($.inArray(e.keyCode, selectionCodes) > -1)
                selectionChanged(self);
        })
        .keydown(function (e) {
            var toolName = self.keyboard.toolFromShortcut(self.tools, e);
            if (toolName) {
                e.preventDefault();
                self.exec(toolName);
                return false;
            }

            self.keyboard.clearTimeout();

            self.keyboard.keydown(e);
        })
        .keyup(function (e) {
            self.keyboard.keyup(e);
        })
        .mouseup(function () {
            selectionChanged(self);
        });
    
    $(this.body)
        .bind('cut paste', function (e) {
            self.clipboard['on' + e.type](e);
        });
};

$.extend($t.editor, {
    Dom: dom,
    RestorePoint: RestorePoint,
    Marker: Marker,
    RangeUtils: RangeUtils,
    RangeEnumerator: RangeEnumerator,
    LinkFormatter: LinkFormatter,
    LinkFormatFinder: LinkFormatFinder,
    LinkCommand: LinkCommand,
    UnlinkCommand: UnlinkCommand,
    InlineFormatter: InlineFormatter,
    GreedyInlineFormatter: GreedyInlineFormatter,
    InlineFormatFinder: InlineFormatFinder,
    GreedyInlineFormatFinder: GreedyInlineFormatFinder,
    BlockFormatter: BlockFormatter,
    GreedyBlockFormatter: GreedyBlockFormatter,
    BlockFormatFinder: BlockFormatFinder,
    FormatCommand: FormatCommand,
    IndentFormatter: IndentFormatter,
    IndentCommand: IndentCommand,
    OutdentCommand: OutdentCommand,
    ListFormatFinder: ListFormatFinder,
    ListFormatter: ListFormatter,
    ListCommand: ListCommand,
    ParagraphCommand: ParagraphCommand,
    NewLineCommand: NewLineCommand,
    ImageCommand: ImageCommand,
    InsertHtmlCommand: InsertHtmlCommand,
    GenericCommand: GenericCommand,
    UndoRedoStack: UndoRedoStack,
    TypingHandler: TypingHandler,
    SystemHandler: SystemHandler,
    Keyboard: Keyboard,
    MSWordFormatCleaner: MSWordFormatCleaner
});

// public api
$t.editor.prototype = {
    value: function (html) {
        if (html === undefined) return domToXhtml(this.body);

        // Some browsers do not allow setting CDATA sections through innerHTML so we encode them as comments
        html = html.replace(/<!\[CDATA\[(.*)?\]\]>/g, '<!--[CDATA[$1]]-->');

        // Encode script tags to avoid execution and lost content (IE)
        html = html.replace(/<script([^>]*)>(.*)?<\/script>/ig, '<telerik:script $1>$2<\/telerik:script>');

        if ($.browser.msie) {
            // Internet Explorer removes comments from the beginning of the html
            html = '<br/>' + html;

            // IE < 8 makes href and src attributes absolute
            html = html.replace(/href\s*=\s*(?:'|")?([^'">\s]*)(?:'|")?/, 'originalhref="$1"');
            html = html.replace(/src\s*=\s*(?:'|")?([^'">\s]*)(?:'|")?/, 'originalsrc="$1"');

            this.body.innerHTML = html;
            dom.remove(this.body.firstChild);

            $('script,link,img,a', this.body).each(function () {
                if (this['originalhref']) {
                    this.setAttribute('href', this['originalhref']);
                    this.removeAttribute('originalhref');
                }
                if (this['originalsrc']) {
                    this.setAttribute('src', this['originalsrc']);
                    this.removeAttribute('originalsrc');
                }
            })
        } else {
            this.body.innerHTML = html;
        }

        this.update();
    },

    focus: function () {
        this.window.focus();
    },

    update: function (value) {
        this.textarea.value = value || this.encoded ? this.encodedValue() : this.value();
    },

    encodedValue: function () {
        return dom.encode(this.value());
    },

    createRange: function (document) {
        return createRange(document || this.document);
    },

    getSelection: function () {
        return selectionFromDocument(this.document);
    },
        
    selectRange: function(range) {
        var selection = this.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    },

    getRange: function () {
        var selection = this.getSelection();
        return selection.rangeCount > 0 ? selection.getRangeAt(0) : this.createRange();
    },

    selectedHtml: function() {
        return domToXhtml(this.getRange().cloneContents());
    },
    
    paste: function (html) {
        this.clipboard.paste(html);
    },

    exec: function (name, params) {
        name = name.toLowerCase();
        var tool = '';

        for (var id in this.tools)
            if (id.toLowerCase() == name) {
                tool = this.tools[id];
                break;
            }

        if (tool) {
            var range = this.getRange();
            var command = tool.command ? tool.command($.extend({ range: range }, params)) : null;

            $t.trigger(this.element, 'execute', { name: name, command: command });

            if (/undo|redo/i.test(name)) {
                this.undoRedoStack[name]();
            } else if (command) {
                if (!command.managesUndoRedo)
                    this.undoRedoStack.push(command);

                command.editor = this;
                command.exec();

                if (command.async) {
                    command.change = $.proxy(function () { selectionChanged(this); }, this);
                    return;
                }
            }

            selectionChanged(this);
        }
    }
}

$.fn.tEditor = function (options) {
    return $t.create(this, {
        name: 'tEditor',
        init: function (element, options) {
            return new $t.editor(element, options);
        },
        options: options
    });
}

var formats = {
    bold: [
        { tags: ['strong'] },
        { tags: ['span'], attr: { style: { fontWeight: 'bold'}} }
    ],

    italic: [
        { tags: ['em'] },
        { tags: ['span'], attr: { style: { fontStyle: 'italic'}} }
    ],

    underline: [{ tags: ['span'], attr: { style: { textDecoration: 'underline'}}}],

    strikethrough: [
        { tags: ['del'] },
        { tags: ['span'], attr: { style: { textDecoration: 'line-through'}} }
    ],
    
    justifyLeft: [
        { tags: blockElements, attr: { style: { textAlign: 'left'}} },
        { tags: ['img'], attr: { style: { 'float': 'left'}} }
    ],

    justifyCenter: [
        { tags: blockElements, attr: { style: { textAlign: 'center'}} },
        { tags: ['img'], attr: { style: { display: 'block', marginLeft: 'auto', marginRight: 'auto'}} }
    ],

    justifyRight: [
        { tags: blockElements, attr: { style: { textAlign: 'right'}} },
        { tags: ['img'], attr: { style: { 'float': 'right'}} }
    ],

    justifyFull: [
        { tags: blockElements, attr: { style: { textAlign: 'justify'}} }
    ]
};

function formatByName(name, format) {
    for (var i = 0; i < format.length; i++)
        if ($.inArray(name, format[i].tags) >= 0)
            return format[i];
}

function Tool(options) {
    $.extend(this, options);

    this.init = function($ui, options) {
        $ui.attr({ unselectable: 'on', title: options.title });
    }

    this.command = function (commandArguments) {
        return new options.command(commandArguments);
    }

    this.update = function() {

    }
}

Tool.exec = function (editor, name, value) {
    editor.focus();
    if (editor.selectionRestorePoint)
        editor.selectRange(editor.selectionRestorePoint.toRange());
                    
    editor.exec(name, { value: value });
}

function FormatTool(options) {
    Tool.call(this, options);

    this.command = function (commandArguments) {
        return new FormatCommand($.extend(commandArguments, {
                formatter: options.formatter
            }));
    }

    this.update = function($ui, nodes) {
        $ui.toggleClass('t-state-active', options.finder.isFormatted(nodes));
    }
}

var emptyFinder = function () { return { isFormatted: function () { return false } } };

$.fn.tEditor.defaults = {
    localization: {
        bold: 'Bold',
        italic: 'Italic',
        underline: 'Underline',
        strikethrough: 'Strikethrough',
        justifyCenter: 'Center text',
        justifyLeft: 'Align text left',
        justifyRight: 'Align text right',
        justifyFull: 'Justify',
        insertUnorderedList: 'Insert unordered list',
        insertOrderedList: 'Insert ordered list',
        indent: 'Indent',
        outdent: 'Outdent',
        createLink: 'Insert hyperlink',
        unlink: 'Remove hyperlink',
        insertImage: 'Insert image',
        insertHtml: 'Insert HTML',
        fontName: 'Select font family',
        fontSize: 'Select font size',
        formatBlock: 'Format',
        style: 'Styles'
    },
    formats: formats,
    encoded: true,
    stylesheets: [],
    dialogOptions: {
        modal: true, resizable: false, draggable: true,
        effects: {list:[{name:'toggle'}]}
    },
    fontName: [
        { Text: 'inherit',  Value: 'inherit' },
        { Text: 'Arial', Value: "Arial,Helvetica,sans-serif" },
        { Text: 'Courier New', Value: "'Courier New',Courier,monospace" },
        { Text: 'Georgia', Value: "Georgia,serif" },
        { Text: 'Impact', Value: "Impact,Charcoal,sans-serif" },
        { Text: 'Lucida Console', Value: "'Lucida Console',Monaco,monospace" },
        { Text: 'Tahoma', Value: "Tahoma,Geneva,sans-serif" },
        { Text: 'Times New Roman', Value: "'Times New Roman',Times,serif" },
        { Text: 'Trebuchet MS', Value: "'Trebuchet MS',Helvetica,sans-serif" },
        { Text: 'Verdana', Value: "Verdana,Geneva,sans-serif" }
    ],
    fontSize: [
        { Text: 'inherit',  Value: 'inherit' },
        { Text: '1 (8pt)',  Value: 'xx-small' },
        { Text: '2 (10pt)', Value: 'x-small' },
        { Text: '3 (12pt)', Value: 'small' },
        { Text: '4 (14pt)', Value: 'medium' },
        { Text: '5 (18pt)', Value: 'large' },
        { Text: '6 (24pt)', Value: 'x-large' },
        { Text: '7 (36pt)', Value: 'xx-large' }
    ],
    formatBlock: [
        { Text: 'Paragraph', Value: 'p' },
        { Text: 'Quotation', Value: 'blockquote' },
        { Text: 'Heading 1', Value: 'h1' },
        { Text: 'Heading 2', Value: 'h2' },
        { Text: 'Heading 3', Value: 'h3' },
        { Text: 'Heading 4', Value: 'h4' },
        { Text: 'Heading 5', Value: 'h5' },
        { Text: 'Heading 6', Value: 'h6' }
    ],
    tools: {
        bold: new InlineFormatTool({ key: 'B', ctrl: true, format: formats.bold}),
        italic: new InlineFormatTool({ key: 'I', ctrl: true, format: formats.italic}),
        underline: new InlineFormatTool({ key: 'U', ctrl: true, format: formats.underline}),
        strikethrough: new InlineFormatTool({format: formats.strikethrough}),
        undo: { key: 'Z', ctrl: true },
        redo: { key: 'Y', ctrl: true },
        insertLineBreak: new Tool({ key: 13, shift: true, command: NewLineCommand }),
        insertParagraph: new Tool({ key: 13, command: ParagraphCommand }),
        justifyCenter: new BlockFormatTool({format: formats.justifyCenter}),
        justifyLeft: new BlockFormatTool({format: formats.justifyLeft}),
        justifyRight: new BlockFormatTool({format: formats.justifyRight}),
        justifyFull: new BlockFormatTool({format: formats.justifyFull}),
        insertUnorderedList: new ListTool({tag:'ul'}),
        insertOrderedList: new ListTool({tag:'ol'}),
        createLink: new Tool({ key: 'K', ctrl: true, command: LinkCommand}),
        unlink: new UnlinkTool({ key: 'K', ctrl: true, shift: true}),
        insertImage: new Tool({ command: ImageCommand }),
        indent: new Tool({ command: IndentCommand }),
        outdent: new OutdentTool(),
        insertHtml: new InsertHtmlTool(),
        style: new StyleTool(),
        fontName: new FontTool({cssAttr:'font-family', domAttr: 'fontFamily', name:'fontName'}),
        fontSize: new FontTool({cssAttr:'font-size', domAttr:'fontSize', name:'fontSize'}),
        formatBlock: new FormatBlockTool(),
        foreColor: new ColorTool({cssAttr:'color', domAttr:'color', name:'foreColor'}),
        backColor: new ColorTool({cssAttr:'background-color', domAttr: 'backgroundColor', name:'backColor'})
    }
}
})(jQuery);