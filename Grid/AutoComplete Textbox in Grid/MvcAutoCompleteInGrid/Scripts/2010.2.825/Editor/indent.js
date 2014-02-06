function IndentFormatter() {
    var finder = new BlockFormatFinder([{tags:blockElements}]);
    
    function margin(node) {
        return node.style.marginLeft || 0;
    }

    this.apply = function (nodes) {
        var formatNodes = finder.findSuitable(nodes);
        if (formatNodes.length) {
            var targets = [];
            for (var i = 0; i < formatNodes.length;i++)
                if (dom.is(formatNodes[i], 'li')) {
                    if ($(formatNodes[i]).index() == 0)
                        targets.push(formatNodes[i].parentNode);
                    else if ($.inArray(formatNodes[i].parentNode, targets) < 0)
                        targets.push(formatNodes[i]);
                }
                else
                    targets.push(formatNodes[i]);
            
            while (targets.length) {
                var formatNode = targets.shift();
                if (dom.is(formatNode, 'li')) {
                    var parentList = formatNode.parentNode;
                    var $sibling = $(formatNode).prev('li');
                    var nestedList = $sibling.find('>ul')[0];
                    
                    if (!nestedList) {
                        nestedList = dom.create(formatNode.ownerDocument, dom.name(parentList));
                        $sibling.append(nestedList);
                    }
                    
                    while (formatNode && formatNode.parentNode == parentList) {
                        nestedList.appendChild(formatNode);
                        formatNode = targets.shift();
                    }
                } else {
                    var marginLeft = parseInt(margin(formatNode)) + 30;
                    dom.style(formatNode, {marginLeft:marginLeft});
                }
            }
        } else {
            var formatter = new BlockFormatter([{tags:blockElements}], {style:{marginLeft:30}});

            formatter.apply(nodes);
        }
    }
    
    this.remove = function(nodes) {
        var formatNodes = finder.findSuitable(nodes);
        for (var i = 0; i < formatNodes.length; i++) {
            var $formatNode = $(formatNodes[i]);
            
            if ($formatNode.is('li')) {
                var $list = $formatNode.parent();
                var $listParent = $list.parent();
                        
                if ($listParent.is('li') && !margin($list[0])) {
                    var $siblings = $formatNode.nextAll('li');
                    if ($siblings.length)
                        $($list[0].cloneNode(false)).appendTo($formatNode).append($siblings);
                                        
                    $formatNode.insertAfter($listParent);
                    
                    if (!$list.children('li').length)
                        $list.remove();
                        
                    continue;
                } else {
                    $formatNode = $list;
                }
            }
                
            var marginLeft = parseInt(margin($formatNode[0])) - 30;
            dom[marginLeft <= 0 ? 'unstyle' : 'style']($formatNode[0], {marginLeft: marginLeft});
        }
    }
}

function IndentCommand(options) {
    options.formatter = {
        toggle : function(range) {
            new IndentFormatter().apply(RangeUtils.nodes(range));
        }
    };
    Command.call(this, options);
}

function OutdentCommand(options) {
    options.formatter = {
        toggle : function(range) {
            new IndentFormatter().remove(RangeUtils.nodes(range));
        }
    };
    
    Command.call(this, options);
}

function OutdentTool() {
    Tool.call(this, {command:OutdentCommand});
    
    var finder = new BlockFormatFinder([{tags:blockElements}]);  

    this.init = function($ui) {
        $ui.attr('unselectable', 'on')
           .addClass('t-state-disabled');
    }
    
    this.update = function ($ui, nodes) {
        var suitable = finder.findSuitable(nodes);
        for (var i = 0; i < suitable.length;i++)
            if (dom.is(suitable[i], 'li') || suitable[i].style.marginLeft) {
                $ui.removeClass('t-state-disabled');
                return;
            }
    
        $ui.addClass('t-state-disabled').removeClass('t-state-hover');
    }
};