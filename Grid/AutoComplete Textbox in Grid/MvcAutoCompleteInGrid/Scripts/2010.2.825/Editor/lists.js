function ListFormatFinder(tag) {
    var tags = [tag == 'ul' ? 'ol' : 'ul', tag];
        
    BlockFormatFinder.call(this, [{ tags: tags}]);

    this.isFormatted = function (nodes) {
        var formatNodes = [], formatNode;
            
        for (var i = 0; i < nodes.length; i++)
            if ((formatNode = this.findFormat(nodes[i])) && dom.name(formatNode) == tag && $.inArray(formatNode, formatNodes) < 0)
                formatNodes.push(formatNode);

        return formatNodes.length == 1;
    }

    this.findSuitable = function (nodes) {
        var candidate = dom.parentOfType(nodes[0], tags)
        if (candidate && dom.name(candidate) == tag)
            return candidate;
        return null;
    }
}

function ListFormatter(tag, unwrapTag) {
    var finder = new ListFormatFinder(tag);

    function wrap(list, nodes) {
        var li = dom.create(list.ownerDocument, 'li');

        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];

            if (dom.is(node, 'li')) {
                list.appendChild(node);
                continue;
            }
            
            li.appendChild(node);

            if (dom.isBlock(node)) {
                list.appendChild(li);
                dom.unwrap(node);
                li = li.cloneNode(false);
            }
        }

        if (li.firstChild)
            list.appendChild(li);
    }

    function containsAny(parent, nodes) {
        for (var i = 0; i < nodes.length; i++)
            if (isAncestorOrSelf(parent, nodes[i]))
                return true;

        return false;
    }

    function suitable(candidate, nodes) {
        return containsAny(candidate, nodes) || dom.isInline(candidate) || candidate.nodeType == 3;
    }

    this.split = function (range) {
        var nodes = textNodes(range);
        if (nodes.length) {
            var start = dom.parentOfType(nodes[0], ['li']);
            var end = dom.parentOfType(nodes[nodes.length - 1], ['li'])
            range.setStartBefore(start);
            range.setEndAfter(end);

            for (var i = 0, l = nodes.length; i < l; i++) {
                var formatNode = finder.findFormat(nodes[i]);
                if (formatNode)
                    split(range, formatNode, true);
            }
        }
    }

    this.apply = function (nodes) {
        var commonAncestor = nodes.length == 1 ? dom.parentOfType(nodes[0], ['ul','ol']) : dom.commonAncestor.apply(null, nodes);
            
        if (!commonAncestor)
            commonAncestor = nodes[0].ownerDocument.body;

        if (dom.isInline(commonAncestor))
            commonAncestor = dom.blockParentOrBody(commonAncestor);

        var ancestors = [];

        var formatNode = finder.findSuitable(nodes);

        if (!formatNode)
            formatNode = new ListFormatFinder(tag == 'ul' ? 'ol' : 'ul').findSuitable(nodes);
            
        var childNodes = dom.significantChildNodes(commonAncestor);

        for (var i = 0; i < childNodes.length; i++) {
            var child = childNodes[i];
            var nodeName = dom.name(child);
            if (suitable(child, nodes) && (!formatNode || !isAncestorOrSelf(formatNode, child))) {

                if (formatNode && (nodeName == 'ul' || nodeName == 'ol')) {
                    // merging lists
                    $.each(child.childNodes, function () { ancestors.push(this) });
                    dom.remove(child);
                } else {
                    ancestors.push(child);
                }
            }
        }

        if (ancestors.length == childNodes.length && commonAncestor != nodes[0].ownerDocument.body)
            ancestors = [commonAncestor];

        if (!formatNode) {
            formatNode = dom.create(commonAncestor.ownerDocument, tag);
            dom.insertBefore(formatNode, ancestors[0]);
        }

        wrap(formatNode, ancestors);

        if (!dom.is(formatNode, tag))
            dom.changeTag(formatNode, tag);
    }

    function unwrap(ul) {
        for (var li = ul.firstChild; li; li = li.nextSibling) {
            var p = dom.create(ul.ownerDocument, unwrapTag || 'p');
                
            while(li.firstChild) {
                var child = li.firstChild;
                if (dom.isBlock(child))
                    dom.insertBefore(child, ul);
                else
                    p.appendChild(child);
            }
            if (p.firstChild)
                dom.insertBefore(p, ul);
        }
            
        dom.remove(ul);
    }

    this.remove = function (nodes) {
        var formatNode;
        for (var i = 0, l = nodes.length; i < l; i++)
            if (formatNode = finder.findFormat(nodes[i]))
                unwrap(formatNode);
    }

    this.toggle = function (range) {
        var nodes = textNodes(range);
        if (!nodes.length) {
            range.selectNodeContents(range.commonAncestorContainer);
            nodes = textNodes(range);
            if (!nodes.length)
                nodes = dom.significantChildNodes(range.commonAncestorContainer);
        }
            
        if (finder.isFormatted(nodes)) {
            this.split(range);
            this.remove(nodes);
        } else
            this.apply(nodes);
    }
}

function ListCommand(options) {
    options.formatter = new ListFormatter(options.tag);
    Command.call(this, options);
}

function ListTool(options) {
    FormatTool.call(this, $.extend(options, {
        finder: new ListFormatFinder(options.tag)
    }));

    this.command = function (commandArguments) { 
        return new ListCommand($.extend(commandArguments, { tag: options.tag }));
    }
};